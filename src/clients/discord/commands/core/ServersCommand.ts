import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

const INVITE_MESSAGE = `I'm always happy to join new servers!
If you want me to join your server, follow this link:
<https://discordapp.com/oauth2/authorize?&client_id=263671526279086092&scope=bot>`;

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

    private getServers() {
        return this.client.guilds
            .array()
            .map(guild => `${guild.id}: ${guild.name}`)
            .join("\n");
    }
}

export { ServersCommand };
