import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { toFullName } from "di-ngy/src/util/toFullName";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const MISSY_ID = ["273221196001181697"];

const missyFn: commandFn = (
    args: resolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    if (!MISSY_ID.includes(msg.author.id)) {
        return "You're not a missy <w<";
    }

    const lisaController: LisaController = lisaChevron.get(LisaController);

    // noinspection SpellCheckingInspection
    return lisaController.performAction(
        toFullName(msg.author),
        0,
        40,
        ["_Baaaaaaaaaaaaaa_"],
        ["OwO whats this? a dead Lisa..."]
    );
};

// noinspection SpellCheckingInspection
const missy: IDingyCommand = {
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

export { missy };
