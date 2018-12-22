import { IDingyCommandObject } from "di-ngy/types/command/IDingyCommandObject";
import { Message } from "discord.js";
import { about } from "./commands/core/about";
import { invite } from "./commands/core/invite";
import { status } from "./commands/lisa/status";
import { water } from "./commands/lisa/water";
import { poll } from "./commands/poll/poll";
import { replant } from "./commands/lisa/replant";
import { punch } from "./commands/lisa/punch";

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
    replant,
    water,
    punch,
    /*
     * Poll
     */
    poll
};

export { COMMANDS };
