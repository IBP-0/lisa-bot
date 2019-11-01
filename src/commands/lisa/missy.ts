import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";
import { toFullName } from "di-ngy";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const MISSY_ID = ["273221196001181697"];

const missyFn: CommandFn = (
    args: ResolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    if (!MISSY_ID.includes(msg.author.id)) {
        return "You're not a missy <w<";
    }

    const lisaController: LisaController = lisaChevron.get(LisaController);

    // Noinspection SpellCheckingInspection
    return lisaController.performAction(
        toFullName(msg.author),
        0,
        40,
        ["_Baaaaaaaaaaaaaa_"],
        ["OwO whats this? a dead Lisa..."]
    );
};

// Noinspection SpellCheckingInspection
const missy: DingyCommand = {
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
