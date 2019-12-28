import { Message } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { chevron } from "../../../../chevron";
import { DiscordCommandController } from "../../controller/DiscordCommandController";

const MISSY_ID = ["273221196001181697"];

class MissyCommand extends Command {
    private readonly lisaDiscordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "missy",
            aliases: [],
            group: "lisa",
            memberName: "missy",
            description: "baaff",
            hidden: true
        });
        this.lisaDiscordCommandController = chevron.getInjectableInstance(
            DiscordCommandController
        );
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(
            this.lisaDiscordCommandController.performAction(
                message.author,
                0,
                40,
                MISSY_ID,
                ["_Baaaaaaaaaaaaaa_"],
                ["OwO whats this? a dead Lisa..."],
                ["You're not a missy <w<"]
            )
        );
    }
}

export { MissyCommand };
