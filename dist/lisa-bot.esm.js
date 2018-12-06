import { clingyLogby } from 'cli-ngy';
import { isNil } from 'lightdash';
import { DEFAULT_ROLE, Dingy, dingyLogby } from 'di-ngy';
import { Logby, Levels } from 'logby';

const TEXT = [
    "Hello!",
    "I am Lisa, an indoor plant, inspired by Lisa from 'Life is Strange'.",
    "<http://dontnodentertainment.wikia.com/wiki/Lisa_the_Plant>",
    "---------",
    "For more information, use `$help` or go to <https://github.com/FelixRilling/lisa-bot>.",
    "If you have questions or want to report a bug, message my creator: NobodyRocks#5051."
].join("\n");
const IMAGE_LINK = "http://static.tumblr.com/df323b732955715fe3fb5a506999afc7/" +
    "rflrqqy/H9Cnsyji6/tumblr_static_88pgfgk82y4ok80ckowwwwow4.jpg";
const about = {
    fn: () => {
        return {
            val: TEXT,
            files: [IMAGE_LINK]
        };
    },
    args: [],
    alias: ["info"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Shows info about this bot"
    }
};

const TEXT$1 = [
    "I'm always happy to join new servers!",
    "If you want me to join your server, follow this link: ",
    "<https://discordapp.com/oauth2/authorize?&client_id=263671526279086092&scope=bot>"
].join("\n");
const invite = {
    fn: () => TEXT$1,
    args: [],
    alias: ["join"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Add Lisa to your server"
    }
};

const COMMANDS = {
    /*
     * Core
     */
    about,
    invite
};

const ADMIN_ROLE = {
    check: (msg) => msg.author.id === "128985967875850240",
    power: 999
};
const createConfig = (prefix) => {
    return {
        prefix,
        roles: [DEFAULT_ROLE, ADMIN_ROLE],
        answerToMissingCommand: false,
        answerToMissingArgs: true,
        answerToMissingPerms: true
    };
};

/**
 * Logby instance used by Di-ngy.
 */
const lisaBotLogby = new Logby();

const logger = lisaBotLogby.getLogger("LisaListeners");
const onConnect = () => {
    logger.trace("Running onConnect.");
};
const onMessage = () => {
    logger.trace("Running onMessage.");
};

const PRODUCTION_ENABLED = process.env.NODE_ENV === "production";
const DISCORD_TOKEN = PRODUCTION_ENABLED
    ? process.env.DISCORD_TOKEN
    : process.env.DISCORD_TOKEN_TEST;
const PREFIX = PRODUCTION_ENABLED ? "$" : "$$$";
const LOG_LEVEL = PRODUCTION_ENABLED ? Levels.INFO : Levels.TRACE;
if (isNil(DISCORD_TOKEN)) {
    throw new Error("No token set.");
}
dingyLogby.setLevel(LOG_LEVEL);
clingyLogby.setLevel(LOG_LEVEL);
lisaBotLogby.setLevel(LOG_LEVEL);
const logger$1 = lisaBotLogby.getLogger("LisaBot");
logger$1.info(`Starting in ${process.env.NODE_ENV} mode.`);
logger$1.info(`Using prefix '${PREFIX}'.`);
const lisaBot = new Dingy(COMMANDS, createConfig(PREFIX));
lisaBot.client.on("message", onMessage);
lisaBot
    .connect(DISCORD_TOKEN)
    .then(() => {
    logger$1.info("LisaBot started successfully.");
    onConnect();
})
    .catch(e => logger$1.error("An unexpected error occurred.", e));
