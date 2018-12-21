import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { Dingy } from "di-ngy";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { addReactions } from "./lib/addReactions";
import { createLetterEmoji } from "./lib/createLetterEmoji";

const YES_OR_NO_ICONS = [
    ["Y", createLetterEmoji("Y")],
    ["N", createLetterEmoji("N")]
];

const yesOrNoFn: commandFn = (
    args: resolvedArgumentMap,
    argsAll: string[],
    msg: Message,
    dingy: Dingy
) => {
    return {
        val: [
            `${args.get("question")}`,
            dingy.config.strings.separator,
            "Y/N?"
        ].join("\n"),
        code: "yaml",
        onSend: msgSent => {
            if (!Array.isArray(msgSent)) {
                addReactions(new Array(2), YES_OR_NO_ICONS, msgSent);
            }
        }
    };
};

const yesOrNo: IDingyCommand = {
    fn: yesOrNoFn,
    args: [
        {
            name: "question",
            required: true
        }
    ],
    alias: ["y/n"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: 'Creates a poll with "yes" and "no" as answers.'
    }
};

export { yesOrNo };
