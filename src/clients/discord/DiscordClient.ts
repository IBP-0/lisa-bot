import type { Message, PresenceData } from "discord.js";
import type { CommandoClientOptions } from "discord.js-commando";
import { CommandoClient, SQLiteProvider } from "discord.js-commando";
import { Observable } from "rxjs";
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
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import type { PersistenceProvider } from "../../core/PersistenceProvider";
import { rootLogger } from "../../logger";

@injectable()
class DiscordClient {
    private static readonly logger = rootLogger.child({
        target: DiscordClient,
    });

    private readonly commandoClient: CommandoClient;
    private readonly persistenceProvider: PersistenceProvider;

    constructor(
        @inject(TYPES.DiscordConfig) discordConfig: CommandoClientOptions,
        @inject(TYPES.PersistenceProvider)
        persistenceProvider: PersistenceProvider
    ) {
        this.persistenceProvider = persistenceProvider;
        this.commandoClient = new CommandoClient(discordConfig);
    }

    public init(): void {
        this.commandoClient
            .setProvider(new SQLiteProvider(this.persistenceProvider.getDb()!))
            .catch((e) =>
                DiscordClient.logger.error(
                    "Could not bind storage provider.",
                    e
                )
            );

        /*
         * Types
         */
        this.commandoClient.registry.registerDefaultTypes();

        /*
         * Groups
         */
        this.commandoClient.registry.registerGroups([
            ["util", "Utility"],
            ["lisa", "Lisa"],
        ]);

        /*
         * Commands
         */
        this.commandoClient.registry.registerDefaultCommands({
            help: true,
            eval: false,
            ping: true,
            prefix: false,
            commandState: false,
            unknownCommand: false,
        });
        this.commandoClient.registry.registerCommands([
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
    }

    public async login(token: string): Promise<void> {
        await this.commandoClient.login(token);
    }

    public async setPresence(data: PresenceData): Promise<void> {
        await this.commandoClient.user!.setPresence(data);
    }

    public getMessageObservable(): Observable<Message> {
        return new Observable((subscriber) => {
            this.commandoClient.on("message", (message) => {
                subscriber.next(message);
            });
        });
    }
}

export { DiscordClient };
