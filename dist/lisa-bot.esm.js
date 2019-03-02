import { isNil, strSimilar, isInstanceOf, arrCompact, isMap, isObjectPlain, forEachEntry, isObject, objFromDeep, randItem } from 'lightdash';
import { Logby, Levels } from 'logby';
import { DEFAULT_ROLE, dingyLogby, Dingy } from 'di-ngy';
import { stringify } from 'yamljs';
import { Chevron } from 'chevronjs';
import { duration } from 'moment';
import * as PromiseQueue from 'promise-queue';

/**
 * Map containing {@link ICommand}s.
 *
 * @private
 */
class CommandMap extends Map {
    constructor(input) {
        super(CommandMap.getConstructorMap(input));
    }
    /**
     * Creates a new instance with {@link Clingy} options to inherit.
     *
     * @param commands Command input to use.
     * @param options Options for the Clingy instance.
     */
    static createWithOptions(commands, options) {
        if (isMap(commands)) {
            commands.forEach(val => CommandMap.createWithOptionsHelper(val, options));
        }
        else if (isObjectPlain(commands)) {
            forEachEntry(commands, val => CommandMap.createWithOptionsHelper(val, options));
        }
        return new CommandMap(commands);
    }
    static createWithOptionsHelper(command, options) {
        if (isObjectPlain(command.sub) || isMap(command.sub)) {
            command.sub = new Clingy(CommandMap.createWithOptions(command.sub, options), options);
        }
    }
    static getConstructorMap(input) {
        if (isMap(input)) {
            return Array.from(input.entries());
        }
        if (isObject(input)) {
            return Array.from(Object.entries(input));
        }
        return null;
    }
    /**
     * Checks if the map contains a key, ignoring case.
     *
     * @param key Key to check for.
     * @param caseSensitivity Case sensitivity to use.
     * @return If the map contains a key, ignoring case.
     */
    hasCommand(key, caseSensitivity) {
        if (caseSensitivity === 1 /* INSENSITIVE */) {
            return Array.from(this.keys())
                .map(k => k.toLowerCase())
                .includes(key.toLowerCase());
        }
        return this.has(key);
    }
    /**
     * Returns the value for the key, ignoring case.
     *
     * @param key Key to check for.
     * @param caseSensitivity Case sensitivity to use.
     * @return The value for the key, ignoring case.
     */
    getCommand(key, caseSensitivity) {
        if (caseSensitivity === 1 /* INSENSITIVE */) {
            let result = null;
            this.forEach((value, k) => {
                if (key.toLowerCase() === k.toLowerCase()) {
                    result = value;
                }
            });
            return result;
        }
        // Return null instead of undefined to be backwards compatible.
        return this.has(key) ? this.get(key) : null;
    }
}

const clingyLogby = new Logby();

/**
 * Orchestrates mapping of {@link IArgument}s to user-provided input.
 *
 * @private
 */
class ArgumentMatcher {
    /**
     * Matches a list of {@link IArgument}s to a list of string input arguments.
     *
     * @param expected {@link Argument} list of a {@link ICommand}
     * @param provided List of user-provided arguments.
     */
    constructor(expected, provided) {
        this.missing = [];
        this.result = new Map();
        ArgumentMatcher.logger.debug("Matching arguments:", expected, provided);
        expected.forEach((expectedArg, i) => {
            if (i < provided.length) {
                const providedArg = provided[i];
                ArgumentMatcher.logger.trace(`Found matching argument for ${expectedArg.name}, adding to result: ${providedArg}`);
                this.result.set(expectedArg.name, providedArg);
            }
            else if (expectedArg.required) {
                ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, adding to missing.`);
                this.missing.push(expectedArg);
            }
            else if (!isNil(expectedArg.defaultValue)) {
                ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, using default: ${expectedArg.defaultValue}`);
                this.result.set(expectedArg.name, expectedArg.defaultValue);
            }
            else {
                ArgumentMatcher.logger.trace(`No matching argument found for ${expectedArg.name}, using null.`);
                this.result.set(expectedArg.name, null);
            }
        });
        ArgumentMatcher.logger.debug(`Finished matching arguments: ${expected.length} expected, ${this.result.size} found and ${this.missing.length} missing.`);
    }
}
ArgumentMatcher.logger = clingyLogby.getLogger(ArgumentMatcher);

