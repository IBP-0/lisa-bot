import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { Dingy } from "di-ngy";
import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";

const serversFn: commandFn = (
    args: resolvedArgumentMap,
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

const servers: IDingyCommand = {
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
