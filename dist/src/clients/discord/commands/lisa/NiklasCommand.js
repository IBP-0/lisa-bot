"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const inversify_config_1 = require("../../../../inversify.config");
const types_1 = require("../../../../types");
const NIKLAS_ID = ["178470784984023040"];
class NiklasCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "niklas",
            aliases: [],
            group: "lisa",
            memberName: "niklas",
            description: "^w^",
            hidden: true,
        });
        this.lisaDiscordCommandController = inversify_config_1.container.get(types_1.TYPES.DiscordCommandController);
    }
    run(message) {
        return message.say(this.lisaDiscordCommandController.performAction(message.author, 0, 40, NIKLAS_ID, ["_tight huggu_"], ["OwO whats this? a dead Lisa..."], ["You're not a niklas uwu"]));
    }
}
exports.NiklasCommand = NiklasCommand;
//# sourceMappingURL=NiklasCommand.js.map