"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const inversify_config_1 = require("../../../../inversify.config");
const types_1 = require("../../../../types");
class StatusCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "status",
            aliases: [],
            group: "lisa",
            memberName: "status",
            description: "Shows the status of Lisa.",
        });
        this.lisaDiscordCommandController = inversify_config_1.container.get(types_1.TYPES.DiscordCommandController);
    }
    run(message) {
        return message.say(this.lisaDiscordCommandController.createStatusText());
    }
}
exports.StatusCommand = StatusCommand;
//# sourceMappingURL=StatusCommand.js.map