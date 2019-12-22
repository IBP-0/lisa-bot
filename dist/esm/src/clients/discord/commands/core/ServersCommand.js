import { Command } from "discord.js-commando";
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