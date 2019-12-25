"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const chevron_1 = require("../../../../chevron");
const LisaStateController_1 = require("../../../../lisa/LisaStateController");
const LisaTextService_1 = require("../../../../lisa/service/LisaTextService");
class StatusCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "status",
            aliases: [],
            group: "lisa",
            memberName: "status",
            description: "Shows the status of Lisa."
        });
        this.lisaStateController = chevron_1.chevron.getInjectableInstance(LisaStateController_1.LisaStateController);
        this.lisaTextService = chevron_1.chevron.getInjectableInstance(LisaTextService_1.LisaTextService);
    }
    run(message) {
        return message.say(this.lisaTextService.createStatusText(this.lisaStateController.getStateCopy()));
    }
}
exports.StatusCommand = StatusCommand;
