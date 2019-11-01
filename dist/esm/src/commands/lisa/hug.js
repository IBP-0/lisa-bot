import { toFullName } from "di-ngy";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";
const hugFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    // noinspection SpellCheckingInspection
    return lisaController.performAction(toFullName(msg.author), 0, 20, ["_Is hugged_.", "_hug_"], ["It's too late to hug poor Lisa..."]);
};
// noinspection SpellCheckingInspection
const hug = {
    fn: hugFn,
    args: [],
    alias: ["huggu"],
    data: {
        hidden: true,
        usableInDMs: false,
        powerRequired: 0,
        help: "Hug Lisa."
    }
};
export { hug };
//# sourceMappingURL=hug.js.map