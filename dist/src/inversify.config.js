"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const StateStorageService_1 = require("./core/service/StateStorageService");
const types_1 = require("./types");
const JsonStorageService_1 = require("./core/service/JsonStorageService");
const StatusService_1 = require("./core/service/StatusService");
const StatusTextService_1 = require("./core/service/StatusTextService");
const StateController_1 = require("./core/controller/StateController");
const DiscordCommandController_1 = require("./clients/discord/controller/DiscordCommandController");
const config_1 = require("./config");
const StateStorageController_1 = require("./core/controller/StateStorageController");
const TickController_1 = require("./core/controller/TickController");
const DiscordService_1 = require("./clients/discord/service/DiscordService");
const DiscordClient_1 = require("./clients/discord/DiscordClient");
const DiscordEventController_1 = require("./clients/discord/controller/DiscordEventController");
exports.container = new inversify_1.Container();
exports.container
    .bind(types_1.TYPES.LisaStateStorageService)
    .to(StateStorageService_1.StateStorageService);
exports.container
    .bind(types_1.TYPES.JsonStorageService)
    .to(JsonStorageService_1.JsonStorageService);
exports.container.bind(types_1.TYPES.LisaStatusService).to(StatusService_1.StatusService);
exports.container.bind(types_1.TYPES.LisaTextService).to(StatusTextService_1.StatusTextService);
exports.container
    .bind(types_1.TYPES.LisaStateController)
    .to(StateController_1.StateController)
    .inSingletonScope();
exports.container
    .bind(types_1.TYPES.LisaStateStorageController)
    .to(StateStorageController_1.StateStorageController)
    .inSingletonScope();
exports.container
    .bind(types_1.TYPES.LisaTickController)
    .to(TickController_1.TickController)
    .inSingletonScope();
exports.container.bind(types_1.TYPES.DiscordService).to(DiscordService_1.DiscordService);
exports.container
    .bind(types_1.TYPES.DiscordCommandController)
    .to(DiscordCommandController_1.DiscordCommandController)
    .inSingletonScope();
exports.container
    .bind(types_1.TYPES.DiscordEventController)
    .to(DiscordEventController_1.DiscordEventController)
    .inSingletonScope();
exports.container
    .bind(types_1.TYPES.DiscordClient)
    .to(DiscordClient_1.DiscordClient)
    .inSingletonScope();
exports.container
    .bind(types_1.TYPES.DiscordConfig)
    .toConstantValue(config_1.DISCORD_CLIENT_CONFIG);
//# sourceMappingURL=inversify.config.js.map