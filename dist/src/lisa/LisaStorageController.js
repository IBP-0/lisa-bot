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
var LisaStorageController_1;
Object.defineProperty(exports, "__esModule", { value: true });
const chevronjs_1 = require("chevronjs");
const operators_1 = require("rxjs/operators");
const chevron_1 = require("../chevron");
const logger_1 = require("../logger");
const LisaStateController_1 = require("./LisaStateController");
const LisaStorageService_1 = require("./service/LisaStorageService");
let LisaStorageController = LisaStorageController_1 = class LisaStorageController {
    constructor(lisaStateController, lisaStorageService) {
        this.lisaStateController = lisaStateController;
        this.lisaStorageService = lisaStorageService;
    }
    bindListeners() {
        this.lisaStateController.stateChangeSubject
            .pipe(operators_1.throttleTime(LisaStorageController_1.STORAGE_THROTTLE_TIMEOUT))
            .subscribe(() => this.storeState());
    }
    storeState() {
        this.lisaStorageService
            .storeState(this.lisaStateController.getStateCopy())
            .catch(e => LisaStorageController_1.logger.error("Could not save state!", e));
    }
};
LisaStorageController.STORAGE_THROTTLE_TIMEOUT = 10000;
LisaStorageController.logger = logger_1.rootLogger.child({
    target: LisaStorageController_1
});
LisaStorageController = LisaStorageController_1 = __decorate([
    chevronjs_1.Injectable(chevron_1.chevron, {
        bootstrapping: chevronjs_1.DefaultBootstrappings.CLASS,
        dependencies: [LisaStateController_1.LisaStateController, LisaStorageService_1.LisaStorageService]
    }),
    __metadata("design:paramtypes", [LisaStateController_1.LisaStateController,
        LisaStorageService_1.LisaStorageService])
], LisaStorageController);
exports.LisaStorageController = LisaStorageController;
