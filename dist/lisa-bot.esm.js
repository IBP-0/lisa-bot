import { clingyLogby } from 'cli-ngy';
import { DEFAULT_ROLE, dingyLogby, Dingy } from 'di-ngy';
import { objFromDeep, isNil, randItem } from 'lightdash';
import { Logby, Levels } from 'logby';
import { Chevron } from 'chevronjs';
import { duration } from 'moment';
import * as PromiseQueue from 'promise-queue';

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

const lisaChevron = new Chevron();

const MIN_WATER = 0.1;
const MAX_WATER = 150;
const MIN_HAPPINESS = 0.1;
const MAX_HAPPINESS = 100;
const FACTOR = (MAX_WATER + MAX_HAPPINESS) / 2;
class LisaStatusService {
    modify(lisaData, username, modifierWater, modifierHappiness) {
        if (!lisaData.life.isAlive) {
            return lisaData;
        }
        const result = objFromDeep(lisaData);
        result.status.water += modifierWater;
        if (result.status.water > MAX_WATER) {
            return this.kill(result, username, "drowning" /* DROWNING */);
        }
        if (result.status.water < MIN_WATER) {
            return this.kill(result, username, "drought" /* DROUGHT */);
        }
        result.status.happiness += modifierHappiness;
        if (result.status.happiness > MAX_HAPPINESS) {
            result.status.happiness = MAX_HAPPINESS;
        }
        if (result.status.happiness < MIN_HAPPINESS) {
            return this.kill(result, username, "sadness" /* SADNESS */);
        }
        this.updateHighScoreIfRequired(lisaData);
        return result;
    }
    createNewLisa(oldLisaData) {
        return {
            status: {
                water: 100,
                happiness: 100
            },
            life: {
                isAlive: true,
                killer: "Anonymous",
                deathThrough: "something unknown" /* UNKNOWN */,
                birth: Date.now(),
                death: 0
            },
            score: {
                highScore: isNil(oldLisaData) ? 0 : oldLisaData.score.highScore
            }
        };
    }
    getLifetime(lisaData) {
        if (!lisaData.life.isAlive) {
            return lisaData.life.death - lisaData.life.birth;
        }
        return Date.now() - lisaData.life.birth;
    }
    getTimeSinceDeath(lisaData) {
        return Date.now() - lisaData.life.death;
    }
    getHighScore(lisaData) {
        this.updateHighScoreIfRequired(lisaData);
        return lisaData.score.highScore;
    }
    getRelativeState(lisaData) {
        const relWater = lisaData.status.water / MAX_WATER;
        const relHappiness = lisaData.status.happiness / MAX_HAPPINESS;
        return relWater * relHappiness * FACTOR;
    }
    kill(lisaData, username, deathThrough) {
        lisaData.life.isAlive = false;
        lisaData.life.death = Date.now();
        lisaData.life.deathThrough = deathThrough;
        lisaData.life.killer = username;
        this.updateHighScoreIfRequired(lisaData);
        return lisaData;
    }
    updateHighScoreIfRequired(lisaData) {
        const currentScore = this.getLifetime(lisaData);
        if (currentScore > lisaData.score.highScore) {
            lisaData.score.highScore = currentScore;
        }
    }
}
lisaChevron.set("factory" /* FACTORY */, [], LisaStatusService);

