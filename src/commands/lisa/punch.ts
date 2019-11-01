import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";
import { toFullName } from "di-ngy";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const punchFn: CommandFn = (
    args: ResolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    // Noinspection SpellCheckingInspection
    return lisaController.performAction(
        toFullName(msg.author),
        0,
        -10,
        ["_Is being punched in the leaves._", "oof.", "ouch ouw owie."],
        ["The dead feel no pain..."]
    );
};

const punch: DingyCommand = {
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

export { punch };
