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

/**
 * Creates a displayable string of an user.
 *
 * @private
 * @param {User} user
 * @returns {string}
 */
const toFullName = (user) => `${user.username}#${user.discriminator}`;

const lisaChevron = new Chevron();

/**
 * Logby instance used by Di-ngy.
 */
const lisaLogby = new Logby();

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
            return this.setDeath(result, username, "drowning" /* DROWNING */);
        }
        if (result.status.water < MIN_WATER) {
            return this.setDeath(result, username, "dehydration" /* DEHYDRATION */);
        }
        result.status.happiness += modifierHappiness;
        if (result.status.happiness > MAX_HAPPINESS) {
            result.status.happiness = MAX_HAPPINESS;
        }
        if (result.status.happiness < MIN_HAPPINESS) {
            return this.setDeath(result, username, "sadness" /* SADNESS */);
        }
        this.updateHighScoreIfRequired(lisaData);
        return result;
    }
    kill(lisaData, username, deathThrough) {
        if (!lisaData.life.isAlive) {
            return lisaData;
        }
        const result = objFromDeep(lisaData);
        return this.setDeath(result, username, deathThrough);
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
    setDeath(lisaData, username, deathThrough) {
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

class LisaController {
    constructor(store, lisaStatusService, lisaStringifyService) {
        this.store = store;
        this.lisaStatusService = lisaStatusService;
        this.lisaStringifyService = lisaStringifyService;
        if (store.has(LisaController.STORE_KEY)) {
            LisaController.logger.info("Loading Lisa data from store.");
            this.lisaData = store.get(LisaController.STORE_KEY);
        }
        else {
            LisaController.logger.info("Creating new Lisa data.");
            this.lisaData = this.lisaStatusService.createNewLisa();
            this.save();
        }
    }
    performAction(username, modifierWater, modifierHappiness, textSuccess, textAlreadyDead) {
        if (!this.lisaData.life.isAlive) {
            return randItem(textAlreadyDead);
        }
        this.modify(username, modifierWater, modifierHappiness);
        return [randItem(textSuccess), this.stringifyStatus()].join("\n");
    }
    performKill(username, deathThrough, textSuccess, textAlreadyDead) {
        if (!this.lisaData.life.isAlive) {
            return randItem(textAlreadyDead);
        }
        this.lisaData = this.lisaStatusService.kill(this.lisaData, username, deathThrough);
        this.save();
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
        LisaController.logger.debug("Creating new Lisa.");
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

const GOAT_IDS = [
    "169804264988868609",
    "178470784984023040",
    "143158243076734986",
    "128985967875850240",
    "273221196001181697"
];
const baaFn = (args, argsAll, msg) => {
    if (!GOAT_IDS.includes(msg.author.id)) {
        return "You're not a goat uwu";
    }
    const lisaController = lisaChevron.get(LisaController);
    // noinspection SpellCheckingInspection
    return lisaController.performAction(toFullName(msg.author), 0, 30, ["Baa", "Baa~", "Baaaaaaa ^w^", ":goat:"], ["Baa? a dead Lisa..."]);
};
const baa = {
    fn: baaFn,
    args: [],
    alias: [],
    data: {
        hidden: true,
        usableInDMs: false,
        powerRequired: 0,
        help: "Baa"
    }
};

const burnFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    // noinspection SpellCheckingInspection
    return lisaController.performKill(toFullName(msg.author), "fire" /* FIRE */, [
        "_You hear muffled plant-screams as you set Lisa on fire_",
        "_Lisa looks at you, judging your actions._",
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    ], ["Lisa is already dead!"]);
};
// noinspection SpellCheckingInspection
const burn = {
    fn: burnFn,
    args: [],
    alias: ["fire", "killitwithfire"],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Burn Lisa (you monster)."
    }
};

const hugFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    // noinspection SpellCheckingInspection
    return lisaController.performAction(toFullName(msg.author), 0, 20, ["_Is hugged_.", "_hug_"], ["It's too late to hug poor Lisa..."]);
};
const hug = {
    fn: hugFn,
    args: [],
    alias: ["huggu"],
    data: {
        hidden: true,
        usableInDMs: false,
        powerRequired: 0,
        help: "Hug Lisa."
    }
};

const HIGH_QUALITY_JOKES = [
    "Why do trees have so many friends? They branch out.",
    "A photographer was great at botany because he knew photo synthesis.",
    "When the plums dry on your tree, it's time to prune.",
    "The tree that was creating energy was turned into a power-plant.",
    "My fear of roses is a thorny issue. I'm not sure what it stems from, but it seems likely I'll be stuck with it.",
    "The raisin wined about how he couldn't achieve grapeness.",
    "I can't find my rutabaga. I hope it will turnip.",
    "When I bought some fruit trees the nursery owner gave me some insects to help with pollination. They were free bees.",
    "The research assistant couldn't experiment with plants because he hadn't botany.",
    "The farmer was surprised when his pumpkin won a blue ribbon at the State Fair. He shouted, 'Oh, my gourd.'",
    "After winter, the trees are relieved.",
    "Mr. Mushroom could never understand why he wasn't looked on as a real fun guy.",
    "What do you call a sour orange that was late to school? Tarty!",
    "When the Nomadic tree senses danger it packs up its trunk and leaves.",
    "If we canteloup lettuce marry!",
    "What kind of tree grows on your hand? A palm tree.",
    "After a cold winter, will deciduous trees be releaved?",
    "I saw something similar to moss the other day, but I didn't know what to lichen it to.",
    "In some conifer forests, you can't cedar wood for the trees."
];
const jokeFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    const goodJoke = Math.random() > 0.5;
    // noinspection SpellCheckingInspection
    return lisaController.performAction(toFullName(msg.author), 0, goodJoke ? 15 : -15, HIGH_QUALITY_JOKES, ["Dead plants can't listen to your jokes (probably)."]);
};
const joke = {
    fn: jokeFn,
    args: [],
    alias: ["pun"],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Tell Lisa a joke."
    }
};

