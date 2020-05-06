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
var StateStorageController_1;
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const logger_1 = require("../../logger");
const JsonStorageService_1 = require("../service/JsonStorageService");
const StateStorageService_1 = require("../service/StateStorageService");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
let StateStorageController = StateStorageController_1 = class StateStorageController {
    constructor(jsonStorageService, lisaStateStorageService) {
        this.lisaStateStorageService = lisaStateStorageService;
        this.jsonStorageService = jsonStorageService;
    }
    bindStateChangeSubscription(stateChangeSubject) {
        stateChangeSubject
            .pipe(operators_1.throttleTime(StateStorageController_1.STORAGE_THROTTLE_TIMEOUT))
            .subscribe((state) => {
            this.storeState(state).catch((e) => StateStorageController_1.logger.error("Could not save state!", e));
        });
    }
    async hasStoredState() {
        return this.jsonStorageService.hasStorageKey(StateStorageController_1.STORAGE_PATH, StateStorageController_1.STORAGE_KEY);
    }
    async loadStoredState() {
        const storedState = await this.jsonStorageService.load(StateStorageController_1.STORAGE_PATH, StateStorageController_1.STORAGE_KEY);
        return this.lisaStateStorageService.fromStorable(storedState);
    }
    async storeState(state) {
        const jsonLisaState = this.lisaStateStorageService.toStorable(state);
        return await this.jsonStorageService.store(StateStorageController_1.STORAGE_PATH, StateStorageController_1.STORAGE_KEY, jsonLisaState);
    }
};
StateStorageController.STORAGE_THROTTLE_TIMEOUT = 10000;
StateStorageController.STORAGE_PATH = "data/storage.json";
StateStorageController.STORAGE_KEY = "lisaState";
StateStorageController.logger = logger_1.rootLogger.child({
    target: StateStorageController_1,
});
StateStorageController = StateStorageController_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.JsonStorageService)),
    __param(1, inversify_1.inject(types_1.TYPES.LisaStateStorageService)),
    __metadata("design:paramtypes", [JsonStorageService_1.JsonStorageService,
        StateStorageService_1.StateStorageService])
], StateStorageController);
exports.StateStorageController = StateStorageController;
//# sourceMappingURL=StateStorageController.js.map