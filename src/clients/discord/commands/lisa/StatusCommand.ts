import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import type { DiscordCommandController } from "../../DiscordCommandController";
import { TYPES } from "../../../../types";

class StatusCommand extends Command {
	readonly #discordCommandController: DiscordCommandController;

	constructor(client: CommandoClient) {
		super(client, {
			name: "status",
			aliases: [],
			group: "lisa",
			memberName: "status",
			description: "Shows the status of Lisa.",
		});
		this.#discordCommandController =
			container.get<DiscordCommandController>(
				TYPES.DiscordCommandController
			);
	}

	run(message: CommandoMessage): Promise<Message | Message[]> {
		return message.say(this.#discordCommandController.createStatusText());
	}
}

export { StatusCommand };
