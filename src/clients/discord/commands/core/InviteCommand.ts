import type { Message } from "discord.js";
import { Permissions } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";

class InviteCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "invite",
            aliases: ["join"],
            group: "util",
            memberName: "invite",
            description: "Add Lisa to your server.",
        });
    }

    async run(message: CommandoMessage): Promise<Message | Message[]> {
        const invite = await this.client.generateInvite([
            Permissions.FLAGS.SEND_MESSAGES,
            Permissions.FLAGS.EMBED_LINKS,
            Permissions.FLAGS.ATTACH_FILES,
        ]);
        return message.say(`I'm always happy to join new servers!
If you want me to join your server, follow this link:
${invite}`);
    }
}

export { InviteCommand };
