import { CommandoClientOptions } from "discord.js-commando";
declare class LisaDiscordClient {
    private readonly commandoClient;
    constructor(options: CommandoClientOptions);
    login(token: string): Promise<void>;
}
export { LisaDiscordClient };
//# sourceMappingURL=LisaDiscordClient.d.ts.map