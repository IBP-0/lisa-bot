"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const inversify_config_1 = require("../../../../inversify.config");
const types_1 = require("../../../../types");
class WaterCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "water",
            aliases: [],
            group: "lisa",
            memberName: "water",
            description: "Water Lisa.",
        });
        this.lisaDiscordCommandController = inversify_config_1.container.get(types_1.TYPES.DiscordCommandController);
    }
    run(message) {
        return message.say(this.lisaDiscordCommandController.performAction(message.author, 25, 0, null, [
            "_Is being watered_",
            "_Water splashes._",
            "_Watering noises._",
            "_You hear Lisa sucking up the water._",
        ], ["It's too late to water poor Lisa..."]));
    }
}
exports.WaterCommand = WaterCommand;
//# sourceMappingURL=WaterCommand.js.map