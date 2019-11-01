import { toFullName } from "di-ngy";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";
const punchFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    // noinspection SpellCheckingInspection
    return lisaController.performAction(toFullName(msg.author), 0, -10, ["_Is being punched in the leaves._", "oof.", "ouch ouw owie."], ["The dead feel no pain..."]);
};
const punch = {
    fn: punchFn,
    args: [],
    alias: ["hit"],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Punch Lisa."
    }
};
export { punch };
//# sourceMappingURL=punch.js.map