const MISSY_ID = ["273221196001181697"];
const missyFn = (args, argsAll, msg) => {
    if (!MISSY_ID.includes(msg.author.id)) {
        return "You're not a missy <w<";
    }
    const lisaController = lisaChevron.get(LisaController);
    // noinspection SpellCheckingInspection
    return lisaController.performAction(toFullName(msg.author), 0, 40, ["_Baaaaaaaaaaaaaa_"], ["OwO whats this? a dead Lisa..."]);
};
const missy = {
    fn: missyFn,
    args: [],
    alias: [],
    data: {
        hidden: true,
        usableInDMs: false,
        powerRequired: 0,
        help: "baaff"
    }
};

const NIKLAS_ID = ["178470784984023040"];
const niklasFn = (args, argsAll, msg) => {
    if (!NIKLAS_ID.includes(msg.author.id)) {
        return "You're not a niklas uwu";
    }
    const lisaController = lisaChevron.get(LisaController);
    // noinspection SpellCheckingInspection
    return lisaController.performAction(toFullName(msg.author), 0, 40, ["_tight huggu_"], ["OwO whats this? a dead Lisa..."]);
};
const niklas = {
    fn: niklasFn,
    args: [],
    alias: [],
    data: {
        hidden: true,
        usableInDMs: false,
        powerRequired: 0,
        help: "^w^"
    }
};

const punchFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    // noinspection SpellCheckingInspection
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
        help: "Punch Lisa."
    }
};

const replantFn = () => {
    const lisaController = lisaChevron.get(LisaController);
    const wasAlive = lisaController.isAlive();
    lisaController.createNewLisa();
    return randItem(wasAlive
        ? [
            "_Is being ripped out and thrown away while still alive, watching you plant the next Lisa._"
        ]
        : [
            "_Plants new Lisa on top of the remnants of her ancestors._",
            "_Plants the next generation of Lisa._"
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
        help: "Replant Lisa."
    }
};

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
        help: "Shows Lisa's status."
    }
};

const waterFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    return lisaController.performAction(toFullName(msg.author), 25, 0, [
        "_Is being watered_",
        "_Water splashes._",
        "_Watering noises._",
        "You hear Lisa sucking up the water."
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
        help: "Water Lisa."
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
    burn,
    hug,
    joke,
    baa,
    niklas,
    missy,
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
    const lisaTickFn = () => {
        lisaBot.client.user
            .setActivity(lisaController.stringifyStatusShort())
            .catch(err => logger$1.warn("Could not update currently playing.", err));
        logger$1.trace("Ran tickInterval updateActivity.");
        lisaController.modify(USERNAME_TICK, -0.5, -0.75);
        logger$1.trace("Ran tickInterval statDecay.");
    };
    lisaBot.client.setInterval(lisaTickFn, TICK_INTERVAL);
    logger$1.trace("Initialized tickInterval.");
};
const increaseHappiness = () => {
    const lisaController = lisaChevron.get(LisaController);
    lisaController.modify(USERNAME_ACTIVITY, 0, 0.25);
    logger$1.trace("Ran onMessage increaseHappiness.");
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
