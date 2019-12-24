var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DefaultBootstrappings, Injectable } from "chevronjs";
import { CommandGroup, CommandoClient } from "discord.js-commando";
import { Observable } from "rxjs";
import { chevron } from "../../chevron";
import { AboutCommand } from "./commands/core/AboutCommand";
import { InviteCommand } from "./commands/core/InviteCommand";
import { ServersCommand } from "./commands/core/ServersCommand";
function createUninitializedClientError() {
    return new TypeError("Client has not been initialized.");
}
let LisaDiscordClient = class LisaDiscordClient {
    constructor() {
        this.commandoClient = null;
    }
    init(options) {
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
        this.commandoClient.registry.registerGroup(new CommandGroup(this.commandoClient, "lisa", "Lisa"));
        /*
         * Custom commands
         */
        this.commandoClient.registry.registerCommands([
            AboutCommand,
            InviteCommand,
            ServersCommand
        ]);
    }
    async login(token) {
        if (this.commandoClient == null) {
            throw createUninitializedClientError();
        }
        await this.commandoClient.login(token);
    }
    async setPresence(data) {
        if (this.commandoClient == null) {
            throw createUninitializedClientError();
        }
        await this.commandoClient.user.setPresence(data);
    }
    getMessageObservable() {
        if (this.commandoClient == null) {
            throw createUninitializedClientError();
        }
        return new Observable(subscriber => {
            this.commandoClient.on("message", message => subscriber.next(message));
        });
    }
};
LisaDiscordClient = __decorate([
    Injectable(chevron, {
        bootstrapping: DefaultBootstrappings.CLASS,
        dependencies: []
    }),
    __metadata("design:paramtypes", [])
], LisaDiscordClient);
export { LisaDiscordClient };
//# sourceMappingURL=LisaDiscordClient.js.map