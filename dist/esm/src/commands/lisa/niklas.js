import { toFullName } from "di-ngy";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";
const NIKLAS_ID = ["178470784984023040"];
const niklasFn = (args, argsAll, msg) => {
    if (!NIKLAS_ID.includes(msg.author.id)) {
        return "You're not a niklas uwu";
    }
    const lisaController = lisaChevron.get(LisaController);
    // noinspection SpellCheckingInspection
    return lisaController.performAction(toFullName(msg.author), 0, 40, ["_tight huggu_"], ["OwO whats this? a dead Lisa..."]);
};
const niklas = {
    fn: niklasFn,
    args: [],
    alias: [],
    data: {
        hidden: true,
        usableInDMs: false,
        powerRequired: 0,
        help: "^w^"
    }
};
export { niklas };
//# sourceMappingURL=niklas.js.map