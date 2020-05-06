"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const inversify_config_1 = require("../../../../inversify.config");
const types_1 = require("../../../../types");
class HugCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "hug",
            aliases: ["huggu"],
            group: "lisa",
            memberName: "hug",
            description: "Hug Lisa.",
        });
        this.lisaDiscordCommandController = inversify_config_1.container.get(types_1.TYPES.DiscordCommandController);
    }
    run(message) {
        return message.say(this.lisaDiscordCommandController.performAction(message.author, 0, 20, null, ["_Is hugged_.", "_hug_"], ["It's too late to hug poor Lisa..."]));
    }
}
exports.HugCommand = HugCommand;
