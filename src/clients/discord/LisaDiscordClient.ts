import { DefaultBootstrappings, Injectable } from "chevronjs";
import { Message, PresenceData } from "discord.js";
import {
    CommandGroup,
    CommandoClient,
    CommandoClientOptions
} from "discord.js-commando";
import { Observable } from "rxjs";
import { chevron } from "../../chevron";
import { AboutCommand } from "./commands/core/AboutCommand";
import { InviteCommand } from "./commands/core/InviteCommand";
import { ServersCommand } from "./commands/core/ServersCommand";

const createUninitializedClientError = (): TypeError =>
    new TypeError("Client has not been initialized.");

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: []
})
class LisaDiscordClient {
    private commandoClient: CommandoClient | null;

    constructor() {
        this.commandoClient = null;
    }

    public init(options: CommandoClientOptions): void {
        this.commandoClient = new CommandoClient(options);

        /*
         * Defaults
         */
        this.commandoClient.registry
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
                help: true,
                eval_: false,
                ping: true,
                prefix: false,
                commandState: false
            });

        /*
         * Custom groups
         */
        this.commandoClient.registry.registerGroup(
            new CommandGroup(this.commandoClient, "lisa", "Lisa")
        );

        /*
         * Custom commands
         */
        this.commandoClient.registry.registerCommands([
            AboutCommand,
            InviteCommand,
            ServersCommand
        ]);
    }

    public async login(token: string): Promise<void> {
        if (this.commandoClient == null) {
            throw createUninitializedClientError();
        }
        await this.commandoClient.login(token);
    }

    public async setPresence(data: PresenceData): Promise<void> {
        if (this.commandoClient == null) {
            throw createUninitializedClientError();
        }
        await this.commandoClient.user.setPresence(data);
    }

    public getMessageObservable(): Observable<Message> {
        if (this.commandoClient == null) {
            throw createUninitializedClientError();
        }
        return new Observable(subscriber => {
            this.commandoClient!.on("message", message => {
                subscriber.next(message);
            });
        });
    }
}

export { LisaDiscordClient };
