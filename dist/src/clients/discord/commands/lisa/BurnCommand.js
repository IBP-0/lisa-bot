"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const inversify_config_1 = require("../../../../inversify.config");
const LisaState_1 = require("../../../../lisa/LisaState");
const types_1 = require("../../../../types");
class BurnCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "burn",
            aliases: ["fire", "killitwithfire"],
            group: "lisa",
            memberName: "burn",
            description: "Burn Lisa (you monster).",
        });
        this.lisaDiscordCommandController = inversify_config_1.container.get(types_1.TYPES.DiscordCommandController);
    }
    run(message) {
        return message.say(this.lisaDiscordCommandController.performKill(message.author, LisaState_1.LisaDeathCause.FIRE, null, [
            "_You hear muffled plant-screams as you set Lisa on fire_",
            "_Lisa looks at you, judging your actions._",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ], ["Lisa is already dead!"]));
    }
}
exports.BurnCommand = BurnCommand;
