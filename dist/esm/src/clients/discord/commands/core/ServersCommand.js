import { Command } from "discord.js-commando";
const INVITE_MESSAGE = `I'm always happy to join new servers!
If you want me to join your server, follow this link:
<https://discordapp.com/oauth2/authorize?&client_id=263671526279086092&scope=bot>`;
class ServersCommand extends Command {
    constructor(client) {
        super(client, {
            name: "servers",
            aliases: [],
            group: "util",
            memberName: "servers",
            description: "Shows the servers the bot is on.",
            ownerOnly: true
        });
    }
    run(message) {
        return message.say(this.getServers());
    }
    getServers() {
        return this.client.guilds
            .array()
            .map(guild => `${guild.id}: ${guild.name}`)
            .join("\n");
    }
}
export { ServersCommand };
//# sourceMappingURL=ServersCommand.js.map