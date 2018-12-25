import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";

const squareFn: commandFn = () => {
    return "Respects have been paid.";
};

const square: IDingyCommand = {
    fn: squareFn,
    args: [
        {
            name: "text",
            required: true
        }
    ],
    alias: ["squares"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Output a text as a square."
    }
};

export { square };
