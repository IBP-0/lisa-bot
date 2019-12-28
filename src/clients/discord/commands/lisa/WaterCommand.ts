import { Message } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { chevron } from "../../../../chevron";
import { DiscordCommandController } from "../../controller/DiscordCommandController";

class WaterCommand extends Command {
    private readonly lisaDiscordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "water",
            aliases: [],
            group: "lisa",
            memberName: "water",
            description: "Water Lisa."
        });
        this.lisaDiscordCommandController = chevron.getInjectableInstance(
            DiscordCommandController
        );
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(
            this.lisaDiscordCommandController.performAction(
                message.author,
                25,
                0,
                null,
                [
                    "_Is being watered_",
                    "_Water splashes._",
                    "_Watering noises._",
                    "_You hear Lisa sucking up the water._"
                ],
                ["It's too late to water poor Lisa..."]
            )
        );
    }
}

export { WaterCommand };
