const serversFn = (args, argsAll, msg, dingy) => {
    return {
        val: dingy.client.guilds
            .array()
            .map(guild => `${guild.id}: ${guild.name}`)
            .join("\n"),
        code: true
    };
};
const servers = {
    fn: serversFn,
    args: [],
    alias: [],
    data: {
        hidden: true,
        usableInDMs: true,
        powerRequired: 10,
        help: "Shows the servers the bot is on."
    }
};
export { servers };
//# sourceMappingURL=servers.js.map