const RELATIVE_STATE_GOOD = 90;
const RELATIVE_STATE_OK = 40;
class LisaStringifyService {
    constructor(lisaStatusService) {
        this.lisaStatusService = lisaStatusService;
    }
    stringifyStatus(lisaData) {
        const statusShort = `Lisa is ${this.stringifyStatusShort(lisaData)}`;
        const score = this.stringifyScore(lisaData);
        let text = [];
        if (!lisaData.life.isAlive) {
            const humanizedTimeSinceDeath = this.humanizeDuration(this.lisaStatusService.getTimeSinceDeath(lisaData));
            const humanizedLifetime = this.humanizeDuration(this.lisaStatusService.getLifetime(lisaData));
            text = [
                `Lisa died ${humanizedTimeSinceDeath} ago, and was alive for ${humanizedLifetime}.`,
                `She was killed by ${lisaData.life.killer} through ${lisaData.life.deathThrough}.`
            ];
        }
        else {
            const waterLevel = Math.floor(lisaData.status.water);
            const happinessLevel = Math.floor(lisaData.status.happiness);
            text = [`Water: ${waterLevel}% | Happiness: ${happinessLevel}%.`];
        }
        return [statusShort, ...text, score].join("\n");
    }
    stringifyStatusShort(lisaData) {
        if (!lisaData.life.isAlive) {
            return "is dead.";
        }
        const relativeState = this.lisaStatusService.getRelativeState(lisaData);
        if (relativeState > RELATIVE_STATE_GOOD) {
            return "doing great.";
        }
        if (relativeState > RELATIVE_STATE_OK) {
            return "doing fine.";
        }
        return "close to dying.";
    }
    stringifyScore(lisaData) {
        const humanizedCurrentScore = this.humanizeDuration(this.lisaStatusService.getLifetime(lisaData));
        const humanizedHighScore = this.humanizeDuration(this.lisaStatusService.getHighScore(lisaData));
        const currentScoreTense = lisaData.life.isAlive
            ? "Current lifetime"
            : "Lifetime";
        return `${currentScoreTense}: ${humanizedCurrentScore} | Best lifetime: ${humanizedHighScore}.`;
    }
    humanizeDuration(duration$$1) {
        return duration(duration$$1).humanize();
    }
}
lisaChevron.set("factory" /* FACTORY */, [LisaStatusService], LisaStringifyService);

/**
 * Logby instance used by Di-ngy.
 */
const lisaLogby = new Logby();

class LisaController {
    constructor(store, lisaStatusService, lisaStringifyService) {
        this.store = store;
        this.lisaStatusService = lisaStatusService;
        this.lisaStringifyService = lisaStringifyService;
        if (store.has(LisaController.STORE_KEY)) {
            LisaController.logger.info("Loading lisa data from store.");
            this.lisaData = store.get(LisaController.STORE_KEY);
        }
        else {
            LisaController.logger.info("Creating new lisa data.");
            this.lisaData = this.lisaStatusService.createNewLisa();
            this.save();
        }
    }
    performAction(username, modifierWater, modifierHappiness, textSuccess, textDead) {
        if (!this.lisaData.life.isAlive) {
            return randItem(textDead);
        }
        this.modify(username, modifierWater, modifierHappiness);
        return [randItem(textSuccess), this.stringifyStatus()].join("\n");
    }
    modify(username, modifierWater, modifierHappiness) {
        this.lisaData = this.lisaStatusService.modify(this.lisaData, username, modifierWater, modifierHappiness);
        this.save();
    }
    stringifyStatus() {
        return this.lisaStringifyService.stringifyStatus(this.lisaData);
    }
    stringifyStatusShort() {
        return this.lisaStringifyService.stringifyStatusShort(this.lisaData);
    }
    isAlive() {
        return this.lisaData.life.isAlive;
    }
    createNewLisa() {
        this.lisaData = this.lisaStatusService.createNewLisa(this.lisaData);
        this.save();
    }
    save() {
        this.store.set(LisaController.STORE_KEY, this.lisaData);
    }
}
LisaController.STORE_KEY = "lisa";
LisaController.logger = lisaLogby.getLogger(LisaController);
lisaChevron.set("factory" /* FACTORY */, ["_LISA_STORAGE" /* STORAGE */, LisaStatusService, LisaStringifyService], LisaController);

const statusFn = () => {
    const lisaController = lisaChevron.get(LisaController);
    return lisaController.stringifyStatus();
};
const status = {
    fn: statusFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Shows lisa's status."
    }
};

/**
 * Creates a displayable string of an user.
 *
 * @private
 * @param {User} user
 * @returns {string}
 */
const toFullName = (user) => `${user.username}#${user.discriminator}`;

const waterFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    return lisaController.performAction(toFullName(msg.author), 25, 0, [
        "_Is being watered_",
        "_Water splashes._",
        "_Watering noises._",
        "You hear lisa sucking up the water."
    ], ["It's too late to water poor Lisa..."]);
};
const water = {
    fn: waterFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Waters lisa."
    }
};

const eachOption = (options, letters, fn) => {
    let i = 0;
    while (i < options.length && i < letters.length) {
        fn(options[i], letters[i], i);
        i++;
    }
};

const MAX_QUEUE_SIZE = 20;
const logger = lisaLogby.getLogger("addReactions");
const addReactions = (options, icons, msgSent) => {
    const queue = new PromiseQueue(1, MAX_QUEUE_SIZE);
    eachOption(options, icons, (option, icon) => {
        queue
            .add(() => msgSent.react(icon[1]))
            .catch(e => logger.error("Could not react to message.", e));
    });
};

const UNICODE_POS_A = 0x1f1e6;
// noinspection SpellCheckingInspection
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
        // tslint:disable-next-line:quotemark
        help: 'Creates a poll with "yes" and "no" as answers.'
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

const replantFn = () => {
    const lisaController = lisaChevron.get(LisaController);
    const wasAlive = lisaController.isAlive();
    lisaController.createNewLisa();
    return randItem(wasAlive
        ? [
            "_Is being ripped out and thrown away while still alive, watching you plant the next lisa._"
        ]
        : [
            "_Plants new lisa on top of the remnants of her ancestors._",
            "_Plants the next generation of lisa._"
        ]);
};
const replant = {
    fn: replantFn,
    args: [],
    alias: ["reset", "plant"],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Replant lisa."
    }
};

const punchFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    return lisaController.performAction(toFullName(msg.author), 0, -10, ["_Is being punched in the leaves._", "oof.", "ouch ouw owie."], ["The dead feel no pain..."]);
};
const punch = {
    fn: punchFn,
    args: [],
    alias: ["hit"],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Punches lisa."
    }
};

const COMMANDS = {
    /*
     * Core
     */
    about,
    invite,
    /*
     * Lisa
     */
    status,
    replant,
    water,
    punch,
    /*
     * Poll
     */
    poll
};

const TICK_INTERVAL = 60000; // 1min
const USERNAME_TICK = "Time";
const USERNAME_ACTIVITY = "Activity";
const logger$1 = lisaLogby.getLogger("LisaListeners");
const initTickInterval = (lisaBot) => {
    const lisaController = lisaChevron.get(LisaController);
    lisaBot.client.setInterval(() => {
        lisaController.modify(USERNAME_TICK, -0.5, -0.75);
        lisaBot.client.user
            .setGame(lisaController.stringifyStatusShort())
            .catch(err => logger$1.warn("Could not update currently playing.", err));
    }, TICK_INTERVAL);
};
const increaseHappiness = () => {
    const lisaController = lisaChevron.get(LisaController);
    lisaController.modify(USERNAME_ACTIVITY, 0, 0.25);
};
const onConnect = (lisaBot) => {
    logger$1.trace("Running onConnect.");
    initTickInterval(lisaBot);
};
const onMessage = () => {
    logger$1.trace("Running onMessage.");
    increaseHappiness();
};

const ADMIN_ID = "128985967875850240";
const ADMIN_ROLE = {
    check: (msg) => msg.author.id === ADMIN_ID,
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
lisaLogby.setLevel(LOG_LEVEL);
const logger$2 = lisaLogby.getLogger("LisaBot");
logger$2.info(`Starting in ${process.env.NODE_ENV} mode.`);
logger$2.info(`Using prefix '${PREFIX}'.`);
const lisaBot = new Dingy(COMMANDS, createConfig(PREFIX));
lisaBot.client.on("message", onMessage);
lisaChevron.set("plain" /* PLAIN */, [], lisaBot.jsonStorage, "_LISA_STORAGE" /* STORAGE */);
lisaBot
    .connect(DISCORD_TOKEN)
    .then(() => {
    logger$2.info("LisaBot started successfully.");
    onConnect(lisaBot);
})
    .catch(e => logger$2.error("An unexpected error occurred.", e));
