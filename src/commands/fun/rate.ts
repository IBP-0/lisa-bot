import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";import { toFullName } from "di-ngy";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { Message } from "discord.js";
import { isNil } from "lightdash";
import {
    calcNumberFromUniqueString,
    calcUniqueString,
    calcUserUniqueString
} from "./lib/calcUnique";

const rateFn: CommandFn = (
    args: ResolvedArgumentMap,
    argsAll: string[],
    msg: Message
) => {
    let targetName: string;
    let rating: number;

    const target = args.get("target");
    if (!isNil(target)) {
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

const rate: DingyCommand = {
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
