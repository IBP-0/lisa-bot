import { DefaultBootstrappings, Injectable } from "chevronjs";
import { Message, PresenceData } from "discord.js";
import { CommandoClient, CommandoClientOptions } from "discord.js-commando";
import { Observable } from "rxjs";
import { chevron } from "../../chevron";
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

const createUninitializedClientError = (): TypeError =>
    new TypeError("Client has not been initialized.");

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: []
})
class LisaDiscordClient {
    private commandoClient: CommandoClient | null;

    constructor() {
        this.commandoClient = null;
    }

    public init(options: CommandoClientOptions): void {
        this.commandoClient = new CommandoClient(options);

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
            ["lisa", "Lisa"]
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
            unknownCommand: false
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
            NiklasCommand
        ]);
    }

    public async login(token: string): Promise<void> {
        if (this.commandoClient == null) {
            throw createUninitializedClientError();
        }
        await this.commandoClient.login(token);
    }

    public async setPresence(data: PresenceData): Promise<void> {
        if (this.commandoClient == null) {
            throw createUninitializedClientError();
        }
        await this.commandoClient.user!.setPresence(data);
    }

    public getMessageObservable(): Observable<Message> {
        if (this.commandoClient == null) {
            throw createUninitializedClientError();
        }
        return new Observable(subscriber => {
            this.commandoClient!.on("message", message => {
                subscriber.next(message);
            });
        });
    }
}

export { LisaDiscordClient };
