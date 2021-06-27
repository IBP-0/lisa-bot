import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import type { DiscordCommandController } from "../../DiscordCommandController";
import { TYPES } from "../../../../types";

class HugCommand extends Command {
    readonly #discordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "hug",
            aliases: ["huggu"],
            group: "lisa",
            memberName: "hug",
            description: "Hug Lisa.",
        });
        this.#discordCommandController =
            container.get<DiscordCommandController>(
                TYPES.DiscordCommandController
            );
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(
            this.#discordCommandController.performAction(
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
