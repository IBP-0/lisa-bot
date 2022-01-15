import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";
import { container } from "../../../../inversify.config";
import type { DiscordCommandController } from "../../DiscordCommandController";
import { TYPES } from "../../../../types";

const GOAT_IDS = [
	"559544450934767626",
	"672157230795325453",
	"547102998011183114",
	"128985967875850240",
	"273221196001181697",
];

class BaaCommand extends Command {
	readonly #discordCommandController: DiscordCommandController;

	constructor(client: CommandoClient) {
		super(client, {
			name: "baa",
			aliases: [],
			group: "lisa",
			memberName: "baa",
			description: "Baa.",
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
				30,
				GOAT_IDS,
				["Baa", "Baa~", "Baaaaaaa ^w^", ":goat:"],
				["Baa? a dead Lisa..."],
				["You're not a goat uwu"]
			)
		);
	}
}

export { BaaCommand };
