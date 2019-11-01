import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";
import { toFullName } from "di-ngy";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const hugFn: CommandFn = (
    args: ResolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    // Noinspection SpellCheckingInspection
    return lisaController.performAction(
        toFullName(msg.author),
        0,
        20,
        ["_Is hugged_.", "_hug_"],
        ["It's too late to hug poor Lisa..."]
    );
};

// Noinspection SpellCheckingInspection
const hug: DingyCommand = {
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

export { hug };
