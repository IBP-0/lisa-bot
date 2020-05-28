"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplantCommand = void 0;
const discord_js_commando_1 = require("discord.js-commando");
const inversify_config_1 = require("../../../../inversify.config");
const types_1 = require("../../../../types");
class ReplantCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "replant",
            aliases: ["reset", "plant"],
            group: "lisa",
            memberName: "replant",
            description: "Replant Lisa.",
        });
        this.lisaDiscordCommandController = inversify_config_1.container.get(types_1.TYPES.DiscordCommandController);
    }
    run(message) {
        return message.say(this.lisaDiscordCommandController.performReplant(message.author, null, [
            "_Is being ripped out and thrown away while still alive, watching you plant the next Lisa._",
        ], [
            "_Plants new Lisa on top of the remnants of her ancestors._",
            "_Plants the next generation of Lisa._",
        ]));
    }
}
exports.ReplantCommand = ReplantCommand;
//# sourceMappingURL=ReplantCommand.js.map