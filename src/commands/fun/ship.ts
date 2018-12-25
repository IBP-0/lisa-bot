import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";

const shipFn: commandFn = () => {
    return "Respects have been paid.";
};

const ship: IDingyCommand = {
    fn: shipFn,
    args: [
        {
            name: "person1",
            required: true
        },
        {
            name: "person2",
            required: false
        }
    ],
    alias: ["fuse"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Ships two people."
    }
};

export { ship };
