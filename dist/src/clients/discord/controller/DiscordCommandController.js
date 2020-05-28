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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordCommandController = void 0;
const lodash_1 = require("lodash");
const StateController_1 = require("../../../core/controller/StateController");
const StatusService_1 = require("../../../core/service/StatusService");
const StatusTextService_1 = require("../../../core/service/StatusTextService");
const DiscordService_1 = require("../service/DiscordService");
const logger_js_1 = require("../../../logger.js");
const inversify_1 = require("inversify");
const types_1 = require("../../../types");
let DiscordCommandController = /** @class */ (() => {
    var DiscordCommandController_1;
    let DiscordCommandController = DiscordCommandController_1 = class DiscordCommandController {
        constructor(lisaStateController, lisaStatusService, lisaTextService, lisaDiscordService) {
            this.lisaDiscordService = lisaDiscordService;
            this.lisaTextService = lisaTextService;
            this.lisaStatusService = lisaStatusService;
            this.lisaStateController = lisaStateController;
        }
        performAction(author, waterModifier, happinessModifier, allowedUserIds, textSuccess, textDead, textNotAllowed = []) {
            if (!this.lisaDiscordService.isUserAllowed(allowedUserIds, author)) {
                return lodash_1.sample(textNotAllowed);
            }
            if (!this.isAlive()) {
                return lodash_1.sample(textDead);
            }
            const byUser = this.lisaDiscordService.getFullUserName(author);
            DiscordCommandController_1.logger.info(`Discord user '${byUser}' modified status; water modifier ${waterModifier}, happiness modifier ${happinessModifier}.`);
            this.lisaStateController.modifyLisaStatus(waterModifier, happinessModifier, byUser);
            return [lodash_1.sample(textSuccess), this.createStatusText()].join("\n");
        }
        performKill(author, cause, allowedUserIds, textSuccess, textAlreadyDead, textNotAllowed = []) {
            if (!this.lisaDiscordService.isUserAllowed(allowedUserIds, author)) {
                return lodash_1.sample(textNotAllowed);
            }
            if (!this.isAlive()) {
                return lodash_1.sample(textAlreadyDead);
            }
            this.lisaStateController.killLisa(cause, this.lisaDiscordService.getFullUserName(author));
            return [lodash_1.sample(textSuccess), this.createStatusText()].join("\n");
        }
        performReplant(author, allowedUserIds, textWasAlive, textWasDead, textNotAllowed = []) {
            if (!this.lisaDiscordService.isUserAllowed(allowedUserIds, author)) {
                return lodash_1.sample(textNotAllowed);
            }
            const wasAlive = this.isAlive();
            this.lisaStateController.replantLisa(this.lisaDiscordService.getFullUserName(author));
            return lodash_1.sample(wasAlive ? textWasAlive : textWasDead);
        }
        createStatusText() {
            return this.lisaTextService.createStatusText(this.lisaStateController.getStateCopy());
        }
        isAlive() {
            return this.lisaStatusService.isAlive(this.lisaStateController.getStateCopy());
        }
    };
    DiscordCommandController.logger = logger_js_1.rootLogger.child({
        target: DiscordCommandController_1,
    });
    DiscordCommandController = DiscordCommandController_1 = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.LisaStateController)),
        __param(1, inversify_1.inject(types_1.TYPES.LisaStatusService)),
        __param(2, inversify_1.inject(types_1.TYPES.LisaTextService)),
        __param(3, inversify_1.inject(types_1.TYPES.DiscordService)),
        __metadata("design:paramtypes", [StateController_1.StateController,
            StatusService_1.StatusService,
            StatusTextService_1.StatusTextService,
            DiscordService_1.DiscordService])
    ], DiscordCommandController);
    return DiscordCommandController;
})();
exports.DiscordCommandController = DiscordCommandController;
//# sourceMappingURL=DiscordCommandController.js.map