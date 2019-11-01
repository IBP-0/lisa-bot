import { DEFAULT_ROLE } from "di-ngy";
const ADMIN_ID = "128985967875850240";
const ADMIN_ROLE = {
    check: (msg) => msg.author.id === ADMIN_ID,
    power: 999
};
const createConfig = (prefix) => {
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
//# sourceMappingURL=config.js.map