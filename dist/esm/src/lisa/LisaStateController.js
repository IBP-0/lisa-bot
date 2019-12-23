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
import { pathExists } from "fs-extra";
import { clone, cloneDeep } from "lodash";
import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStorageService } from "./service/LisaStorageService";
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
let LisaStateController = LisaStateController_1 = class LisaStateController {
    constructor(lisaStorageService) {
        this.lisaStorageService = lisaStorageService;
        this.state = createInitialLisaState();
        this.stateChangeSubject = new Subject();
        this.storeSubscription = this.stateChangeSubject
            .pipe(throttleTime(LisaStateController_1.STORAGE_THROTTLE_TIMEOUT))
            .subscribe(() => {
            this.storeState().catch(e => LisaStateController_1.logger.error("Could not save state!", e));
        });
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
    getStateCopy() {
        return cloneDeep(this.state);
    }
    async storedStateExists() {
        return pathExists(LisaStateController_1.STORAGE_PATH);
    }
    async loadStoredState() {
        this.state = await this.lisaStorageService.loadStoredState(LisaStateController_1.STORAGE_PATH);
        LisaStateController_1.logger.debug("Loaded stored Lisa state.");
        this.stateChangeSubject.next();
    }
    async storeState() {
        LisaStateController_1.logger.debug(`Saving Lisa's state to '${LisaStateController_1.STORAGE_PATH}'...`);
        await this.lisaStorageService.storeState(LisaStateController_1.STORAGE_PATH, this.state);
        LisaStateController_1.logger.debug(`Saved Lisa's state to '${LisaStateController_1.STORAGE_PATH}'.`);
    }
};
LisaStateController.STORAGE_PATH = "data/lisaState.json";
LisaStateController.logger = rootLogger.child({
    service: LisaStateController_1
});
LisaStateController.STORAGE_THROTTLE_TIMEOUT = 10000;
LisaStateController = LisaStateController_1 = __decorate([
    Injectable(chevron, {
        bootstrapping: DefaultBootstrappings.CLASS,
        dependencies: [LisaStorageService]
    }),
    __metadata("design:paramtypes", [LisaStorageService])
], LisaStateController);
export { LisaStateController };
//# sourceMappingURL=LisaStateController.js.map