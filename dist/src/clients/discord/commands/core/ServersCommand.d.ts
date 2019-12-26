import { Message } from "discord.js";
import { Command, CommandoMessage, CommandoClient } from "discord.js-commando";
declare class ServersCommand extends Command {
    constructor(client: CommandoClient);
    run(message: CommandoMessage): Promise<Message | Message[]>;
    private getServers;
}
export { ServersCommand };
