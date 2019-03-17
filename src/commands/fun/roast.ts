import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";

const roastFn: commandFn = () => {
    return "Respects have been paid.";
};

const roast: IDingyCommand = {
    fn: roastFn,
    args: [
        {
            name: "target",
            required: true
        }
    ],
    alias: ["roasted"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Roast someone."
    }
};

export { roast };
