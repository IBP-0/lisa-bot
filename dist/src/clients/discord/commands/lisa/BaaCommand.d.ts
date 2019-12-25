import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
declare class BaaCommand extends Command {
    private readonly lisaDiscordCommandController;
    constructor(client: CommandoClient);
    run(message: CommandMessage): Promise<Message | Message[]>;
}
export { BaaCommand };
