"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StateController_1;
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const moment_1 = require("moment");
const rxjs_1 = require("rxjs");
const logger_1 = require("../../logger");
const LisaState_1 = require("../LisaState");
const StatusService_1 = require("../service/StatusService");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
let StateController = StateController_1 = class StateController {
    constructor(lisaStatusService) {
        this.lisaStatusService = lisaStatusService;
        this.state = StateController_1.createNewLisaState(StateController_1.USER_SYSTEM, moment_1.duration(0));
        this.stateChangeSubject = new rxjs_1.Subject();
        rxjs_1.interval(StateController_1.BEST_LIFETIME_CHECK_TIMEOUT).subscribe(() => this.updateBestLifetimeIfRequired());
    }
    static createNewLisaState(createdByUser, bestLifetime) {
        return {
            bestLifetime,
            status: {
                water: LisaState_1.WATER_INITIAL,
                happiness: LisaState_1.HAPPINESS_INITIAL,
            },
            life: {
                time: new Date(),
                byUser: createdByUser,
            },
            death: {
                time: null,
                byUser: null,
                cause: null,
            },
        };
    }
    /**
     * Gets a copy of the state to process e.g. when creating text for the current status.
     *
     * @return copy of the current state.
     */
    getStateCopy() {
        return lodash_1.cloneDeep(this.state);
    }
    /**
     * Only used for loading persisted data, do not use for regular state changes.
     *
     * @param state State to load.
     */
    loadState(state) {
        this.state = state;
        this.stateChanged();
    }
    replantLisa(byUser = StateController_1.USER_SYSTEM) {
        StateController_1.logger.info(`'${byUser}' replanted lisa.`);
        this.performReplant(byUser);
        this.stateChanged();
    }
    killLisa(cause, byUser = StateController_1.USER_SYSTEM) {
        if (!this.lisaStatusService.isAlive(this.getStateCopy())) {
            StateController_1.logger.debug("Lisa is already dead, skip kill.");
            return;
        }
        StateController_1.logger.info(`'${byUser}' killed lisa by ${cause}.`);
        this.performKill(cause, byUser);
        this.stateChanged();
    }
    modifyLisaStatus(waterModifier, happinessModifier, byUser = StateController_1.USER_SYSTEM) {
        if (!this.lisaStatusService.isAlive(this.getStateCopy())) {
            StateController_1.logger.debug("Lisa is dead, skip status change.");
            return;
        }
        StateController_1.logger.debug(`'${byUser}' modified status; water modifier ${waterModifier}, happiness modifier ${happinessModifier}.`);
        this.performModifyStatus(waterModifier, happinessModifier, byUser);
        this.stateChanged();
    }
    performReplant(byUser) {
        this.state = StateController_1.createNewLisaState(byUser, this.state.bestLifetime);
    }
    performKill(cause, byUser) {
        this.state.death = { time: new Date(), byUser, cause };
    }
    performModifyStatus(waterModifier, happinessModifier, byUser) {
        this.state.status.water += waterModifier;
        this.state.status.happiness += happinessModifier;
        this.checkStats(byUser);
    }
    checkStats(byUser) {
        if (this.state.status.water > LisaState_1.WATER_MAX) {
            StateController_1.logger.silly(`Water level ${this.state.status.water} is above limit of ${LisaState_1.WATER_MAX} -> ${LisaState_1.LisaDeathCause.DROWNING}.`);
            this.performKill(LisaState_1.LisaDeathCause.DROWNING, byUser);
        }
        else if (this.state.status.water < LisaState_1.WATER_MIN) {
            StateController_1.logger.silly(`Water level ${this.state.status.water} is below limit of ${LisaState_1.WATER_MIN} -> ${LisaState_1.LisaDeathCause.DEHYDRATION}.`);
            this.performKill(LisaState_1.LisaDeathCause.DEHYDRATION, byUser);
        }
        if (this.state.status.happiness > LisaState_1.HAPPINESS_MAX) {
            StateController_1.logger.silly(`Happiness level ${this.state.status.happiness} is above limit of ${LisaState_1.HAPPINESS_MAX} -> reducing to limit.`);
            this.state.status.happiness = LisaState_1.HAPPINESS_MAX;
        }
        else if (this.state.status.happiness < LisaState_1.HAPPINESS_MIN) {
            StateController_1.logger.silly(`Happiness level ${this.state.status.happiness} is below limit of ${LisaState_1.HAPPINESS_MIN} -> ${LisaState_1.LisaDeathCause.SADNESS}.`);
            this.performKill(LisaState_1.LisaDeathCause.SADNESS, byUser);
        }
    }
    stateChanged() {
        StateController_1.logger.silly("Lisa state changed.");
        this.stateChangeSubject.next(this.getStateCopy());
    }
    updateBestLifetimeIfRequired() {
        const lifetime = this.lisaStatusService.getLifetime(this.getStateCopy());
        if (lifetime > this.state.bestLifetime) {
            StateController_1.logger.silly(`Increasing high score from ${this.state.bestLifetime.milliseconds()} to ${lifetime.milliseconds()}.`);
            this.state.bestLifetime = lifetime;
        }
    }
};
StateController.logger = logger_1.rootLogger.child({
    target: StateController_1,
});
StateController.USER_SYSTEM = "System";
StateController.BEST_LIFETIME_CHECK_TIMEOUT = 5000;
StateController = StateController_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LisaStatusService)),
    __metadata("design:paramtypes", [StatusService_1.StatusService])
], StateController);
exports.StateController = StateController;
