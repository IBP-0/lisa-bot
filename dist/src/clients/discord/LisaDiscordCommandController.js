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
var LisaDiscordCommandController_1;
Object.defineProperty(exports, "__esModule", { value: true });
const chevronjs_1 = require("chevronjs");
const lodash_1 = require("lodash");
const chevron_1 = require("../../chevron");
const LisaStateController_1 = require("../../lisa/LisaStateController");
const LisaStatusService_1 = require("../../lisa/service/LisaStatusService");
const LisaTextService_1 = require("../../lisa/service/LisaTextService");
const logger_1 = require("../../logger");
let LisaDiscordCommandController = LisaDiscordCommandController_1 = class LisaDiscordCommandController {
    constructor(lisaStateController, lisaStatusService, lisaTextService) {
        this.lisaStateController = lisaStateController;
        this.lisaStatusService = lisaStatusService;
        this.lisaTextService = lisaTextService;
    }
    performAction(message, waterModifier, happinessModifier, allowedIds, textSuccess, textDead, textNotAllowed = []) {
        if (allowedIds != null && !allowedIds.includes(message.author.id)) {
            return lodash_1.sample(textNotAllowed);
        }
        if (!this.lisaStatusService.isAlive(this.lisaStateController.getStateCopy())) {
            return lodash_1.sample(textDead);
        }
        this.lisaStateController.modifyStatus(waterModifier, happinessModifier);
        return [lodash_1.sample(textSuccess), this.createStatusText()].join("\n");
    }
    createStatusText() {
        return this.lisaTextService.createStatusText(this.lisaStateController.getStateCopy());
    }
};
LisaDiscordCommandController.logger = logger_1.rootLogger.child({
    target: LisaDiscordCommandController_1
});
LisaDiscordCommandController = LisaDiscordCommandController_1 = __decorate([
    chevronjs_1.Injectable(chevron_1.chevron, {
        bootstrapping: chevronjs_1.DefaultBootstrappings.CLASS,
        dependencies: [LisaStateController_1.LisaStateController, LisaStatusService_1.LisaStatusService, LisaTextService_1.LisaTextService]
    }),
    __metadata("design:paramtypes", [LisaStateController_1.LisaStateController,
        LisaStatusService_1.LisaStatusService,
        LisaTextService_1.LisaTextService])
], LisaDiscordCommandController);
exports.LisaDiscordCommandController = LisaDiscordCommandController;
