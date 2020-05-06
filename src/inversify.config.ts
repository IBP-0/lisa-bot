import { Container } from "inversify";
import { LisaStateStorageService } from "./lisa/service/LisaStateStorageService";
import { TYPES } from "./types";
import { JsonStorageService } from "./lisa/service/JsonStorageService";
import { LisaStatusService } from "./lisa/service/LisaStatusService";
import { LisaTextService } from "./lisa/service/LisaTextService";
import { LisaStateController } from "./lisa/controller/LisaStateController";
import { CommandoClientOptions } from "discord.js-commando";
import { DiscordCommandController } from "./clients/discord/controller/DiscordCommandController";
import { DISCORD_CLIENT_CONFIG } from "./config";
import { LisaStateStorageController } from "./lisa/controller/LisaStateStorageController";
import { LisaTickController } from "./lisa/controller/LisaTickController";
import { DiscordService } from "./clients/discord/service/DiscordService";
import { DiscordClient } from "./clients/discord/DiscordClient";
import { DiscordEventController } from "./clients/discord/controller/DiscordEventController";

export const container = new Container();

container
    .bind<LisaStateStorageService>(TYPES.LisaStateStorageService)
    .to(LisaStateStorageService);
container
    .bind<JsonStorageService>(TYPES.JsonStorageService)
    .to(JsonStorageService);
container
    .bind<LisaStatusService>(TYPES.LisaStatusService)
    .to(LisaStatusService);
container.bind<LisaTextService>(TYPES.LisaTextService).to(LisaTextService);

container
    .bind<LisaStateController>(TYPES.LisaStateController)
    .to(LisaStateController)
    .inSingletonScope();
container
    .bind<LisaStateStorageController>(TYPES.LisaStateStorageController)
    .to(LisaStateStorageController)
    .inSingletonScope();
container
    .bind<LisaTickController>(TYPES.LisaTickController)
    .to(LisaTickController)
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
