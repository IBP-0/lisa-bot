import { CommandoClient, CommandoClientOptions } from "discord.js-commando";
declare class LisaDiscordClient {
    private commandoClient;
    constructor();
    init(options: CommandoClientOptions): void;
    login(token: string): Promise<void>;
    getCommandoClient(): CommandoClient;
}
export { LisaDiscordClient };
//# sourceMappingURL=LisaDiscordClient.d.ts.map