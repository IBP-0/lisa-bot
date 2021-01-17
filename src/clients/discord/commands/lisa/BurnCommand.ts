import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import { LisaDeathCause } from "../../../../core/state/LisaState";
import type { DiscordCommandController } from "../../controller/DiscordCommandController";
import { TYPES } from "../../../../types";

class BurnCommand extends Command {
    private readonly lisaDiscordCommandController: DiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "burn",
            aliases: ["fire", "killitwithfire"],
            group: "lisa",
            memberName: "burn",
            description: "Burn Lisa (you monster).",
        });
        this.lisaDiscordCommandController = container.get<DiscordCommandController>(
            TYPES.DiscordCommandController
        );
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(
            this.lisaDiscordCommandController.performKill(
                message.author,
                LisaDeathCause.FIRE,
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
