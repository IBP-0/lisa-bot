import { isNil } from "lodash";
import { chevron } from "./chevron";
import { DiscordEventController } from "./clients/discord/controller/DiscordEventController";
import { DiscordClient } from "./clients/discord/DiscordClient";
import { LisaStateController } from "./lisa/controller/LisaStateController";
import { LisaStorageController } from "./lisa/controller/LisaStorageController";
import { LisaTickController } from "./lisa/controller/LisaTickController";
import { rootLogger } from "./logger";
import { isProductionMode } from "./mode";

const logger = rootLogger.child({ target: "main" });

const startLisaMainClient = async (): Promise<void> => {
    const lisaStateController: LisaStateController = chevron.getInjectableInstance(
        LisaStateController
    );
    const lisaStorageController: LisaStorageController = chevron.getInjectableInstance(
        LisaStorageController
    );
    const lisaTimer: LisaTickController = chevron.getInjectableInstance(
        LisaTickController
    );

    if (await lisaStorageController.hasStoredState()) {
        logger.info("Found stored Lisa state, loading it.");
        lisaStateController.load(await lisaStorageController.loadStoredState());
    } else {
        logger.info("No stored state found, skipping loading.");
    }

    lisaStorageController.bindListeners();
    lisaTimer.start();
};
const startLisaDiscordClient = async (): Promise<void> => {
    const lisaDiscordClient: DiscordClient = chevron.getInjectableInstance(
        DiscordClient
    );
    const lisaDiscordController: DiscordEventController = chevron.getInjectableInstance(
        DiscordEventController
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
