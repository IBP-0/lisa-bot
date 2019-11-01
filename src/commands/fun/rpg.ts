import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { Message, User } from "discord.js";
import { stringify } from "yamljs";
import { calcUserUniqueString } from "./lib/calcUnique";

const SEPARATOR = "---";

const SPACE_BEFORE = 14;
const SPACE_AFTER = 32;

const BARS_PER_VAL = 3;
const BAR_CHARACTER = "|";

const formatEntry = (name: string, val: string): string => {
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

const createRpgStats = (user: User): string => {
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

const rpgFn: CommandFn = (
    args: ResolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    return {
        val: createRpgStats(msg.author),
        code: "yaml"
    };
};

const rpg: DingyCommand = {
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
