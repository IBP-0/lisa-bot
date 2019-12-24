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
const createInitialLisaState = () => {
    return {
        status: {
            water: 100,
            happiness: 100
        },
        life: {
            time: new Date(),
            byUser: "System"
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
        this.stateChangeSubject.next();
    }
    isAlive() {
        return this.state.death.time == null;
    }
    getWater() {
        return this.state.status.water;
    }
    setWater(water) {
        this.state.status.water = water;
        this.stateChangeSubject.next();
    }
    getHappiness() {
        return this.state.status.happiness;
    }
    setHappiness(happiness) {
        this.state.status.happiness = happiness;
        this.stateChangeSubject.next();
    }
    getHighScore() {
        return this.state.highScore;
    }
    setHighScore(highScore) {
        this.state.highScore = highScore;
        this.stateChangeSubject.next();
    }
    getLife() {
        return clone(this.state.life);
    }
    setLife(time, byUser) {
        this.state.life = { time, byUser };
        this.stateChangeSubject.next();
    }
    getDeath() {
        return clone(this.state.death);
    }
    setDeath(time, byUser, cause) {
        this.state.death = { time, byUser, cause };
        this.stateChangeSubject.next();
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