import { IDingyCommand } from "di-ngy/types/commands/IDingyCommand";

const TEXT = [
    "I'm always happy to join new servers!",
    "If you want me to join your server, follow this link: ",
    "<https://discordapp.com/oauth2/authorize?&client_id=263671526279086092&scope=bot>"
].join("\n");

const invite: IDingyCommand = {
    fn: () => TEXT,
    args: [],
    alias: ["join"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Add Lisa to your server"
    }
};

export { invite };
