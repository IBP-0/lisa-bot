import { toFullName } from "di-ngy";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";
const MISSY_ID = ["273221196001181697"];
const missyFn = (args, argsAll, msg) => {
    if (!MISSY_ID.includes(msg.author.id)) {
        return "You're not a missy <w<";
    }
    const lisaController = lisaChevron.get(LisaController);
    // noinspection SpellCheckingInspection
    return lisaController.performAction(toFullName(msg.author), 0, 40, ["_Baaaaaaaaaaaaaa_"], ["OwO whats this? a dead Lisa..."]);
};
// noinspection SpellCheckingInspection
const missy = {
    fn: missyFn,
    args: [],
    alias: [],
    data: {
        hidden: true,
        usableInDMs: false,
        powerRequired: 0,
        help: "baaff"
    }
};
export { missy };
//# sourceMappingURL=missy.js.map