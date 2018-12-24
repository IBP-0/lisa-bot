import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const statusFn: commandFn = () => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    return lisaController.stringifyStatus();
};

const status: IDingyCommand = {
    fn: statusFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Shows Lisa's status."
    }
};

export { status };