/**
 * Gets similar keys of a key based on their string distance.
 *
 * @private
 * @param mapAliased Map to use for lookup.
 * @param name       Key to use.
 * @return List of similar keys.
 */
const getSimilar = (mapAliased, name) => strSimilar(name, Array.from(mapAliased.keys()), false);

/**
 * Lookup tools for resolving paths through {@link CommandMap}s.
 *
 * @private
 */
class LookupResolver {
    /**
     * Creates a new {@link LookupResolver}.
     *
     * @param caseSensitive If the lookup should honor case.
     */
    constructor(caseSensitive = true) {
        this.caseSensitivity = caseSensitive
            ? 0 /* SENSITIVE */
            : 1 /* INSENSITIVE */;
    }
    static createSuccessResult(pathNew, pathUsed, command, args) {
        const lookupSuccess = {
            successful: true,
            pathUsed,
            pathDangling: pathNew,
            type: 0 /* SUCCESS */,
            command,
            args
        };
        LookupResolver.logger.debug("Returning successful lookup result:", lookupSuccess);
        return lookupSuccess;
    }
    static createNotFoundResult(pathNew, pathUsed, currentPathFragment, commandMap) {
        LookupResolver.logger.warn(`Command '${currentPathFragment}' could not be found.`);
        return {
            successful: false,
            pathUsed,
            pathDangling: pathNew,
            type: 1 /* ERROR_NOT_FOUND */,
            missing: currentPathFragment,
            similar: getSimilar(commandMap, currentPathFragment)
        };
    }
    static createMissingArgsResult(pathNew, pathUsed, missing) {
        LookupResolver.logger.warn("Some arguments could not be found:", missing);
        return {
            successful: false,
            pathUsed,
            pathDangling: pathNew,
            type: 2 /* ERROR_MISSING_ARGUMENT */,
            missing
        };
    }
    /**
     * Resolves a pathUsed through a {@link CommandMap}.
     *
     * @param commandMap        Map to use.
     * @param path              Path to getPath.
     * @param argumentResolving Strategy for resolving arguments.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    resolve(commandMap, path, argumentResolving) {
        if (path.length === 0) {
            throw new Error("Path cannot be empty.");
        }
        return this.resolveInternal(commandMap, path, [], argumentResolving);
    }
    resolveInternal(commandMap, path, pathUsed, argumentResolving) {
        const currentPathFragment = path[0];
        const pathNew = path.slice(1);
        pathUsed.push(currentPathFragment);
        if (!this.hasCommand(commandMap, currentPathFragment)) {
            return LookupResolver.createNotFoundResult(pathNew, pathUsed, currentPathFragment, commandMap);
        }
        // We already checked if the key exists, assert its existence.
        const command = (commandMap.getCommand(currentPathFragment, this.caseSensitivity));
        LookupResolver.logger.debug(`Found command: '${currentPathFragment}'.`);
        /*
         * Recurse into sub-commands if:
         * Additional items are in the path AND
         * the current command has sub-commands AND
         * the sub-commands contain the next path item.
         */
        if (pathNew.length > 0 &&
            isInstanceOf(command.sub, Clingy) &&
            this.hasCommand(command.sub.mapAliased, pathNew[0])) {
            return this.resolveInternalSub(pathNew, pathUsed, command, argumentResolving);
        }
        /*
         * Skip checking for arguments if:
         * The parameter argumentResolving is set to ignore arguments OR
         * the command has no arguments defined OR
         * the command has an empty array defined as arguments.
         */
        let argumentsResolved;
        if (argumentResolving === 1 /* IGNORE */ ||
            isNil(command.args) ||
            command.args.length === 0) {
            LookupResolver.logger.debug("No arguments defined, using empty map.");
            argumentsResolved = new Map();
        }
        else {
            LookupResolver.logger.debug(`Looking up arguments: '${pathNew}'.`);
            const argumentMatcher = new ArgumentMatcher(command.args, pathNew);
            if (argumentMatcher.missing.length > 0) {
                return LookupResolver.createMissingArgsResult(pathNew, pathUsed, argumentMatcher.missing);
            }
            argumentsResolved = argumentMatcher.result;
            LookupResolver.logger.debug("Successfully looked up arguments: ", argumentsResolved);
        }
        return LookupResolver.createSuccessResult(pathNew, pathUsed, command, argumentsResolved);
    }
    resolveInternalSub(pathNew, pathUsed, command, argumentResolving) {
        LookupResolver.logger.debug("Resolving sub-commands:", command.sub, pathNew);
        return this.resolveInternal(command.sub.mapAliased, pathNew, pathUsed, argumentResolving);
    }
    hasCommand(commandMap, pathPart) {
        return commandMap.hasCommand(pathPart, this.caseSensitivity);
    }
}
LookupResolver.logger = clingyLogby.getLogger(LookupResolver);

