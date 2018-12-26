import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";

const clapFn: commandFn = (args: resolvedArgumentMap) =>
    args
        .get("text")!
        .split(" ")
        .map(word => "**" + word.toUpperCase() + "**")
        .join(":clap:");

const clap: IDingyCommand = {
    fn: clapFn,
    args: [
        {
            name: "text",
            required: true
        }
    ],
    alias: ["clapifier"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Clap a text."
    }
};

export { clap };
