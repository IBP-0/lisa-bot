import {
    CommandGroup,
    CommandoClient,
    CommandoClientOptions
} from "discord.js-commando";
import { AboutCommand } from "./commands/core/AboutCommand";
import { InviteCommand } from "./commands/core/InviteCommand";
import { ServersCommand } from "./commands/core/ServersCommand";

class LisaDiscordClient {
    private readonly commandoClient: CommandoClient;

    constructor(options: CommandoClientOptions) {
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
        await this.commandoClient.login(token);
    }
}

export { LisaDiscordClient };
