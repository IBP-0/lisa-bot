import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import { DeathCause } from "../../../../core/state/State";
import type { DiscordCommandController } from "../../DiscordCommandController";
import { TYPES } from "../../../../types";

class BurnCommand extends Command {
    readonly #discordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "burn",
            aliases: ["fire", "killitwithfire"],
            group: "lisa",
            memberName: "burn",
            description: "Burn Lisa (you monster).",
        });
        this.#discordCommandController =
            container.get<DiscordCommandController>(
                TYPES.DiscordCommandController
            );
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(
            this.#discordCommandController.performKill(
                message.author,
                DeathCause.FIRE,
                null,
                [
                    "_You hear muffled plant-screams as you set Lisa on fire_",
                    "_Lisa looks at you, judging your actions._",
                    "AAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                ],
                ["Lisa is already dead!"]
            )
        );
    }
}

export { BurnCommand };
