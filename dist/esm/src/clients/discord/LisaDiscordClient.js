import { CommandoClient } from "discord.js-commando";
import { AboutCommand } from "./commands/core/AboutCommand";
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
        this.commandoClient.registry.registerCommand(AboutCommand);
    }
    async login(token) {
        await this.commandoClient.login(token);
    }
}
export { LisaDiscordClient };
//# sourceMappingURL=LisaDiscordClient.js.map