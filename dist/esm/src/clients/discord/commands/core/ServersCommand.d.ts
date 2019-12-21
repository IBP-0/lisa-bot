import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
declare class ServersCommand extends Command {
    constructor(client: CommandoClient);
    run(message: CommandMessage): Promise<Message | Message[]>;
    private getServers;
}
export { ServersCommand };
//# sourceMappingURL=ServersCommand.d.ts.map