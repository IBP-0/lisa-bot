import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";
const statusFn = () => {
    const lisaController = lisaChevron.get(LisaController);
    return lisaController.stringifyStatus();
};
const status = {
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
//# sourceMappingURL=status.js.map