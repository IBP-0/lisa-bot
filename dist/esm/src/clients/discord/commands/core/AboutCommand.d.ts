import { Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
declare class AboutCommand extends Command {
    constructor(client: CommandoClient);
    run(message: CommandMessage): Promise<Message | Message[]>;
}
export { AboutCommand };
//# sourceMappingURL=AboutCommand.d.ts.map