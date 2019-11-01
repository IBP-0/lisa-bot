import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
const roastFn: CommandFn = () => {
    return "Respects have been paid.";
};

const roast: DingyCommand = {
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
