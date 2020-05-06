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
var DiscordEventController_1;
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const StateController_1 = require("../../../core/controller/StateController");
const StatusTextService_1 = require("../../../core/service/StatusTextService");
const logger_1 = require("../../../logger");
const DiscordClient_1 = require("../DiscordClient");
const inversify_1 = require("inversify");
const types_1 = require("../../../types");
const createPresence = (name) => {
    return {
        activity: {
            name,
        },
    };
};
let DiscordEventController = DiscordEventController_1 = class DiscordEventController {
    constructor(lisaStateController, lisaDiscordClient, lisaTextService) {
        this.lisaTextService = lisaTextService;
        this.lisaDiscordClient = lisaDiscordClient;
        this.lisaStateController = lisaStateController;
    }
    bindListeners() {
        this.lisaDiscordClient
            .getMessageObservable()
            .pipe(operators_1.filter((message) => !message.system && !message.author.bot), operators_1.throttleTime(DiscordEventController_1.MESSAGE_THROTTLE_TIMEOUT))
            .subscribe(() => this.onMessage());
        this.lisaStateController.stateChangeSubject
            .pipe(operators_1.throttleTime(DiscordEventController_1.PRESENCE_UPDATE_THROTTLE_TIMEOUT))
            .subscribe((state) => this.onStateChange(state));
        this.onStateChange(this.lisaStateController.getStateCopy());
    }
    onMessage() {
        DiscordEventController_1.logger.silly("A message was sent, increasing happiness.");
        this.lisaStateController.modifyLisaStatus(0, DiscordEventController_1.MESSAGE_HAPPINESS_MODIFIER, DiscordEventController_1.USER_DISCORD_ACTIVITY);
    }
    onStateChange(state) {
        const statusLabel = `${this.lisaTextService.createStatusLabel(state)}.`;
        DiscordEventController_1.logger.debug(`Updating presence to '${statusLabel}'...`);
        this.lisaDiscordClient
            .setPresence(createPresence(statusLabel))
            .then(() => DiscordEventController_1.logger.debug("Updated presence."))
            .catch((e) => DiscordEventController_1.logger.error("Could not update presence.", e));
    }
};
DiscordEventController.logger = logger_1.rootLogger.child({
    target: DiscordEventController_1,
});
DiscordEventController.PRESENCE_UPDATE_THROTTLE_TIMEOUT = 10000;
DiscordEventController.MESSAGE_THROTTLE_TIMEOUT = 1000;
DiscordEventController.MESSAGE_HAPPINESS_MODIFIER = 0.25;
DiscordEventController.USER_DISCORD_ACTIVITY = "Discord activity";
DiscordEventController = DiscordEventController_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LisaStateController)),
    __param(1, inversify_1.inject(types_1.TYPES.DiscordClient)),
    __param(2, inversify_1.inject(types_1.TYPES.LisaTextService)),
    __metadata("design:paramtypes", [StateController_1.StateController,
        DiscordClient_1.DiscordClient,
        StatusTextService_1.StatusTextService])
], DiscordEventController);
exports.DiscordEventController = DiscordEventController;
