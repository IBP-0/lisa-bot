import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import type { DiscordCommandController } from "../../DiscordCommandController";
import { TYPES } from "../../../../types";

class ReplantCommand extends Command {
    private readonly lisaDiscordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "replant",
            aliases: ["reset", "plant"],
            group: "lisa",
            memberName: "replant",
            description: "Replant Lisa.",
        });
        this.lisaDiscordCommandController = container.get<DiscordCommandController>(
            TYPES.DiscordCommandController
        );
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(
            this.lisaDiscordCommandController.performReplant(
                message.author,
                null,
                [
                    "_Is being ripped out and thrown away while still alive, watching you plant the next Lisa._",
                ],
                [
                    "_Plants new Lisa on top of the remnants of her ancestors._",
                    "_Plants the next generation of Lisa._",
                ]
            )
        );
    }
}

export { ReplantCommand };
