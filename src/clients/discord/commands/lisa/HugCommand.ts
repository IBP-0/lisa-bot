import { Message } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { chevron } from "../../../../chevron";
import { DiscordCommandController } from "../../controller/DiscordCommandController";

class HugCommand extends Command {
    private readonly lisaDiscordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "hug",
            aliases: ["huggu"],
            group: "lisa",
            memberName: "hug",
            description: "Hug Lisa.",
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
                20,
                null,
                ["_Is hugged_.", "_hug_"],
                ["It's too late to hug poor Lisa..."]
            )
        );
    }
}

export { HugCommand };
