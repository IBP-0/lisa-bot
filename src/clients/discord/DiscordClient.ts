import type { Message, PresenceData } from "discord.js";
import {
	CommandoClient,
	CommandoClientOptions,
	SQLiteProvider,
} from "discord.js-commando";
import { inject, injectable } from "inversify";

import { Observable } from "rxjs";
import { PersistenceProvider } from "../../core/PersistenceProvider";
import { rootLogger } from "../../logger";
import { TYPES } from "../../types";
import { AboutCommand } from "./commands/core/AboutCommand";
import { InviteCommand } from "./commands/core/InviteCommand";
import { ServersCommand } from "./commands/core/ServersCommand";
import { BaaCommand } from "./commands/lisa/BaaCommand";
import { BurnCommand } from "./commands/lisa/BurnCommand";
import { HugCommand } from "./commands/lisa/HugCommand";
import { JokeCommand } from "./commands/lisa/JokeCommand";
import { MissyCommand } from "./commands/lisa/MissyCommand";
import { NiklasCommand } from "./commands/lisa/NiklasCommand";
import { PunchCommand } from "./commands/lisa/PunchCommand";
import { ReplantCommand } from "./commands/lisa/ReplantCommand";
import { StatusCommand } from "./commands/lisa/StatusCommand";
import { WaterCommand } from "./commands/lisa/WaterCommand";

@injectable()
class DiscordClient {
	private static readonly logger = rootLogger.child({
		target: DiscordClient,
	});

	readonly #commandoClient: CommandoClient;
	readonly #persistenceProvider: PersistenceProvider;

	constructor(
		@inject(TYPES.DiscordConfig) discordConfig: CommandoClientOptions,
		@inject(TYPES.PersistenceProvider)
		persistenceProvider: PersistenceProvider
	) {
		this.#persistenceProvider = persistenceProvider;
		this.#commandoClient = new CommandoClient(discordConfig);
	}

	init(): void {
		this.#commandoClient
			.setProvider(new SQLiteProvider(this.#persistenceProvider.getDb()!))
			.catch((e) =>
				DiscordClient.logger.error(
					"Could not bind storage provider.",
					e
				)
			);

		/*
		 * Types
		 */
		this.#commandoClient.registry.registerDefaultTypes();

		/*
		 * Groups
		 */
		this.#commandoClient.registry.registerDefaultGroups();
		this.#commandoClient.registry.registerGroup("lisa", "Lisa");

		/*
		 * Commands
		 */
		this.#commandoClient.registry.registerDefaultCommands({
			help: true,
			eval: false,
			ping: true,
			prefix: true,
			commandState: false,
			unknownCommand: false,
		});
		this.#commandoClient.registry.registerCommands([
			AboutCommand,
			InviteCommand,
			ServersCommand,

			StatusCommand,
			ReplantCommand,
			BurnCommand,

			PunchCommand,
			WaterCommand,
			HugCommand,
			JokeCommand,

			BaaCommand,
			MissyCommand,
			NiklasCommand,
		]);

		this.#commandoClient.on("error", (err) =>
			DiscordClient.logger.error(
				`An unhandled error occurred: '${JSON.stringify(
					err
				)}'. Attempting to continue.`
			)
		);
	}

	async login(token: string): Promise<void> {
		await this.#commandoClient.login(token);
	}

	async setPresence(data: PresenceData): Promise<void> {
		await this.#commandoClient.user!.setPresence(data);
	}

	getMessageObservable(): Observable<Message> {
		return new Observable((subscriber) => {
			this.#commandoClient.on("message", (message) => {
				subscriber.next(message);
			});
		});
	}
}

export { DiscordClient };
