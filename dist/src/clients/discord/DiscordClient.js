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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const rxjs_1 = require("rxjs");
const AboutCommand_1 = require("./commands/core/AboutCommand");
const InviteCommand_1 = require("./commands/core/InviteCommand");
const ServersCommand_1 = require("./commands/core/ServersCommand");
const BaaCommand_1 = require("./commands/lisa/BaaCommand");
const BurnCommand_1 = require("./commands/lisa/BurnCommand");
const HugCommand_1 = require("./commands/lisa/HugCommand");
const JokeCommand_1 = require("./commands/lisa/JokeCommand");
const MissyCommand_1 = require("./commands/lisa/MissyCommand");
const NiklasCommand_1 = require("./commands/lisa/NiklasCommand");
const PunchCommand_1 = require("./commands/lisa/PunchCommand");
const ReplantCommand_1 = require("./commands/lisa/ReplantCommand");
const StatusCommand_1 = require("./commands/lisa/StatusCommand");
const WaterCommand_1 = require("./commands/lisa/WaterCommand");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
let DiscordClient = class DiscordClient {
    constructor(discordConfig) {
        this.commandoClient = new discord_js_commando_1.CommandoClient(discordConfig);
        const commandRegistry = this.commandoClient.registry;
        /*
         * Types
         */
        commandRegistry.registerDefaultTypes();
        /*
         * Groups
         */
        commandRegistry.registerGroups([
            ["util", "Utility"],
            ["lisa", "Lisa"],
        ]);
        /*
         * Commands
         */
        commandRegistry.registerDefaultCommands({
            help: true,
            eval: false,
            ping: true,
            prefix: false,
            commandState: false,
            unknownCommand: false,
        });
        commandRegistry.registerCommands([
            AboutCommand_1.AboutCommand,
            InviteCommand_1.InviteCommand,
            ServersCommand_1.ServersCommand,
            StatusCommand_1.StatusCommand,
            ReplantCommand_1.ReplantCommand,
            BurnCommand_1.BurnCommand,
            PunchCommand_1.PunchCommand,
            WaterCommand_1.WaterCommand,
            HugCommand_1.HugCommand,
            JokeCommand_1.JokeCommand,
            BaaCommand_1.BaaCommand,
            MissyCommand_1.MissyCommand,
            NiklasCommand_1.NiklasCommand,
        ]);
    }
    async login(token) {
        await this.commandoClient.login(token);
    }
    async setPresence(data) {
        await this.commandoClient.user.setPresence(data);
    }
    getMessageObservable() {
        return new rxjs_1.Observable((subscriber) => {
            this.commandoClient.on("message", (message) => {
                subscriber.next(message);
            });
        });
    }
};
DiscordClient = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DiscordConfig)),
    __metadata("design:paramtypes", [Object])
], DiscordClient);
exports.DiscordClient = DiscordClient;
