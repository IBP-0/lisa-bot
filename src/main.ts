import "reflect-metadata";
import { container } from "./inversify.config";
import { rootLogger } from "./logger";
import { TYPES } from "./types";
import type { PersistenceProvider } from "./core/PersistenceProvider";
import type { LisaStateRepository } from "./core/state/LisaStateRepository";
import type { DiscordEventController } from "./clients/discord/controller/DiscordEventController";
import { isNil } from "lodash";
import type { DiscordClient } from "./clients/discord/DiscordClient";
import type { StateController } from "./core/state/StateController";
import type { TickController } from "./core/time/TickController";
import type { StateStorageController } from "./core/state/StateStorageController";

const logger = rootLogger.child({ target: "main" });

const startStorage = async (): Promise<void> => {
    const storageProvider = container.get<PersistenceProvider>(
        TYPES.PersistenceProvider
    );
    await storageProvider.init();
    await storageProvider.executeScript("./sql/schema.sql");
};

const startLisaMainClient = async (): Promise<void> => {
    const lisaStateController = container.get<StateController>(
        TYPES.LisaStateController
    );
    const lisaStateRepository = container.get<LisaStateRepository>(
        TYPES.LisaStateRepository
    );
    if ((await lisaStateRepository.count()) != 0) {
        logger.info("Found stored Lisa state, loading it.");
        lisaStateController.loadState(await lisaStateRepository.load());
    } else {
        logger.info("No stored state found, creating it.");
        await lisaStateRepository.insert(lisaStateController.getStateCopy());
    }
    const lisaStorageController = container.get<StateStorageController>(
        TYPES.StateStorageController
    );
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
    lisaDiscordClient.init();

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

logger.info("Starting Lisa...");
startStorage()
    .then(() => logger.info("Started storage."))
    .then(() => startLisaMainClient())
    .then(() => logger.info("Started Lisa main client."))
    .then(() => startLisaDiscordClient())
    .then(() => logger.info("Started Lisa discord client."))
    .catch((e) => logger.error("Unexpected error.", e));
