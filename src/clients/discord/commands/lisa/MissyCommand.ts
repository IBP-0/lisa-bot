import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import type { DiscordCommandController } from "../../DiscordCommandController";
import { TYPES } from "../../../../types";

const MISSY_ID = ["273221196001181697"];

class MissyCommand extends Command {
	readonly #discordCommandController: DiscordCommandController;

	constructor(client: CommandoClient) {
		super(client, {
			name: "missy",
			aliases: [],
			group: "lisa",
			memberName: "missy",
			description: "baaff",
			hidden: true,
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
				40,
				MISSY_ID,
				["_Baaaaaaaaaaaaaa_"],
				["OwO whats this? a dead Lisa..."],
				["You're not a missy <w<"]
			)
		);
	}
}

export { MissyCommand };
