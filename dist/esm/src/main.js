import { isNil } from "lodash";
import { LisaDiscordClient } from "./clients/discord/LisaDiscordClient";
import { rootLogger } from "./logger";
import { isProductionMode } from "./mode";
const logger = rootLogger.child({ service: "main" });
logger.info("Starting Lisa bot...");
/*
 * Discord Client
 */
logger.info("Starting Lisa discord client...");
const discordToken = isProductionMode()
    ? process.env.DISCORD_TOKEN
    : process.env.DISCORD_TOKEN_TEST;
if (isNil(discordToken)) {
    throw new Error("No token set.");
}
const lisaDiscordClient = new LisaDiscordClient({
    commandPrefix: "$",
    owner: "128985967875850240",
    invite: "https://discordapp.com/oauth2/authorize?&client_id=263671526279086092&scope=bot"
});
lisaDiscordClient
    .login(discordToken)
    .then(() => logger.info("Discord client connected."))
    .catch(logger.error);
//# sourceMappingURL=main.js.map