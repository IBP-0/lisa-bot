import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import type { DiscordCommandController } from "../../DiscordCommandController";
import { TYPES } from "../../../../types";

const NIKLAS_ID = ["178470784984023040"];

class NiklasCommand extends Command {
    private readonly discordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "niklas",
            aliases: [],
            group: "lisa",
            memberName: "niklas",
            description: "^w^",
            hidden: true,
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
