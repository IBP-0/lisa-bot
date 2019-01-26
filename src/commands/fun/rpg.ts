import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message, User } from "discord.js";
import { stringify } from "yamljs";
import { calcUserUniqueString } from "./lib/calcUnique";

const SEPARATOR = "---";

const SPACE_BEFORE = 14;
const SPACE_AFTER = 32;

const BARS_PER_VAL = 3;
const BAR_CHARACTER = "|";

const formatEntry = (name: string, val: string) => {
    const valInt = Number(val);

    const barSize = valInt * BARS_PER_VAL;
    const spaceBeforeSize = SPACE_BEFORE - name.length;
    const spaceAfterSize = SPACE_AFTER - barSize;

    const paddedBars =
        " ".repeat(spaceBeforeSize) +
        BAR_CHARACTER.repeat(barSize) +
        " ".repeat(spaceAfterSize);

    return `${name}:${paddedBars}${valInt}`;
};

const createRpgStats = (user: User) => {
    const [
        valVit,
        valStr,
        valDex,
        valInt,
        valCreativity,
        valLearning,
        valCharisma,
        valHumor,
        valAttractivity
    ] = calcUserUniqueString(user).split("");

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

const rpgFn: commandFn = (
    args: resolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    return {
        val: createRpgStats(msg.author),
        code: "yaml"
    };
};

const rpg: IDingyCommand = {
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

export { rpg };