/**
 * Manages parsing input strings into a path list.
 *
 * @private
 */
class InputParser {
    // noinspection TsLint
    /**
     * Creates an {@link InputParser}.
     *
     * @param legalQuotes List of quotes to use when parsing strings.
     */
    constructor(legalQuotes = ["\""]) {
        this.legalQuotes = legalQuotes;
        this.pattern = this.generateMatcher();
    }
    /**
     * Parses an input string.
     *
     * @param input Input string to parse.
     * @return Path list.
     */
    parse(input) {
        InputParser.logger.debug(`Parsing input '${input}'`);
        const result = [];
        const pattern = new RegExp(this.pattern);
        let match;
        // noinspection AssignmentResultUsedJS
        while ((match = pattern.exec(input))) {
            InputParser.logger.trace(`Found match '${match}'`);
            const groups = arrCompact(match.slice(1));
            if (groups.length > 0) {
                InputParser.logger.trace(`Found group '${groups[0]}'`);
                result.push(groups[0]);
            }
        }
        return result;
    }
    generateMatcher() {
        InputParser.logger.debug("Creating matcher.");
        const matchBase = "(\\S+)";
        const matchItems = this.legalQuotes
            .map((str) => `\\${str}`)
            .map(quote => `${quote}(.+?)${quote}`);
        matchItems.push(matchBase);
        let result;
        try {
            result = new RegExp(matchItems.join("|"), "g");
        }
        catch (e) {
            InputParser.logger.error("The parsing pattern is invalid, this should never happen.", e);
            throw e;
        }
        return result;
    }
}
InputParser.logger = clingyLogby.getLogger(InputParser);

/**
 * Core {@link Clingy} class, entry point for creation of a new instance.
 */
