import { Message } from "discord.js";
import { about } from "./commands/core/about";
import { invite } from "./commands/core/invite";

const COMMANDS = {
    /*
     * Core
     */
    about,
    invite
};

export { COMMANDS };
