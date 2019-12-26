import { isNil } from "lodash";
import { chevron } from "./chevron";
import { LisaDiscordClient } from "./clients/discord/LisaDiscordClient";
import { LisaDiscordEventController } from "./clients/discord/LisaDiscordEventController";
import { LisaStateController } from "./lisa/LisaStateController";
import { LisaStorageController } from "./lisa/LisaStorageController";
import { LisaTimer } from "./lisa/LisaTimer";
import { LisaStorageService } from "./lisa/service/LisaStorageService";
import { rootLogger } from "./logger";
import { isProductionMode } from "./mode";

const logger = rootLogger.child({ target: "main" });

const startLisaMainClient = async (): Promise<void> => {
    const lisaStateController: LisaStateController = chevron.getInjectableInstance(
        LisaStateController
    );
    const lisaStorageService: LisaStorageService = chevron.getInjectableInstance(
        LisaStorageService
    );
    const lisaStorageController: LisaStorageController = chevron.getInjectableInstance(
        LisaStorageController
    );
    const lisaTimer: LisaTimer = chevron.getInjectableInstance(LisaTimer);

    if (await lisaStorageService.hasStoredState()) {
        logger.info("Found stored Lisa state, loading it.");
        lisaStateController.load(await lisaStorageService.loadStoredState());
    } else {
        logger.info("No stored state found, skipping loading.");
    }

    lisaStorageController.bindListeners();
    lisaTimer.start();
};
const startLisaDiscordClient = async (): Promise<void> => {
    const lisaDiscordClient: LisaDiscordClient = chevron.getInjectableInstance(
        LisaDiscordClient
    );
    const lisaDiscordController: LisaDiscordEventController = chevron.getInjectableInstance(
        LisaDiscordEventController
    );

    const discordToken = isProductionMode()
        ? process.env.DISCORD_TOKEN
        : process.env.DISCORD_TOKEN_TEST;
    if (isNil(discordToken)) {
        throw new Error("No token set.");
    }

    lisaDiscordClient.init({
        commandPrefix: "$",
        owner: "128985967875850240"
    });
    await lisaDiscordClient.login(discordToken);

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
