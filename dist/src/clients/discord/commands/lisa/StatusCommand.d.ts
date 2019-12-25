import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
declare class StatusCommand extends Command {
    private readonly lisaStateController;
    private readonly lisaTextService;
    constructor(client: CommandoClient);
    run(message: CommandMessage): Promise<Message | Message[]>;
}
export { StatusCommand };
