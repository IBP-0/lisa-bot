import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { toFullName } from "di-ngy/src/util/toFullName";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const hugFn: commandFn = (
    args: resolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    // noinspection SpellCheckingInspection
    return lisaController.performAction(
        toFullName(msg.author),
        0,
        20,
        ["_Is hugged_.", "_hug_"],
        ["It's too late to hug poor Lisa..."]
    );
};

// noinspection SpellCheckingInspection
const hug: IDingyCommand = {
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