class Clingy {
    /**
     * Creates a new {@link Clingy} instance.
     *
     * @param commands      Map of commands to create the instance with.
     * @param options       Option object.
     */
    constructor(commands = {}, options = {}) {
        this.lookupResolver = new LookupResolver(options.caseSensitive);
        this.inputParser = new InputParser(options.legalQuotes);
        this.map = CommandMap.createWithOptions(commands, options);
        this.mapAliased = new CommandMap();
        this.updateAliases();
    }
    /**
     * Sets a command on this instance.
     *
     * @param key Key of the command.
     * @param command The command.
     */
    setCommand(key, command) {
        this.map.set(key, command);
        this.updateAliases();
    }
    // TODO replace .get() with .getCommand() (breaking)
    /**
     * Gets a command from this instance.
     *
     * @param key Key of the command.
     */
    getCommand(key) {
        return this.mapAliased.get(key);
    }
    // noinspection JSUnusedGlobalSymbols
    // TODO replace .has() with .hasCommand() (breaking)
    /**
     * Checks if a command on this instance exists for this key.
     *
     * @param key Key of the command.
     */
    hasCommand(key) {
        return this.mapAliased.has(key);
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Checks if a pathUsed resolves to a command.
     *
     * @param path Path to look up.
     * @return If the pathUsed resolves to a command.
     */
    hasPath(path) {
        return this.getPath(path).successful;
    }
    /**
     * Resolves a pathUsed to a command.
     *
     * @param path Path to look up.
     * @return Lookup result, either {@link ILookupSuccess} or {@link ILookupErrorNotFound}.
     */
    getPath(path) {
        Clingy.logger.debug(`Resolving pathUsed: ${path}`);
        return this.lookupResolver.resolve(this.mapAliased, path, 1 /* IGNORE */);
    }
    /**
     * Parses a string into a command and arguments.
     *
     * @param input String to parse.
     * @return Lookup result, either {@link ILookupSuccess}, {@link ILookupErrorNotFound}
     * or {@link ILookupErrorMissingArgs}.
     */
    parse(input) {
        Clingy.logger.debug(`Parsing input: '${input}'`);
        return this.lookupResolver.resolve(this.mapAliased, this.inputParser.parse(input), 0 /* RESOLVE */);
    }
    /**
     * @private
     */
    updateAliases() {
        Clingy.logger.debug("Updating aliased map.");
        this.mapAliased.clear();
        this.map.forEach((value, key) => {
            this.mapAliased.set(key, value);
            value.alias.forEach(alias => {
                if (this.mapAliased.has(alias)) {
                    Clingy.logger.warn(`Alias '${alias}' conflicts with a previously defined key, will be ignored.`);
                }
                else {
                    Clingy.logger.trace(`Created alias '${alias}' for '${key}'`);
                    this.mapAliased.set(alias, value);
                }
            });
        });
        Clingy.logger.debug("Done updating aliased map.");
    }
}
Clingy.logger = clingyLogby.getLogger(Clingy);

// noinspection SpellCheckingInspection
const IMAGE_LINK = "http://static.tumblr.com/df323b732955715fe3fb5a506999afc7/" +
    "rflrqqy/H9Cnsyji6/tumblr_static_88pgfgk82y4ok80ckowwwwow4.jpg";
const aboutFn = (args, argsAll, msg, dingy) => {
    // noinspection SpellCheckingInspection
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

// noinspection SpellCheckingInspection
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

const serversFn = (args, argsAll, msg, dingy) => {
    return {
        val: dingy.client.guilds
            .array()
            .map(guild => `${guild.id}: ${guild.name}`)
            .join("\n"),
        code: true
    };
};
const servers = {
    fn: serversFn,
    args: [],
    alias: [],
    data: {
        hidden: true,
        usableInDMs: true,
        powerRequired: 10,
        help: "Shows the servers the bot is on."
    }
};

const clapFn = (args) => args
    .get("text")
    .split(" ")
    .map(word => "**" + word.toUpperCase() + "**")
    .join(":clap:");
// noinspection SpellCheckingInspection
const clap = {
    fn: clapFn,
    args: [
        {
            name: "text",
            required: true
        }
    ],
    alias: ["clapifier"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Clap a text."
    }
};

const INTERESTING_IMAGE_LINK = "https://media.giphy.com/media/KKtAZiNVEeU8/giphy.gif";
const interestingFn = () => {
    return {
        val: "Interesting.",
        files: [INTERESTING_IMAGE_LINK]
    };
};
const interesting = {
    fn: interestingFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Declare something as interesting."
    }
};

// noinspection JSUnusedGlobalSymbols
/**
 * Creates a displayable string of an user.
 *
 * @private
 * @param {User} user
 * @returns {string}
 */
const toFullName = (user) => `${user.username}#${user.discriminator}`;

const SIZE_LIMIT = 10;
/**
 * Returns the decimal values of a number as a string.
 *
 * @param val Value to use
 * @return Decimal values as a string.
 */
const getDecimalsAsString = (val) => {
    const str = val.toString();
    return str.slice(str.indexOf(".") + 1);
};
/**
 * Fits a string to the given size. if it is smaller than the size, its repeated. if its longer, its cut of.
 *
 * @param str String to fit.
 * @param size Size to use for fitting.
 * @return Fitted string.
 */
const fitStringToSize = (str, size) => {
    let result = str;
    if (result.length < size) {
        result = result.repeat(Math.ceil(size / result.length));
    }
    if (result.length > size) {
        result = result.slice(0, size);
    }
    return result;
};
/**
 * Create an unique value for a string, which is a string with the length 10, containing numbers.
 * We _could_ use actual hashing or something here but that seems overkill.
 *
 * @param str String to create the value for.
 * @return The unique value.
 */
const calcUniqueString = (str) => {
    const seed = str
        .toLowerCase()
        .split("")
        .map(letter => letter.charCodeAt(0))
        .reduce((a, b) => Math.sin(a) + Math.cos(b));
    return fitStringToSize(getDecimalsAsString(seed), SIZE_LIMIT);
};
/**
 * Create an unique value for a user, which is a string with the length 10, containing numbers.
 *
 * @param user User to create the value for.
 * @return The unique value.
 */
const calcUserUniqueString = (user) => calcUniqueString(toFullName(user));
/**
 * Calculates a number from the given unique string.
 *
 * @param str String to use.
 * @param max Inclusive max value.
 * @return Unique number from 0 to max.
 */
const calcNumberFromUniqueString = (str, max = 10) => {
    const val = Number(str[0]);
    return Math.floor(((val + 1) / 10) * max);
};

const rateFn = (args, argsAll, msg) => {
    let targetName;
    let rating;
    const target = args.get("target");
    if (!isNil(target)) {
        targetName = target;
        rating = calcNumberFromUniqueString(calcUniqueString(targetName), 10);
    }
    else {
        targetName = toFullName(msg.author);
        rating = calcNumberFromUniqueString(calcUserUniqueString(msg.author), 10);
    }
    return `I rate ${targetName} a ${rating}/10`;
};
const rate = {
    fn: rateFn,
    args: [
        {
            name: "target",
            required: false
        }
    ],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Rates something from 1 to 10."
    }
};

