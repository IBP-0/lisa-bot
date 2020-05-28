"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServersCommand = void 0;
const discord_js_commando_1 = require("discord.js-commando");
class ServersCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "servers",
            aliases: [],
            group: "util",
            memberName: "servers",
            description: "Shows the servers the bot is on.",
            ownerOnly: true,
        });
    }
    run(message) {
        return message.say(this.getServers());
    }
    getServers() {
        return this.client.guilds.cache
            .array()
            .map((guild) => `${guild.id}: ${guild.name}`)
            .join("\n");
    }
}
exports.ServersCommand = ServersCommand;
//# sourceMappingURL=ServersCommand.js.map