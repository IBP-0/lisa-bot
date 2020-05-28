"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PunchCommand = void 0;
const discord_js_commando_1 = require("discord.js-commando");
const inversify_config_1 = require("../../../../inversify.config");
const types_1 = require("../../../../types");
class PunchCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "punch",
            aliases: ["hit"],
            group: "lisa",
            memberName: "punch",
            description: "Punch Lisa.",
        });
        this.lisaDiscordCommandController = inversify_config_1.container.get(types_1.TYPES.DiscordCommandController);
    }
    run(message) {
        return message.say(this.lisaDiscordCommandController.performAction(message.author, 0, -10, null, ["_Is being punched in the leaves._", "oof.", "ouch ouw owie."], ["The dead feel no pain..."]));
    }
}
exports.PunchCommand = PunchCommand;
//# sourceMappingURL=PunchCommand.js.map