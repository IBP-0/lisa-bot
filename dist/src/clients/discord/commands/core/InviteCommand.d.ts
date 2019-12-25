import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
declare class InviteCommand extends Command {
    constructor(client: CommandoClient);
    run(message: CommandMessage): Promise<Message | Message[]>;
}
export { InviteCommand };
