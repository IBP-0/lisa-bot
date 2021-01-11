import { Container } from "inversify";
import { StateStorageService } from "./core/service/StateStorageService";
import { TYPES } from "./types";
import { JsonStorageService } from "./core/service/JsonStorageService";
import { StatusService } from "./core/service/StatusService";
import { StatusTextService } from "./core/service/StatusTextService";
import { StateController } from "./core/controller/StateController";
import { CommandoClientOptions } from "discord.js-commando";
import { DiscordCommandController } from "./clients/discord/controller/DiscordCommandController";
import { DISCORD_CLIENT_CONFIG } from "./config";
import { StateStorageController } from "./core/controller/StateStorageController";
import { TickController } from "./core/controller/TickController";
import { DiscordService } from "./clients/discord/service/DiscordService";
import { DiscordClient } from "./clients/discord/DiscordClient";
import { DiscordEventController } from "./clients/discord/controller/DiscordEventController";

export const container = new Container();

container
    .bind<StateStorageService>(TYPES.LisaStateStorageService)
    .to(StateStorageService);
container
    .bind<JsonStorageService>(TYPES.JsonStorageService)
    .to(JsonStorageService);
container.bind<StatusService>(TYPES.LisaStatusService).to(StatusService);
container.bind<StatusTextService>(TYPES.LisaTextService).to(StatusTextService);

container
    .bind<StateController>(TYPES.LisaStateController)
    .to(StateController)
    .inSingletonScope();
container
    .bind<StateStorageController>(TYPES.LisaStateStorageController)
    .to(StateStorageController)
    .inSingletonScope();
container
    .bind<TickController>(TYPES.LisaTickController)
    .to(TickController)
    .inSingletonScope();

container.bind<DiscordService>(TYPES.DiscordService).to(DiscordService);

container
    .bind<DiscordCommandController>(TYPES.DiscordCommandController)
    .to(DiscordCommandController)
    .inSingletonScope();
container
    .bind<DiscordEventController>(TYPES.DiscordEventController)
    .to(DiscordEventController)
    .inSingletonScope();
container
    .bind<DiscordClient>(TYPES.DiscordClient)
    .to(DiscordClient)
    .inSingletonScope();

container
    .bind<CommandoClientOptions>(TYPES.DiscordConfig)
    .toConstantValue(DISCORD_CLIENT_CONFIG);
