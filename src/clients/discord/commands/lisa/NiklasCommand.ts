import { Message } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { chevron } from "../../../../chevron";
import { LisaDiscordCommandController } from "../../controller/LisaDiscordCommandController";

const NIKLAS_ID = ["178470784984023040"];

class NiklasCommand extends Command {
    private readonly lisaDiscordCommandController: LisaDiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "niklas",
            aliases: [],
            group: "lisa",
            memberName: "niklas",
            description: "^w^",
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
                40,
                NIKLAS_ID,
                ["_tight huggu_"],
                ["OwO whats this? a dead Lisa..."],
                ["You're not a niklas uwu"]
            )
        );
    }
}

export { NiklasCommand };
