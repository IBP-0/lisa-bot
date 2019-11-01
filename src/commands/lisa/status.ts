import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";

const statusFn: CommandFn = () => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    return lisaController.stringifyStatus();
};

const status: DingyCommand = {
    fn: statusFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Shows the status of Lisa."
    }
};

export { status };
