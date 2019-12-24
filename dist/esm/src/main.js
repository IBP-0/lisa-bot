import { isNil } from "lodash";
import { chevron } from "./chevron";
import { LisaDiscordClient } from "./clients/discord/LisaDiscordClient";
import { LisaDiscordController } from "./clients/discord/LisaDiscordController";
import { LisaPersistenceController } from "./lisa/LisaPersistenceController";
import { LisaTimer } from "./lisa/LisaTimer";
import { rootLogger } from "./logger";
import { isProductionMode } from "./mode";
const logger = rootLogger.child({ service: "main" });
const startLisaMainClient = async () => {
    logger.info("Starting Lisa main client...");
    const lisaPersistenceController = chevron.getInjectableInstance(LisaPersistenceController);
    if (await lisaPersistenceController.storedStateExists()) {
        logger.info("Found stored Lisa state,loading it.");
        await lisaPersistenceController.loadStoredState();
    }
    else {
        logger.info("No stored state found, skipping loading.");
    }
    const lisaTimer = chevron.getInjectableInstance(LisaTimer);
    lisaTimer.start();
};
const startLisaDiscordClient = async () => {
    logger.info("Starting Lisa discord client...");
    const discordToken = isProductionMode()
        ? process.env.DISCORD_TOKEN
        : process.env.DISCORD_TOKEN_TEST;
    if (isNil(discordToken)) {
        throw new Error("No token set.");
    }
    const lisaDiscordClient = chevron.getInjectableInstance(LisaDiscordClient);
    lisaDiscordClient.init({
        commandPrefix: "$",
        owner: "128985967875850240",
        invite: "https://discordapp.com/oauth2/authorize?&client_id=263671526279086092&scope=bot"
    });
    const lisaDiscordController = chevron.getInjectableInstance(LisaDiscordController);
    await lisaDiscordClient.login(discordToken);
    lisaDiscordController.bindEvents();
};
logger.info("Starting Lisa bot...");
startLisaMainClient()
    .then(() => logger.info("Started Lisa main client."))
    .catch(e => console.error("Could not start Lisa main client.", e));
startLisaDiscordClient()
    .then(() => logger.info("Started Lisa discord client."))
    .catch(e => console.error("Could not start Lisa discord client.", e));
//# sourceMappingURL=main.js.map