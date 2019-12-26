"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const chevron_1 = require("../../../../chevron");
const LisaDiscordCommandController_1 = require("../../LisaDiscordCommandController");
class HugCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "hug",
            aliases: ["huggu"],
            group: "lisa",
            memberName: "hug",
            description: "Hug Lisa."
        });
        this.lisaDiscordCommandController = chevron_1.chevron.getInjectableInstance(LisaDiscordCommandController_1.LisaDiscordCommandController);
    }
    run(message) {
        return message.say(this.lisaDiscordCommandController.performAction(message.author, 0, 20, null, ["_Is hugged_.", "_hug_"], ["It's too late to hug poor Lisa..."]));
    }
}
exports.HugCommand = HugCommand;
