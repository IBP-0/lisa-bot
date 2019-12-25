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
var LisaStateController_1;
Object.defineProperty(exports, "__esModule", { value: true });
const chevronjs_1 = require("chevronjs");
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const chevron_1 = require("../chevron");
const logger_1 = require("../logger");
const LisaState_1 = require("./LisaState");
const LisaStatusService_1 = require("./service/LisaStatusService");
const moment = require("moment");
const createNewLisaState = (createdByUser, bestLifetime = moment.duration(0)) => {
    return {
        bestLifetime,
        status: {
            water: LisaState_1.WATER_INITIAL,
            happiness: LisaState_1.HAPPINESS_INITIAL
        },
        life: {
            time: new Date(),
            byUser: createdByUser
        },
        death: {
            time: null,
            byUser: null,
            cause: null
        }
    };
};
let LisaStateController = LisaStateController_1 = class LisaStateController {
    constructor(lisaStatusService) {
        this.lisaStatusService = lisaStatusService;
        this.state = createNewLisaState(LisaState_1.USER_SYSTEM);
        this.stateChangeSubject = new rxjs_1.Subject();
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
     * Only used for loading od persisted data, do not use for regular state changes.
     *
     * @param state State to load.
     */
    load(state) {
        this.state = state;
        this.stateChanged(LisaState_1.USER_SYSTEM);
    }
    replantLisa(byUser = LisaState_1.USER_SYSTEM) {
        LisaStateController_1.logger.debug(`'${byUser}' replanted lisa.`);
        this.state = createNewLisaState(byUser, this.state.bestLifetime);
        this.stateChanged(byUser);
    }
    killLisa(cause, byUser = LisaState_1.USER_SYSTEM) {
        LisaStateController_1.logger.debug(`'${byUser}' killed lisa by ${cause}.`);
        this.state.death = { time: new Date(), byUser, cause };
        this.stateChanged(byUser);
    }
    setWater(water, byUser = LisaState_1.USER_SYSTEM) {
        LisaStateController_1.logger.debug(`'${byUser}' set water from ${this.state.status.water} to ${water}.`);
        this.state.status.water = water;
        this.stateChanged(byUser);
    }
    setHappiness(happiness, byUser = LisaState_1.USER_SYSTEM) {
        LisaStateController_1.logger.debug(`'${byUser}' set happiness from ${this.state.status.happiness} to ${happiness}.`);
        this.state.status.happiness = happiness;
        this.stateChanged(byUser);
    }
    stateChanged(byUser) {
        LisaStateController_1.logger.silly("Lisa state changed.");
        if (this.lisaStatusService.isAlive(this.getStateCopy())) {
            // Check stats if alive
            this.checkStats(byUser);
            // Check again to see if Lisa was killed through the update.
            if (!this.lisaStatusService.isAlive(this.getStateCopy())) {
                this.updateHighScoreIfRequired();
            }
        }
        this.stateChangeSubject.next();
    }
    checkStats(byUser) {
        if (this.state.status.water > LisaState_1.WATER_MAX) {
            LisaStateController_1.logger.debug(`Water level ${this.state.status.water} is above limit of ${LisaState_1.WATER_MAX} -> ${LisaState_1.LisaDeathCause.DROWNING}.`);
            this.killLisa(LisaState_1.LisaDeathCause.DROWNING, byUser);
        }
        else if (this.state.status.water < LisaState_1.WATER_MIN) {
            LisaStateController_1.logger.debug(`Water level ${this.state.status.water} is below limit of ${LisaState_1.WATER_MIN} -> ${LisaState_1.LisaDeathCause.DEHYDRATION}.`);
            this.killLisa(LisaState_1.LisaDeathCause.DEHYDRATION, byUser);
        }
        if (this.state.status.happiness > LisaState_1.HAPPINESS_MAX) {
            LisaStateController_1.logger.debug(`Happiness level ${this.state.status.happiness} is above limit of ${LisaState_1.HAPPINESS_MAX} -> reducing to limit.`);
            this.state.status.happiness = LisaState_1.HAPPINESS_MAX;
        }
        else if (this.state.status.happiness < LisaState_1.HAPPINESS_MIN) {
            LisaStateController_1.logger.debug(`Happiness level ${this.state.status.happiness} is below limit of ${LisaState_1.HAPPINESS_MIN} -> ${LisaState_1.LisaDeathCause.SADNESS}.`);
            this.killLisa(LisaState_1.LisaDeathCause.SADNESS, byUser);
        }
    }
    updateHighScoreIfRequired() {
        const lifetime = this.lisaStatusService.getLifetime(this.getStateCopy());
        if (lifetime > this.state.bestLifetime) {
            LisaStateController_1.logger.debug(`Increasing high score from ${this.state.bestLifetime} to ${lifetime}.`);
            this.state.bestLifetime = lifetime;
        }
    }
};
LisaStateController.logger = logger_1.rootLogger.child({
    target: LisaStateController_1
});
LisaStateController = LisaStateController_1 = __decorate([
    chevronjs_1.Injectable(chevron_1.chevron, {
        bootstrapping: chevronjs_1.DefaultBootstrappings.CLASS,
        dependencies: [LisaStatusService_1.LisaStatusService]
    }),
    __metadata("design:paramtypes", [LisaStatusService_1.LisaStatusService])
], LisaStateController);
exports.LisaStateController = LisaStateController;
