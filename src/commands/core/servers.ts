import { Dingy } from "di-ngy";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { Message } from "discord.js";
import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";

const serversFn: CommandFn = (
    args: ResolvedArgumentMap,
    argsAll: string[],
    msg: Message,
    dingy: Dingy
) => {
    return {
        val: dingy.client.guilds
            .array()
            .map(guild => `${guild.id}: ${guild.name}`)
            .join("\n"),
        code: true
    };
};

const servers: DingyCommand = {
    fn: serversFn,
    args: [],
    alias: [],
    data: {
        hidden: true,
        usableInDMs: true,
        powerRequired: 10,
        help: "Shows the servers the bot is on."
    }
};

export { servers };
