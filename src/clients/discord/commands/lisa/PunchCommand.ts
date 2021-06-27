import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import type { DiscordCommandController } from "../../DiscordCommandController";
import { TYPES } from "../../../../types";

class PunchCommand extends Command {
    private readonly discordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "punch",
            aliases: ["hit"],
            group: "lisa",
            memberName: "punch",
            description: "Punch Lisa.",
        });
        this.discordCommandController = container.get<DiscordCommandController>(
            TYPES.DiscordCommandController
        );
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(
            this.discordCommandController.performAction(
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
