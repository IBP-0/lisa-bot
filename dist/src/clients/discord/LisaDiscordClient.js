"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const chevronjs_1 = require("chevronjs");
const discord_js_commando_1 = require("discord.js-commando");
const rxjs_1 = require("rxjs");
const chevron_1 = require("../../chevron");
const AboutCommand_1 = require("./commands/core/AboutCommand");
const InviteCommand_1 = require("./commands/core/InviteCommand");
const ServersCommand_1 = require("./commands/core/ServersCommand");
const createUninitializedClientError = () => new TypeError("Client has not been initialized.");
let LisaDiscordClient = class LisaDiscordClient {
    constructor() {
        this.commandoClient = null;
    }
    init(options) {
        this.commandoClient = new discord_js_commando_1.CommandoClient(options);
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
        this.commandoClient.registry.registerGroup(new discord_js_commando_1.CommandGroup(this.commandoClient, "lisa", "Lisa"));
        /*
         * Custom commands
         */
        this.commandoClient.registry.registerCommands([
            AboutCommand_1.AboutCommand,
            InviteCommand_1.InviteCommand,
            ServersCommand_1.ServersCommand
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
        return new rxjs_1.Observable(subscriber => {
            this.commandoClient.on("message", message => {
                subscriber.next(message);
            });
        });
    }
};
LisaDiscordClient = __decorate([
    chevronjs_1.Injectable(chevron_1.chevron, {
        bootstrapping: chevronjs_1.DefaultBootstrappings.CLASS,
        dependencies: []
    }),
    __metadata("design:paramtypes", [])
], LisaDiscordClient);
exports.LisaDiscordClient = LisaDiscordClient;
