import { Message } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { chevron } from "../../../../chevron";
import { DiscordCommandController } from "../../controller/DiscordCommandController";

class PunchCommand extends Command {
    private readonly lisaDiscordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "punch",
            aliases: ["hit"],
            group: "lisa",
            memberName: "punch",
            description: "Punch Lisa."
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
                -10,
                null,
                ["_Is being punched in the leaves._", "oof.", "ouch ouw owie."],
                ["The dead feel no pain..."]
            )
        );
    }
}

export { PunchCommand };
