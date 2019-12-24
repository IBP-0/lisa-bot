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
import { DefaultBootstrappings, Injectable } from "chevronjs";
import { cloneDeep } from "lodash";
import { Subject } from "rxjs";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaDeathCause } from "./LisaState";
const WATER_INITIAL = 100;
const WATER_MIN = 0.1;
const WATER_MAX = 150;
const HAPPINESS_INITIAL = 100;
const HAPPINESS_MIN = 0.1;
const HAPPINESS_MAX = 100;
const USER_SYSTEM = "System";
const createNewLisaState = (createdByUser, highScore = 0) => {
    return {
        highScore,
        status: {
            water: WATER_INITIAL,
            happiness: HAPPINESS_INITIAL
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
    constructor() {
        this.state = createNewLisaState(USER_SYSTEM);
        this.stateChangeSubject = new Subject();
    }
    /**
     * Gets a copy of the state to process e.g. when creating text for the current status.
     *
     * @return copy of the current state.
     */
    getStateCopy() {
        return cloneDeep(this.state);
    }
    /**
     * Only used for loading od persisted data, do not use for regular state changes.
     *
     * @param state State to load.
     */
    load(state) {
        this.state = state;
        this.stateChanged(USER_SYSTEM);
    }
    isLisaAlive() {
        return this.state.death.time == null;
    }
    setWater(water, byUser = USER_SYSTEM) {
        LisaStateController_1.logger.debug(`'${byUser}' set water from ${this.state.status.water} to ${water}.`);
        this.state.status.water = water;
        this.stateChanged(byUser);
    }
    setHappiness(happiness, byUser = USER_SYSTEM) {
        LisaStateController_1.logger.debug(`'${byUser}' set happiness from ${this.state.status.happiness} to ${happiness}.`);
        this.state.status.happiness = happiness;
        this.stateChanged(byUser);
    }
    replantLisa(byUser = USER_SYSTEM) {
        LisaStateController_1.logger.debug(`'${byUser}' replanted lisa.`);
        this.state = createNewLisaState(byUser, this.state.highScore);
        this.stateChanged(byUser);
    }
    killLisa(cause, byUser = USER_SYSTEM) {
        LisaStateController_1.logger.debug(`'${byUser}' killed lisa by ${cause}.`);
        this.state.death = { time: new Date(), byUser, cause };
        this.stateChanged(byUser);
    }
    stateChanged(byUser) {
        LisaStateController_1.logger.silly("Lisa state changed.");
        if (this.isLisaAlive()) {
            // Check stats if alive
            this.checkStats(byUser);
            // Check again to see if Lisa was killed through the update.
            if (!this.isLisaAlive()) {
                this.updateHighScoreIfRequired();
            }
        }
        this.stateChangeSubject.next();
    }
    checkStats(byUser) {
        if (this.state.status.water > WATER_MAX) {
            LisaStateController_1.logger.debug(`Water level ${this.state.status.water} is above limit of ${WATER_MAX} -> ${LisaDeathCause.DROWNING}.`);
            this.killLisa(LisaDeathCause.DROWNING, byUser);
        }
        else if (this.state.status.water < WATER_MIN) {
            LisaStateController_1.logger.debug(`Water level ${this.state.status.water} is below limit of ${WATER_MIN} -> ${LisaDeathCause.DEHYDRATION}.`);
            this.killLisa(LisaDeathCause.DEHYDRATION, byUser);
        }
        if (this.state.status.happiness > HAPPINESS_MAX) {
            LisaStateController_1.logger.debug(`Happiness level ${this.state.status.happiness} is above limit of ${HAPPINESS_MAX} -> reducing to limit.`);
            this.state.status.happiness = HAPPINESS_MAX;
        }
        else if (this.state.status.happiness < HAPPINESS_MIN) {
            LisaStateController_1.logger.debug(`Happiness level ${this.state.status.happiness} is below limit of ${HAPPINESS_MIN} -> ${LisaDeathCause.SADNESS}.`);
            this.killLisa(LisaDeathCause.SADNESS, byUser);
        }
    }
    updateHighScoreIfRequired() {
        const lifetime = this.getLifetime();
        if (lifetime > this.state.highScore) {
            LisaStateController_1.logger.debug(`Increasing high score from ${this.state.highScore} to ${lifetime}.`);
            this.state.highScore = lifetime;
        }
    }
    getLifetime() {
        const birth = this.state.life.time.getTime();
        if (!this.isLisaAlive()) {
            const death = this.state.death.time.getTime();
            return death - birth;
        }
        const now = Date.now();
        return now - birth;
    }
};
LisaStateController.logger = rootLogger.child({
    target: LisaStateController_1
});
LisaStateController = LisaStateController_1 = __decorate([
    Injectable(chevron, {
        bootstrapping: DefaultBootstrappings.CLASS,
        dependencies: []
    }),
    __metadata("design:paramtypes", [])
], LisaStateController);
export { LisaStateController };
//# sourceMappingURL=LisaStateController.js.map