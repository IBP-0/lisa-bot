import "reflect-metadata";
import { isNil } from "lodash";
import { container } from "./inversify.config";
import { DiscordEventController } from "./clients/discord/controller/DiscordEventController";
import { DiscordClient } from "./clients/discord/DiscordClient";
import { StateController } from "./core/controller/StateController";
import { StateStorageController } from "./core/controller/StateStorageController";
import { TickController } from "./core/controller/TickController";
import { rootLogger } from "./logger";
import { TYPES } from "./types";

const logger = rootLogger.child({ target: "main" });

const startLisaMainClient = async (): Promise<void> => {
    const lisaStateController = container.get<StateController>(
        TYPES.LisaStateController
    );

    const lisaStorageController = container.get<StateStorageController>(
        TYPES.LisaStateStorageController
    );
    if (await lisaStorageController.hasStoredState()) {
        logger.info("Found stored Lisa state, loading it.");
        lisaStateController.loadState(
            await lisaStorageController.loadStoredState()
        );
    } else {
        logger.info("No stored state found, skipping loading.");
    }
    lisaStorageController.bindStateChangeSubscription(
        lisaStateController.stateChangeSubject
    );

    const lisaTimer = container.get<TickController>(TYPES.LisaTickController);
    lisaTimer.tickObservable.subscribe(
        ({ waterModifier, happinessModifier, byUser }) =>
            lisaStateController.modifyLisaStatus(
                waterModifier,
                happinessModifier,
                byUser
            )
    );
};
const startLisaDiscordClient = async (): Promise<void> => {
    const lisaDiscordClient = container.get<DiscordClient>(TYPES.DiscordClient);
    const discordToken = process.env.DISCORD_TOKEN;
    if (isNil(discordToken)) {
        throw new Error("No secret set.");
    }

    await lisaDiscordClient.login(discordToken);

    const lisaDiscordController = container.get<DiscordEventController>(
        TYPES.DiscordEventController
    );
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
