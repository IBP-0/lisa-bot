import type { Message } from "discord.js";
import type { CommandoClient, CommandoMessage } from "discord.js-commando";
import { Command } from "discord.js-commando";

class ServersCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: "servers",
			aliases: [],
			group: "util",
			memberName: "servers",
			description: "Shows the servers the bot is on.",
			ownerOnly: true,
		});
	}

	run(message: CommandoMessage): Promise<Message | Message[]> {
		return message.say(this.#getServers());
	}

	#getServers(): string {
		return this.client.guilds.cache
			.array()
			.map((guild) => `${guild.id}: ${guild.name}`)
			.join("\n");
	}
}

export { ServersCommand };
