import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { toFullName } from "di-ngy/src/util/toFullName";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const GOAT_IDS = [
    "169804264988868609",
    "178470784984023040",
    "143158243076734986",
    "128985967875850240",
    "273221196001181697"
];

const baaFn: commandFn = (
    args: resolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    if (!GOAT_IDS.includes(msg.author.id)) {
        return "You're not a goat uwu";
    }

    const lisaController: LisaController = lisaChevron.get(LisaController);

    // noinspection SpellCheckingInspection
    return lisaController.performAction(
        toFullName(msg.author),
        0,
        30,
        ["Baa", "Baa~", "Baaaaaaa ^w^", ":goat:"],
        ["Baa? a dead Lisa..."]
    );
};

const baa: IDingyCommand = {
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

export { baa };
