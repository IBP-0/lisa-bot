import { DEFAULT_ROLE } from "di-ngy";
import { IRole } from "di-ngy/types/role/IRole";
import { Message } from "discord.js";

const ADMIN_ID = "128985967875850240";
const ADMIN_ROLE: IRole = {
    check: (msg: Message) => msg.author.id === ADMIN_ID,
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
