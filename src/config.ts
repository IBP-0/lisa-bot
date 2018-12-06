import { DEFAULT_ROLE } from "di-ngy";
import { Message } from "discord.js";

const ADMIN_ROLE = {
    check: (msg: Message) => msg.author.id === "128985967875850240",
    power: 999
};

const createConfig = (prefix: string) => {
    return {
        prefix,

        roles: [DEFAULT_ROLE, ADMIN_ROLE],

        answerToMissingCommand: false,
        answerToMissingArgs: true,
        answerToMissingPerms: true
    };
};

export { createConfig };
