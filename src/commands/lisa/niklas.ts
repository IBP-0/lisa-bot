import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";
import { toFullName } from "di-ngy";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const NIKLAS_ID = ["178470784984023040"];

const niklasFn: CommandFn = (
    args: ResolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    if (!NIKLAS_ID.includes(msg.author.id)) {
        return "You're not a niklas uwu";
    }

    const lisaController: LisaController = lisaChevron.get(LisaController);

    // Noinspection SpellCheckingInspection
    return lisaController.performAction(
        toFullName(msg.author),
        0,
        40,
        ["_tight huggu_"],
        ["OwO whats this? a dead Lisa..."]
    );
};

const niklas: DingyCommand = {
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

export { niklas };
