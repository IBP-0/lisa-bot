import { IDingyCommandObject } from "di-ngy/types/command/IDingyCommandObject";
import { Message } from "discord.js";
import { about } from "./commands/core/about";
import { invite } from "./commands/core/invite";
import { status } from "./commands/lisa/status";
import { water } from "./commands/lisa/water";
import { poll } from "./commands/poll/poll";

const COMMANDS: IDingyCommandObject = {
    /*
     * Core
     */
    about,
    invite,
    /*
     * Lisa
     */
    status,
    water,
    /*
     * Poll
     */
    poll
};

export { COMMANDS };
