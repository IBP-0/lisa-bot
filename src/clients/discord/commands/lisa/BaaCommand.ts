import { Message } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { chevron } from "../../../../chevron";
import { LisaDiscordCommandController } from "../../LisaDiscordCommandController";

const GOAT_IDS = [
    "169804264988868609",
    "178470784984023040",
    "143158243076734986",
    "128985967875850240",
    "273221196001181697"
];

class BaaCommand extends Command {
    private readonly lisaDiscordCommandController: LisaDiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "baa",
            aliases: [],
            group: "lisa",
            memberName: "baa",
            description: "Baa.",
            hidden: true
        });
        this.lisaDiscordCommandController = chevron.getInjectableInstance(
            LisaDiscordCommandController
        );
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(
            this.lisaDiscordCommandController.performAction(
                message.author,
                0,
                30,
                GOAT_IDS,
                ["Baa", "Baa~", "Baaaaaaa ^w^", ":goat:"],
                ["Baa? a dead Lisa..."],
                ["You're not a goat uwu"]
            )
        );
    }
}

export { BaaCommand };
