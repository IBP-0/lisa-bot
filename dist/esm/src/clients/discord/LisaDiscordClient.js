import { CommandoClient } from "discord.js-commando";
import { AboutCommand } from "./commands/core/AboutCommand";
import { InviteCommand } from "./commands/core/InviteCommand";
import { ServersCommand } from "./commands/core/ServersCommand";
class LisaDiscordClient {
    constructor(options) {
        this.commandoClient = new CommandoClient(options);
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
        this.commandoClient.registry.registerCommands([
            AboutCommand,
            InviteCommand,
            ServersCommand
        ]);
    }
    async login(token) {
        await this.commandoClient.login(token);
    }
}
export { LisaDiscordClient };
//# sourceMappingURL=LisaDiscordClient.js.map