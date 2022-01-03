import "reflect-metadata";
import { container } from "./inversify.config";
import { rootLogger } from "./logger";
import { TYPES } from "./types";
import type { PersistenceProvider } from "./core/PersistenceProvider";
import type { StateRepository } from "./core/state/StateRepository";
import type { DiscordEventController } from "./clients/discord/DiscordEventController";
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
	const stateController = container.get<StateController>(
		TYPES.StateController
	);
	const stateRepository = container.get<StateRepository>(
		TYPES.StateRepository
	);
	if ((await stateRepository.count()) != 0) {
		logger.info("Found stored Lisa state, loading it.");
		stateController.loadState(await stateRepository.select());
	} else {
		logger.info("No stored state found, creating it.");
		await stateRepository.insert(stateController.getStateCopy());
	}
	const storageController = container.get<StateStorageController>(
		TYPES.StorageController
	);
	storageController.bindStateChangeSubscription(
		stateController.stateChangeSubject
	);

	const tickController = container.get<TickController>(TYPES.TickController);
	tickController.tickObservable.subscribe(
		({ waterModifier, happinessModifier, initiator }) =>
			stateController.modifyLisaStatus(
				waterModifier,
				happinessModifier,
				initiator
			)
	);
};
const startLisaDiscordClient = async (): Promise<void> => {
	const discordClient = container.get<DiscordClient>(TYPES.DiscordClient);
	discordClient.init();

	const discordToken = process.env.DISCORD_TOKEN;
	if (isNil(discordToken)) {
		throw new Error("No secret set.");
	}

	await discordClient.login(discordToken);

	const discordEventController = container.get<DiscordEventController>(
		TYPES.DiscordEventController
	);
	discordEventController.bindListeners();
};

logger.info("Starting Lisa...");
startStorage()
	.then(() => logger.info("Started storage."))
	.then(() => startLisaMainClient())
	.then(() => logger.info("Started Lisa main client."))
	.then(() => startLisaDiscordClient())
	.then(() => logger.info("Started Lisa discord client."))
	.catch((e) => logger.error("Unexpected error.", e));
