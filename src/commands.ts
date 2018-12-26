import { IDingyCommandObject } from "di-ngy/types/command/IDingyCommandObject";
import { Message } from "discord.js";
import { about } from "./commands/core/about";
import { invite } from "./commands/core/invite";
import { baa } from "./commands/lisa/baa";
import { burn } from "./commands/lisa/burn";
import { hug } from "./commands/lisa/hug";
import { joke } from "./commands/lisa/joke";
import { missy } from "./commands/lisa/missy";
import { niklas } from "./commands/lisa/niklas";
import { punch } from "./commands/lisa/punch";
import { replant } from "./commands/lisa/replant";
import { status } from "./commands/lisa/status";
import { water } from "./commands/lisa/water";
import { poll } from "./commands/poll/poll";
import { fun } from "./commands/fun/fun";
import { servers } from "./commands/core/servers";

const COMMANDS: IDingyCommandObject = {
    /*
     * Core
     */
    about,
    invite,
    servers,
    /*
     * Lisa
     */
    status,
    replant,
    water,
    punch,
    burn,
    hug,
    joke,
    baa,
    niklas,
    missy,
    /*
     * Fun
     */
    fun,
    /*
     * Poll
     */
    poll
};

export { COMMANDS };
