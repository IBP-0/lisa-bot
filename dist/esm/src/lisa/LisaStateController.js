var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DefaultBootstrappings, Injectable } from "chevronjs";
import { clone, cloneDeep } from "lodash";
import { Subject } from "rxjs";
import { chevron } from "../chevron";
import { LisaDeathCause } from "./LisaState";
const WATER_INITIAL = 100;
const WATER_MIN = 0.1;
const WATER_MAX = 150;
const HAPPINESS_INITIAL = 100;
const HAPPINESS_MIN = 0.1;
const HAPPINESS_MAX = 100;
const USER_SYSTEM = "System";
const createInitialLisaState = () => {
    return {
        status: {
            water: WATER_INITIAL,
            happiness: HAPPINESS_INITIAL
        },
        life: {
            time: new Date(),
            byUser: USER_SYSTEM
        },
        death: {
            time: null,
            byUser: null,
            cause: null
        },
        highScore: 0
    };
};
let LisaStateController = class LisaStateController {
    constructor() {
        this.state = createInitialLisaState();
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
    isAlive() {
        return this.state.death.time == null;
    }
    getWater() {
        return this.state.status.water;
    }
    setWater(water, byUser = USER_SYSTEM) {
        this.state.status.water = water;
        this.stateChanged(byUser);
    }
    getHappiness() {
        return this.state.status.happiness;
    }
    setHappiness(happiness, byUser = USER_SYSTEM) {
        this.state.status.happiness = happiness;
        this.stateChanged(byUser);
    }
    getHighScore() {
        return this.state.highScore;
    }
    getLife() {
        return clone(this.state.life);
    }
    setLife(byUser = USER_SYSTEM) {
        this.state.life = { time: new Date(), byUser };
        this.stateChanged(byUser);
    }
    getDeath() {
        return clone(this.state.death);
    }
    setDeath(cause, byUser = USER_SYSTEM) {
        this.state.death = { time: new Date(), byUser, cause };
        this.stateChanged(byUser);
    }
    stateChanged(byUser) {
        if (this.isAlive()) {
            // Adjust stats if alive
            this.updateStats(byUser);
            // Check again to see if Lisa was killed through the update.
            if (!this.isAlive()) {
                this.updateHighScoreIfRequired();
            }
        }
        this.stateChangeSubject.next();
    }
    updateStats(byUser) {
        if (this.state.status.water > WATER_MAX) {
            this.setDeath(LisaDeathCause.DROWNING, byUser);
        }
        else if (this.state.status.water < WATER_MIN) {
            this.setDeath(LisaDeathCause.DEHYDRATION, byUser);
        }
        if (this.state.status.happiness > HAPPINESS_MAX) {
            this.state.status.happiness = HAPPINESS_MAX;
        }
        else if (this.state.status.happiness < HAPPINESS_MIN) {
            this.setDeath(LisaDeathCause.SADNESS, byUser);
        }
    }
    updateHighScoreIfRequired() {
        const lifetime = this.getLifetime();
        if (lifetime > this.state.highScore) {
            this.state.highScore = lifetime;
        }
    }
    getLifetime() {
        const birth = this.state.life.time.getTime();
        if (!this.isAlive()) {
            const death = this.state.death.time.getTime();
            return death - birth;
        }
        const now = Date.now();
        return now - birth;
    }
};
LisaStateController = __decorate([
    Injectable(chevron, {
        bootstrapping: DefaultBootstrappings.CLASS,
        dependencies: []
    }),
    __metadata("design:paramtypes", [])
], LisaStateController);
export { LisaStateController };
//# sourceMappingURL=LisaStateController.js.map