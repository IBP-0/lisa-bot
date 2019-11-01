import { Dingy } from "di-ngy";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { Message } from "discord.js";
import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";

// noinspection SpellCheckingInspection
const IMAGE_LINK =
    "http://static.tumblr.com/df323b732955715fe3fb5a506999afc7/" +
    "rflrqqy/H9Cnsyji6/tumblr_static_88pgfgk82y4ok80ckowwwwow4.jpg";

const aboutFn: CommandFn = (
    args: ResolvedArgumentMap,
    argsAll: string[],
    msg: Message,
    dingy: Dingy
) => {
    // noinspection SpellCheckingInspection
    return {
        val: [
            "Hello!",
            "I am Lisa, an indoor plant, inspired by Lisa from 'Life is Strange'.",
            "<http://dontnodentertainment.wikia.com/wiki/Lisa_the_Plant>",
            dingy.config.strings.separator,
            "For more information, use `$help` or go to <https://github.com/FelixRilling/lisa-bot>.",
            "If you have questions or want to report a bug, message my creator: NobodyRocks#5051."
        ].join("\n"),
        files: [IMAGE_LINK]
    };
};

const about: DingyCommand = {
    fn: aboutFn,
    args: [],
    alias: ["info"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Shows info about this bot."
    }
};

export { about };
