'use strict';

var lodash = require('lodash');
var discord_jsCommando = require('discord.js-commando');
var winston = require('winston');

const IMAGE_LINK = "http://static.tumblr.com/df323b732955715fe3fb5a506999afc7/" +
    "rflrqqy/H9Cnsyji6/tumblr_static_88pgfgk82y4ok80ckowwwwow4.jpg";
const ABOUT_MESSAGE = `Hello!
I am Lisa, an indoor plant, inspired by Lisa from 'Life is Strange'.
<http://dontnodentertainment.wikia.com/wiki/Lisa_the_Plant>
----------
For more information, use \`$help\` or go to <https://github.com/FelixRilling/lisa-bot>.
If you have questions or want to report a bug, message my creator: NobodyRocks#5051.`;
class AboutCommand extends discord_jsCommando.Command {
    constructor(client) {
        super(client, {
            name: "about",
            aliases: ["why", "info"],
            group: "util",
            memberName: "about",
            description: "Shows info about the bot."
        });
    }
    run(message) {
        return message.say(ABOUT_MESSAGE, { files: [IMAGE_LINK] });
    }
}

class LisaDiscordClient {
    constructor(options) {
        this.commandoClient = new discord_jsCommando.CommandoClient(options);
        this.commandoClient.registry
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
            help: true,
            eval_: false,
            ping: true,
            prefix: false,
            commandState: false
        });
        this.commandoClient.registry.registerCommand(AboutCommand);
    }
    async login(token) {
        await this.commandoClient.login(token);
    }
}

const isProductionMode = () => process.env.NODE_ENV === "production";

const logFormat = winston.format.combine(winston.format.timestamp(), winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`));
const rootLogger = winston.createLogger({
    level: isProductionMode() ? "info" : "debug",
    format: logFormat,
    defaultMeta: { service: "root" },
    transports: [new winston.transports.File({ filename: "log/lisa-bot.log" })]
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (!isProductionMode()) {
    rootLogger.add(new winston.transports.Console());
}

const logger = rootLogger.child({ service: "main" });
logger.info("Starting Lisa bot...");
/*
 * Discord Client
 */
logger.info("Starting Lisa discord client...");
const discordToken = isProductionMode()
    ? process.env.DISCORD_TOKEN
    : process.env.DISCORD_TOKEN_TEST;
if (lodash.isNil(discordToken)) {
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
//# sourceMappingURL=lisa-bot.common.js.map
