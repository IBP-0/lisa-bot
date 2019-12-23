import { DefaultBootstrappings, Injectable } from "chevronjs";
import {
    CommandGroup,
    CommandoClient,
    CommandoClientOptions
} from "discord.js-commando";
import { chevron } from "../../chevron";
import { AboutCommand } from "./commands/core/AboutCommand";
import { InviteCommand } from "./commands/core/InviteCommand";
import { ServersCommand } from "./commands/core/ServersCommand";

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

        /*
         * Defaults
         */
        this.commandoClient.registry
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
                help: true,
                eval_: false,
                ping: true,
                prefix: false,
                commandState: false
            });

        /*
         * Custom groups
         */
        this.commandoClient.registry.registerGroup(
            new CommandGroup(this.commandoClient, "lisa", "Lisa")
        );

        /*
         * Custom commands
         */
        this.commandoClient.registry.registerCommands([
            AboutCommand,
            InviteCommand,
            ServersCommand
        ]);
    }

    public async login(token: string): Promise<void> {
        if (this.commandoClient == null) {
            throw new TypeError("Client has not been initialized.");
        }
        await this.commandoClient.login(token);
    }

    public getCommandoClient(): CommandoClient {
        if (this.commandoClient == null) {
            throw new TypeError("Client has not been initialized.");
        }
        return this.commandoClient;
    }
}

export { LisaDiscordClient };