const roastFn = () => {
    return "Respects have been paid.";
};
const roast = {
    fn: roastFn,
    args: [
        {
            name: "target",
            required: true
        }
    ],
    alias: ["roasted"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Roast someone."
    }
};

const SEPARATOR = "---";
const SPACE_BEFORE = 14;
const SPACE_AFTER = 32;
const BARS_PER_VAL = 3;
const BAR_CHARACTER = "|";
const formatEntry = (name, val) => {
    const valInt = Number(val);
    const barSize = valInt * BARS_PER_VAL;
    const spaceBeforeSize = SPACE_BEFORE - name.length;
    const spaceAfterSize = SPACE_AFTER - barSize;
    const paddedBars = " ".repeat(spaceBeforeSize) +
        BAR_CHARACTER.repeat(barSize) +
        " ".repeat(spaceAfterSize);
    return `${name}:${paddedBars}${valInt}`;
};
const createRpgStats = (user) => {
    const [valVit, valStr, valDex, valInt, valCreativity, valLearning, valCharisma, valHumor, valAttractivity] = calcUserUniqueString(user).split("");
    return [
        stringify(user.username),
        SEPARATOR,
        formatEntry("Vitality", valVit),
        formatEntry("Strength", valStr),
        formatEntry("Dexterity", valDex),
        SEPARATOR,
        formatEntry("Intelligence", valInt),
        formatEntry("Creativity", valCreativity),
        formatEntry("Learning", valLearning),
        SEPARATOR,
        formatEntry("Charisma", valCharisma),
        formatEntry("Humor", valHumor),
        formatEntry("Attractivity", valAttractivity),
        SEPARATOR
    ].join("\n");
};
const rpgFn = (args, argsAll, msg) => {
    return {
        val: createRpgStats(msg.author),
        code: "yaml"
    };
};
const rpg = {
    fn: rpgFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Creates a RPG-like stat list for you."
    }
};

const getMiddleIndex = (str) => Math.round(str.length / 2);
const shipFn = (args) => {
    const person1 = args.get("person1");
    const person2 = args.get("person2");
    const shipName = person1.substr(0, getMiddleIndex(person1)) +
        person2.substr(getMiddleIndex(person2));
    const person1Score = calcNumberFromUniqueString(calcUniqueString(person1), 10);
    const person2Score = calcNumberFromUniqueString(calcUniqueString(person2), 10);
    const scoreTotal = person1Score * person2Score;
    return {
        val: [
            "Shipping Complete:",
            "---",
            `${person1} + ${person2} (Ship name: ${shipName})`,
            `Score: ${scoreTotal}%`
        ].join("\n"),
        code: true
    };
};
const ship = {
    fn: shipFn,
    args: [
        {
            name: "person1",
            required: true
        },
        {
            name: "person2",
            required: false
        }
    ],
    alias: ["fuse"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Ships two people."
    }
};

