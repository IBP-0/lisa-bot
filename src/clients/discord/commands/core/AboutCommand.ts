import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";

const IMAGE_LINK =
    "https://static.tumblr.com/df323b732955715fe3fb5a506999afc7/rflrqqy/H9Cnsyji6/tumblr_static_88pgfgk82y4ok80ckowwwwow4.jpg";

const ABOUT_MESSAGE = `Hello!
I am Lisa, an indoor plant inspired by Lisa from 'Life is Strange'.
<https://dontnodentertainment.wikia.com/wiki/Lisa_the_Plant>
----------
For more information, use \`$help\` or go to <https://github.com/FelixRilling/lisa-bot>.
If you have questions or want to report a bug, send me a mail at lisa-bot@rilling.dev.`;

class AboutCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "about",
            aliases: ["why", "info"],
            group: "util",
            memberName: "about",
            description: "Shows info about the bot.",
        });
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(ABOUT_MESSAGE, { files: [IMAGE_LINK] });
    }
}

export { AboutCommand };
