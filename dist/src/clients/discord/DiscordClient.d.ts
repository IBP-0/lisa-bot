import { Message, PresenceData } from "discord.js";
import { CommandoClientOptions } from "discord.js-commando";
import { Observable } from "rxjs";
declare class DiscordClient {
    private readonly commandoClient;
    constructor(options: CommandoClientOptions);
    login(token: string): Promise<void>;
    setPresence(data: PresenceData): Promise<void>;
    getMessageObservable(): Observable<Message>;
}
export { DiscordClient };
