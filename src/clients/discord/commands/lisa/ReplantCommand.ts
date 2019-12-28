import { Message } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { chevron } from "../../../../chevron";
import { LisaDiscordCommandController } from "../../controller/LisaDiscordCommandController";

class ReplantCommand extends Command {
    private readonly lisaDiscordCommandController: LisaDiscordCommandController;

    constructor(client: CommandoClient) {
        super(client, {
            name: "replant",
            aliases: ["reset", "plant"],
            group: "lisa",
            memberName: "replant",
            description: "Replant Lisa."
        });
        this.lisaDiscordCommandController = chevron.getInjectableInstance(
            LisaDiscordCommandController
        );
    }

    run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.say(
            this.lisaDiscordCommandController.performReplant(
                message.author,
                null,
                [
                    "_Is being ripped out and thrown away while still alive, watching you plant the next Lisa._"
                ],
                [
                    "_Plants new Lisa on top of the remnants of her ancestors._",
                    "_Plants the next generation of Lisa._"
                ]
            )
        );
    }
}

export { ReplantCommand };
