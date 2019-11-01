import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";
import { toFullName } from "di-ngy";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
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

const baaFn: CommandFn = (
    args: ResolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    if (!GOAT_IDS.includes(msg.author.id)) {
        return "You're not a goat uwu";
    }

    const lisaController: LisaController = lisaChevron.get(LisaController);

    // Noinspection SpellCheckingInspection
    return lisaController.performAction(
        toFullName(msg.author),
        0,
        30,
        ["Baa", "Baa~", "Baaaaaaa ^w^", ":goat:"],
        ["Baa? a dead Lisa..."]
    );
};

const baa: DingyCommand = {
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
