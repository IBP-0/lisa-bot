import { Message, PresenceData } from "discord.js";
import { CommandoClientOptions } from "discord.js-commando";
import { Observable } from "rxjs";
declare class LisaDiscordClient {
    private commandoClient;
    constructor();
    init(options: CommandoClientOptions): void;
    login(token: string): Promise<void>;
    setPresence(data: PresenceData): Promise<void>;
    getMessageObservable(): Observable<Message>;
}
export { LisaDiscordClient };
//# sourceMappingURL=LisaDiscordClient.d.ts.map