const squareText = (str) => {
    /*
     * Use spread rather than .split() to support wide characters
     * https://github.com/mmmpld/lisa-bot/commit/c701cec417d6c53a700b8c038da99bc8e6617e0c
     */
    const word = [...str];
    const wordReversed = Array.from(word).reverse();
    const result = [];
    for (let rowIndex = 0; rowIndex < word.length; rowIndex++) {
        const line = [];
        for (let lineIndex = 0; lineIndex < word.length; lineIndex++) {
            let val;
            if (rowIndex === 0) {
                val = word[lineIndex];
            }
            else if (rowIndex === word.length - 1) {
                val = wordReversed[lineIndex];
            }
            else if (lineIndex === 0) {
                val = word[rowIndex];
            }
            else if (lineIndex === word.length - 1) {
                val = wordReversed[rowIndex];
            }
            else {
                val = " ";
            }
            line.push(val);
        }
        result.push(line.join(" "));
    }
    return result.join("\n");
};
const squareFn = (args) => {
    return {
        val: squareText(args.get("text")),
        code: true
    };
};
const square = {
    fn: squareFn,
    args: [
        {
            name: "text",
            required: true
        }
    ],
    alias: ["squares"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Output a text as a square."
    }
};

const funFn = () => "Respects have been paid.";
const fun = {
    fn: funFn,
    args: [],
    alias: ["f"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Misc. fun commands."
    },
    sub: { clap, interesting, rate, roast, rpg, ship, square }
};

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
    // noinspection JSMethodCanBeStatic
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
    // noinspection JSMethodCanBeStatic
    getLifetime(lisaData) {
        if (!lisaData.life.isAlive) {
            return lisaData.life.death - lisaData.life.birth;
        }
        return Date.now() - lisaData.life.birth;
    }
    // noinspection JSMethodCanBeStatic
    getTimeSinceDeath(lisaData) {
        return Date.now() - lisaData.life.death;
    }
    getHighScore(lisaData) {
        this.updateHighScoreIfRequired(lisaData);
        return lisaData.score.highScore;
    }
    // noinspection JSMethodCanBeStatic
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
    // noinspection JSMethodCanBeStatic
    humanizeDuration(duration$1) {
        return duration(duration$1).humanize();
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
// noinspection SpellCheckingInspection
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

// noinspection SpellCheckingInspection
const HIGH_QUALITY_JOKES = [
    "Why do trees have so many friends? They branch out.",
    "A photographer was great at botany because he knew photo synthesis.",
    "When the plums dry on your tree, it's time to prune.",
    "The tree that was creating energy was turned into a power-plant.",
    "My fear of roses is a thorny issue. I'm not sure what it stems from, but it seems likely I'll be stuck with it.",
    "The raisin wined about how he couldn't achieve grapeness.",
    "I can't find my rutabaga. I hope it will turnip.",
    "When I bought some fruit trees the nursery owner gave me some insects to help with pollination." +
        " They were free bees.",
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
// noinspection SpellCheckingInspection
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
        help: "Shows the status of Lisa."
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
// noinspection SpellCheckingInspection
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

const commands = {
    /*
     * Core
     */
    about,
    invite,
    servers,
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
     * Fun
     */
    fun,
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
const lisaBot = new Dingy(commands, createConfig(PREFIX));
lisaBot.client.on("message", onMessage);
lisaChevron.set("plain" /* PLAIN */, [], lisaBot.persistentStorage, "_LISA_STORAGE" /* STORAGE */);
lisaBot
    .connect(DISCORD_TOKEN)
    .then(() => {
    logger$2.info("LisaBot started successfully.");
    onConnect(lisaBot);
})
    .catch(e => logger$2.error("An unexpected error occurred.", e));
