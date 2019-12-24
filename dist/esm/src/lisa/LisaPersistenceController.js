var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LisaPersistenceController_1;
import { DefaultBootstrappings, Injectable } from "chevronjs";
import { pathExists } from "fs-extra";
import { throttleTime } from "rxjs/operators";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStateController } from "./LisaStateController";
import { LisaStorageService } from "./service/LisaStorageService";
let LisaPersistenceController = LisaPersistenceController_1 = class LisaPersistenceController {
    constructor(lisaStateController, lisaStorageService) {
        this.lisaStateController = lisaStateController;
        this.lisaStorageService = lisaStorageService;
        this.lisaStateController.stateChangeSubject
            .pipe(throttleTime(LisaPersistenceController_1.STORAGE_THROTTLE_TIMEOUT))
            .subscribe(() => {
            this.storeState().catch(e => LisaPersistenceController_1.logger.error("Could not save state!", e));
        });
    }
    async storedStateExists() {
        return pathExists(LisaPersistenceController_1.STORAGE_PATH);
    }
    async loadStoredState() {
        const state = await this.lisaStorageService.loadStoredState(LisaPersistenceController_1.STORAGE_PATH);
        LisaPersistenceController_1.logger.debug("Loaded stored Lisa state.");
        this.lisaStateController.load(state);
    }
    async storeState() {
        LisaPersistenceController_1.logger.debug(`Saving Lisa's state to '${LisaPersistenceController_1.STORAGE_PATH}'...`);
        await this.lisaStorageService.storeState(LisaPersistenceController_1.STORAGE_PATH, this.lisaStateController.getStateCopy());
        LisaPersistenceController_1.logger.debug(`Saved Lisa's state to '${LisaPersistenceController_1.STORAGE_PATH}'.`);
    }
};
LisaPersistenceController.STORAGE_PATH = "data/lisaState.json";
LisaPersistenceController.STORAGE_THROTTLE_TIMEOUT = 10000;
LisaPersistenceController.logger = rootLogger.child({
    service: LisaStateController
});
LisaPersistenceController = LisaPersistenceController_1 = __decorate([
    Injectable(chevron, {
        bootstrapping: DefaultBootstrappings.CLASS,
        dependencies: [LisaStateController, LisaStorageService]
    }),
    __metadata("design:paramtypes", [LisaStateController,
        LisaStorageService])
], LisaPersistenceController);
export { LisaPersistenceController };
//# sourceMappingURL=LisaPersistenceController.js.map