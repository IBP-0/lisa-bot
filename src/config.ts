import { DEFAULT_ROLE } from "di-ngy";
import { Role } from "di-ngy/dist/esm/src/role/Role";
import { Message } from "discord.js";

const ADMIN_ID = "128985967875850240";

const ADMIN_ROLE: Role = {
    check: (msg: Message) => msg.author.id === ADMIN_ID,
    power: 999
};

const createConfig = (prefix: string) => {
    // noinspection JSUnusedGlobalSymbols
    return {
        prefix,

        roles: [DEFAULT_ROLE, ADMIN_ROLE],

        answerToMissingCommand: false,
        answerToMissingArgs: true,
        answerToMissingPerms: true
    };
};

export { createConfig };
