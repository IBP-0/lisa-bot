'use strict';

var cliNgy = require('cli-ngy');
var lightdash = require('lightdash');
var PromiseQueue = require('promise-queue');
var logby = require('logby');
var diNgy = require('di-ngy');

const IMAGE_LINK = "http://static.tumblr.com/df323b732955715fe3fb5a506999afc7/" +
    "rflrqqy/H9Cnsyji6/tumblr_static_88pgfgk82y4ok80ckowwwwow4.jpg";
const aboutFn = (args, argsAll, msg, dingy) => {
    return {
        val: [
            "Hello!",
            "I am Lisa, an indoor plant, inspired by Lisa from 'Life is Strange'.",
            "<http://dontnodentertainment.wikia.com/wiki/Lisa_the_Plant>",
            dingy.config.strings.separator,
            "For more information, use `$help` or go to <https://github.com/FelixRilling/lisa-bot>.",
            "If you have questions or want to report a bug, message my creator: NobodyRocks#5051."
        ].join("\n"),
        files: [IMAGE_LINK]
    };
};
const about = {
    fn: aboutFn,
    args: [],
    alias: ["info"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Shows info about this bot."
    }
};

const inviteFn = () => [
    "I'm always happy to join new servers!",
    "If you want me to join your server, follow this link: ",
    "<https://discordapp.com/oauth2/authorize?&client_id=263671526279086092&scope=bot>"
].join("\n");
const invite = {
    fn: inviteFn,
    args: [],
    alias: ["join"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Add Lisa to your server."
    }
};

/**
 * Logby instance used by Di-ngy.
 */
const lisaBotLogby = new logby.Logby();

const eachOption = (options, letters, fn) => {
    let i = 0;
    while (i < options.length && i < letters.length) {
        fn(options[i], letters[i], i);
        i++;
    }
};

const MAX_QUEUE_SIZE = 20;
const logger = lisaBotLogby.getLogger("addReactions");
const addReactions = (options, icons, msgSent) => {
    const queue = new PromiseQueue(1, MAX_QUEUE_SIZE);
    eachOption(options, icons, (option, icon) => {
        queue
            .add(() => msgSent.react(icon[1]))
            .catch(e => logger.error("Could not react to message.", e));
    });
};

const UNICODE_POS_A = 0x1F1E6;
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const createLetterEmoji = (letter) => {
    const index = LETTERS.indexOf(letter.toLowerCase());
    if (index === -1) {
        throw new Error("Letter is not in range.");
    }
    return String.fromCodePoint(UNICODE_POS_A + index);
};

const YES_OR_NO_ICONS = [
    ["Y", createLetterEmoji("Y")],
    ["N", createLetterEmoji("N")]
];
const yesOrNoFn = (args, argsAll, msg, dingy) => {
    return {
        val: [
            `${args.get("question")}`,
            dingy.config.strings.separator,
            "Y/N?"
        ].join("\n"),
        code: "yaml",
        onSend: msgSent => {
            if (!Array.isArray(msgSent)) {
                addReactions(new Array(2), YES_OR_NO_ICONS, msgSent);
            }
        }
    };
};
const yesOrNo = {
    fn: yesOrNoFn,
    args: [
        {
            name: "question",
            required: true
        }
    ],
    alias: ["y/n"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Creates a poll with \"yes\" and \"no\" as answers."
    }
};

const ALPHABET_ICONS = [
    ["A", createLetterEmoji("A")],
    ["B", createLetterEmoji("B")],
    ["C", createLetterEmoji("C")],
    ["D", createLetterEmoji("D")],
    ["E", createLetterEmoji("E")],
    ["F", createLetterEmoji("F")],
    ["G", createLetterEmoji("G")],
    ["H", createLetterEmoji("H")],
    ["I", createLetterEmoji("I")],
    ["J", createLetterEmoji("J")],
    ["K", createLetterEmoji("K")],
    ["L", createLetterEmoji("L")],
    ["M", createLetterEmoji("M")],
    ["N", createLetterEmoji("N")],
    ["O", createLetterEmoji("O")],
    ["P", createLetterEmoji("P")],
    ["Q", createLetterEmoji("Q")],
    ["R", createLetterEmoji("R")],
    ["S", createLetterEmoji("S")],
    ["T", createLetterEmoji("T")]
];
const pollFn = (args, argsAll, msg, dingy) => {
    const options = argsAll.slice(1);
    const result = [`${args.get("question")}`, dingy.config.strings.separator];
    eachOption(options, ALPHABET_ICONS, (option, icon) => {
        result.push(`${icon[0]}: ${option}`);
    });
    return {
        val: result.join("\n"),
        code: "yaml",
        onSend: msgSent => {
            if (!Array.isArray(msgSent)) {
                addReactions(options, ALPHABET_ICONS, msgSent);
            }
        }
    };
};
const poll = {
    fn: pollFn,
    args: [
        {
            name: "question",
            required: true
        },
        {
            name: "option1",
            required: true
        },
        {
            name: "option2",
            required: true
        }
    ],
    alias: ["vote", "v"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Creates a poll to vote on."
    },
    sub: {
        yesOrNo
    }
};

const COMMANDS = {
    /*
     * Core
     */
    about,
    invite,
    /*
     * Poll
     */
    poll
};

const ADMIN_ID = "128985967875850240";
const ADMIN_ROLE = {
    check: (msg) => msg.author.id === ADMIN_ID,
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

const logger$1 = lisaBotLogby.getLogger("LisaListeners");
const onConnect = () => {
    logger$1.trace("Running onConnect.");
};
const onMessage = () => {
    logger$1.trace("Running onMessage.");
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
const logger$2 = lisaBotLogby.getLogger("LisaBot");
logger$2.info(`Starting in ${process.env.NODE_ENV} mode.`);
logger$2.info(`Using prefix '${PREFIX}'.`);
const lisaBot = new diNgy.Dingy(COMMANDS, createConfig(PREFIX));
lisaBot.client.on("message", onMessage);
lisaBot
    .connect(DISCORD_TOKEN)
    .then(() => {
    logger$2.info("LisaBot started successfully.");
    onConnect();
})
    .catch(e => logger$2.error("An unexpected error occurred.", e));
