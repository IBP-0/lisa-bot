import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

class ServersCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "servers",
            aliases: [],
            group: "util",
            memberName: "servers",
            description: "Shows the servers the bot is on.",
            ownerOnly: true
        });
    }

    run(message: CommandMessage): Promise<Message | Message[]> {
        return message.say(this.getServers());
    }

    private getServers(): string {
        return this.client.guilds
            .array()
            .map(guild => `${guild.id}: ${guild.name}`)
            .join("\n");
    }
}

export { ServersCommand };
