import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import type { DiscordCommandController } from "../../controller/DiscordCommandController";
import { TYPES } from "../../../../types";

class WaterCommand extends Command {
    private readonly lisaDiscordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "water",
            aliases: [],
            group: "lisa",
            memberName: "water",
            description: "Water Lisa.",
        });
        this.lisaDiscordCommandController = container.get<DiscordCommandController>(
            TYPES.DiscordCommandController
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
                    "_You hear Lisa sucking up the water._",
                ],
                ["It's too late to water poor Lisa..."]
            )
        );
    }
}

export { WaterCommand };
