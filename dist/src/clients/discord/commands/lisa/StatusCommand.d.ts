import { Message } from "discord.js";
import { Command, CommandoMessage, CommandoClient } from "discord.js-commando";
declare class StatusCommand extends Command {
    private readonly lisaDiscordCommandController;
    constructor(client: CommandoClient);
    run(message: CommandoMessage): Promise<Message | Message[]>;
}
export { StatusCommand };
