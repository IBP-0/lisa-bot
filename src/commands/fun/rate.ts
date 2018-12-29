import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { toFullName } from "di-ngy/src/util/toFullName";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { isNil } from "lightdash";
import {
    calcNumberFromUniqueString,
    calcUniqueString,
    calcUserUniqueString
} from "./lib/calcUnique";

const rateFn: commandFn = (
    args: resolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    let targetName: string;
    let rating: number;

    const target = args.get("target");
    if (isNil(target)) {
        targetName = target!;
        rating = calcNumberFromUniqueString(calcUniqueString(targetName), 10);
    } else {
        targetName = toFullName(msg.author);
        rating = calcNumberFromUniqueString(
            calcUserUniqueString(msg.author),
            10
        );
    }

    return `I rate ${targetName} a ${rating}/10`;
};

const rate: IDingyCommand = {
    fn: rateFn,
    args: [
        {
            name: "target",
            required: false
        }
    ],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Rates something from 1 to 10."
    }
};

export { rate };
