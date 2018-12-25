import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { calcUserUniqueValue } from "./lib/calcUserUniqueValue";

const rateFn: commandFn = (
    args: resolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    const userUniqueNumber = Number(calcUserUniqueValue(msg.author)[0]);
    const rating = Math.floor((userUniqueNumber / 10) * 11);
    return `I rate ${msg.author.username} a ${rating}/10`;
};

const rate: IDingyCommand = {
    fn: rateFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Rates something from 1 to 10."
    }
};

export { rate };
