"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
class InviteCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "invite",
            aliases: ["join"],
            group: "util",
            memberName: "invite",
            description: "Add Lisa to your server."
        });
    }
    async run(message) {
        const invite = await this.client.generateInvite([
            discord_js_1.Permissions.FLAGS.SEND_MESSAGES,
            discord_js_1.Permissions.FLAGS.EMBED_LINKS,
            discord_js_1.Permissions.FLAGS.ATTACH_FILES
        ]);
        return message.say(`I'm always happy to join new servers!
If you want me to join your server, follow this link:
${invite}`);
    }
}
exports.InviteCommand = InviteCommand;
