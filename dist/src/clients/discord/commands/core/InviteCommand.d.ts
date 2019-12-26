import { Message } from "discord.js";
import { Command, CommandoMessage, CommandoClient } from "discord.js-commando";
declare class InviteCommand extends Command {
    constructor(client: CommandoClient);
    run(message: CommandoMessage): Promise<Message | Message[]>;
}
export { InviteCommand };
