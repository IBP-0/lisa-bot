import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { toFullName } from "di-ngy/src/util/toFullName";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const NIKLAS_ID = ["178470784984023040"];

const niklasFn: commandFn = (
    args: resolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    if (!NIKLAS_ID.includes(msg.author.id)) {
        return "You're not a niklas uwu";
    }

    const lisaController: LisaController = lisaChevron.get(LisaController);

    // noinspection SpellCheckingInspection
    return lisaController.performAction(
        toFullName(msg.author),
        0,
        40,
        ["_tight huggu_"],
        ["OwO whats this? a dead Lisa..."]
    );
};

const niklas: IDingyCommand = {
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
