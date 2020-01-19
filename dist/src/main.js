"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const chevron_1 = require("./chevron");
const DiscordEventController_1 = require("./clients/discord/controller/DiscordEventController");
const DiscordClient_1 = require("./clients/discord/DiscordClient");
const LisaStateController_1 = require("./lisa/controller/LisaStateController");
const LisaStateStorageController_1 = require("./lisa/controller/LisaStateStorageController");
const LisaTickController_1 = require("./lisa/controller/LisaTickController");
const logger_1 = require("./logger");
const logger = logger_1.rootLogger.child({ target: "main" });
const startLisaMainClient = async () => {
    const lisaStateController = chevron_1.chevron.getInjectableInstance(LisaStateController_1.LisaStateController);
    const lisaStorageController = chevron_1.chevron.getInjectableInstance(LisaStateStorageController_1.LisaStateStorageController);
    if (await lisaStorageController.hasStoredState()) {
        logger.info("Found stored Lisa state, loading it.");
        lisaStateController.loadState(await lisaStorageController.loadStoredState());
    }
    else {
        logger.info("No stored state found, skipping loading.");
    }
    lisaStorageController.bindStateChangeSubscription(lisaStateController.stateChangeSubject);
    const lisaTimer = chevron_1.chevron.getInjectableInstance(LisaTickController_1.LisaTickController);
    lisaTimer.tickObservable.subscribe(({ waterModifier, happinessModifier, byUser }) => lisaStateController.modifyLisaStatus(waterModifier, happinessModifier, byUser));
};
const startLisaDiscordClient = async () => {
    chevron_1.chevron.registerInjectable({
        commandPrefix: "$",
        owner: "128985967875850240"
    }, { name: "discordOptions" });
    const lisaDiscordClient = chevron_1.chevron.getInjectableInstance(DiscordClient_1.DiscordClient);
    const discordToken = process.env.DISCORD_TOKEN;
    if (lodash_1.isNil(discordToken)) {
        throw new Error("No secret set.");
    }
    await lisaDiscordClient.login(discordToken);
    const lisaDiscordController = chevron_1.chevron.getInjectableInstance(DiscordEventController_1.DiscordEventController);
    lisaDiscordController.bindListeners();
};
logger.info("Starting Lisa main client...");
startLisaMainClient()
    .then(() => logger.info("Started Lisa main client."))
    .catch(e => console.error("Could not start Lisa main client.", e));
logger.info("Starting Lisa discord client...");
startLisaDiscordClient()
    .then(() => logger.info("Started Lisa discord client."))
    .catch(e => console.error("Could not start Lisa discord client.", e));
