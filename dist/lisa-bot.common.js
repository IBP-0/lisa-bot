'use strict';

var cliNgy = require('cli-ngy');
var lightdash = require('lightdash');
var diNgy = require('di-ngy');
var logby = require('logby');

const COMMANDS = {
    foo: {
        fn: (args, argsAll, msg, dingy, clingy) => {
            setInterval(() => {
                let val = { val: Math.random() };
                console.log("SAVE", val);
                return dingy.jsonStorage.save("foo", val);
            }, 100);
            return "ok";
        },
        args: [],
        alias: [],
        data: {
            hidden: false,
            usableInDMs: true,
            powerRequired: 0,
            help: "ok"
        }
    },
    nest: {
        fn: () => "nest",
        args: [],
        alias: [],
        data: {
            hidden: false,
            usableInDMs: false,
            powerRequired: 0,
            help: "nest"
        },
        sub: {
            ed: {
                fn: () => "nested",
                args: [],
                alias: [],
                data: {
                    hidden: false,
                    usableInDMs: false,
                    powerRequired: 0,
                    help: "nested"
                }
            }
        }
    }
};

const ADMIN_ROLE = {
    check: (msg) => msg.author.id === "128985967875850240",
    power: 999
};
const createConfig = (prefix) => {
    return {
        prefix,
        roles: [diNgy.DEFAULT_ROLE, ADMIN_ROLE],
        answerToMissingCommand: false,
        answerToMissingArgs: true,
        answerToMissingPerms: true
    };
};

/**
 * Logby instance used by Di-ngy.
 */
const lisaBotLogby = new logby.Logby();

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
const LOG_LEVEL = PRODUCTION_ENABLED ? logby.Levels.INFO : logby.Levels.TRACE;
if (lightdash.isNil(DISCORD_TOKEN)) {
    throw new Error("No token set.");
}
diNgy.dingyLogby.setLevel(LOG_LEVEL);
cliNgy.clingyLogby.setLevel(LOG_LEVEL);
lisaBotLogby.setLevel(LOG_LEVEL);
const logger$1 = lisaBotLogby.getLogger("LisaBot");
logger$1.info(`Starting in ${process.env.NODE_ENV} mode.`);
logger$1.info(`Using prefix '${PREFIX}'.`);
const lisaBot = new diNgy.Dingy(COMMANDS, createConfig(PREFIX));
lisaBot.client.on("message", onMessage);
lisaBot
    .connect(DISCORD_TOKEN)
    .then(() => {
    logger$1.info("LisaBot started successfully.");
    onConnect();
})
    .catch(e => logger$1.error("An unexpected error occurred.", e));
