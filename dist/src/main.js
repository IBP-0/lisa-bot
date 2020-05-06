"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const lodash_1 = require("lodash");
const inversify_config_1 = require("./inversify.config");
const logger_1 = require("./logger");
const types_1 = require("./types");
const logger = logger_1.rootLogger.child({ target: "main" });
const startLisaMainClient = async () => {
    const lisaStateController = inversify_config_1.container.get(types_1.TYPES.LisaStateController);
    const lisaStorageController = inversify_config_1.container.get(types_1.TYPES.LisaStateStorageController);
    if (await lisaStorageController.hasStoredState()) {
        logger.info("Found stored Lisa state, loading it.");
        lisaStateController.loadState(await lisaStorageController.loadStoredState());
    }
    else {
        logger.info("No stored state found, skipping loading.");
    }
    lisaStorageController.bindStateChangeSubscription(lisaStateController.stateChangeSubject);
    const lisaTimer = inversify_config_1.container.get(types_1.TYPES.LisaTickController);
    lisaTimer.tickObservable.subscribe(({ waterModifier, happinessModifier, byUser }) => lisaStateController.modifyLisaStatus(waterModifier, happinessModifier, byUser));
};
const startLisaDiscordClient = async () => {
    const lisaDiscordClient = inversify_config_1.container.get(types_1.TYPES.DiscordClient);
    const discordToken = process.env.DISCORD_TOKEN;
    if (lodash_1.isNil(discordToken)) {
        throw new Error("No secret set.");
    }
    await lisaDiscordClient.login(discordToken);
    const lisaDiscordController = inversify_config_1.container.get(types_1.TYPES.DiscordEventController);
    lisaDiscordController.bindListeners();
};
logger.info("Starting Lisa main client...");
startLisaMainClient()
    .then(() => logger.info("Started Lisa main client."))
    .catch((e) => console.error("Could not start Lisa main client.", e));
logger.info("Starting Lisa discord client...");
startLisaDiscordClient()
    .then(() => logger.info("Started Lisa discord client."))
    .catch((e) => console.error("Could not start Lisa discord client.", e));
//# sourceMappingURL=main.js.map