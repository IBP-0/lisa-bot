import { Command } from "discord.js-commando";
const INVITE_MESSAGE = `I'm always happy to join new servers!
If you want me to join your server, follow this link:
<https://discordapp.com/oauth2/authorize?&client_id=263671526279086092&scope=bot>`;
class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "invite",
            aliases: ["join"],
            group: "util",
            memberName: "invite",
            description: "Add Lisa to your server."
        });
    }
    run(message) {
        return message.say(INVITE_MESSAGE);
    }
}
export { InviteCommand };
//# sourceMappingURL=InviteCommand.js.map