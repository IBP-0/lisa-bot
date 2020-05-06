import { Message, PresenceData } from "discord.js";
import { CommandoClient, CommandoClientOptions } from "discord.js-commando";
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

@injectable()
class DiscordClient {
    private readonly commandoClient: CommandoClient;

    constructor(
        @inject(TYPES.DiscordConfig) discordConfig: CommandoClientOptions
    ) {
        this.commandoClient = new CommandoClient(discordConfig);

        const commandRegistry = this.commandoClient.registry;

        /*
         * Types
         */
        commandRegistry.registerDefaultTypes();

        /*
         * Groups
         */
        commandRegistry.registerGroups([
            ["util", "Utility"],
            ["lisa", "Lisa"],
        ]);

        /*
         * Commands
         */
        commandRegistry.registerDefaultCommands({
            help: true,
            eval: false,
            ping: true,
            prefix: false,
            commandState: false,
            unknownCommand: false,
        });
        commandRegistry.registerCommands([
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
