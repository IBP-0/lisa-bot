import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
const clapFn: CommandFn = (args: ResolvedArgumentMap) =>
    args
        .get("text")!
        .split(" ")
        .map(word => "**" + word.toUpperCase() + "**")
        .join(":clap:");

// noinspection SpellCheckingInspection
const clap: DingyCommand = {
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
