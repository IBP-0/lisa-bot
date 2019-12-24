var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LisaStorageController_1;
import { DefaultBootstrappings, Injectable } from "chevronjs";
import { throttleTime } from "rxjs/operators";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStateController } from "./LisaStateController";
import { LisaStorageService } from "./service/LisaStorageService";
let LisaStorageController = LisaStorageController_1 = class LisaStorageController {
    constructor(lisaStateController, lisaStorageService) {
        this.lisaStateController = lisaStateController;
        this.lisaStorageService = lisaStorageService;
    }
    bindListeners() {
        this.lisaStateController.stateChangeSubject
            .pipe(throttleTime(LisaStorageController_1.STORAGE_THROTTLE_TIMEOUT))
            .subscribe(() => this.storeState());
    }
    storeState() {
        this.lisaStorageService
            .storeState(this.lisaStateController.getStateCopy())
            .catch(e => LisaStorageController_1.logger.error("Could not save state!", e));
    }
};
LisaStorageController.STORAGE_THROTTLE_TIMEOUT = 10000;
LisaStorageController.logger = rootLogger.child({
    target: LisaStorageController_1
});
LisaStorageController = LisaStorageController_1 = __decorate([
    Injectable(chevron, {
        bootstrapping: DefaultBootstrappings.CLASS,
        dependencies: [LisaStateController, LisaStorageService]
    }),
    __metadata("design:paramtypes", [LisaStateController,
        LisaStorageService])
], LisaStorageController);
export { LisaStorageController };
//# sourceMappingURL=LisaStorageController.js.map