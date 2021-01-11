import { Message } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import { DiscordCommandController } from "../../controller/DiscordCommandController";
import { TYPES } from "../../../../types";

class StatusCommand extends Command {
    private readonly lisaDiscordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "status",
            aliases: [],
            group: "lisa",
            memberName: "status",
            description: "Shows the status of Lisa.",
        });
        this.lisaDiscordCommandController = container.get<
            DiscordCommandController
        >(TYPES.DiscordCommandController);
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(
            this.lisaDiscordCommandController.createStatusText()
        );
    }
}

export { StatusCommand };
