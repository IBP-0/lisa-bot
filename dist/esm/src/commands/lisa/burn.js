import { toFullName } from "di-ngy";
import { lisaChevron } from "../../di";
import { Death } from "./lib/Death";
import { LisaController } from "./lib/LisaController";
const burnFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    // Noinspection SpellCheckingInspection
    return lisaController.performKill(toFullName(msg.author), Death.FIRE, [
        "_You hear muffled plant-screams as you set Lisa on fire_",
        "_Lisa looks at you, judging your actions._",
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    ], ["Lisa is already dead!"]);
};
// Noinspection SpellCheckingInspection
const burn = {
    fn: burnFn,
    args: [],
    alias: ["fire", "killitwithfire"],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Burn Lisa (you monster)."
    }
};
export { burn };
//# sourceMappingURL=burn.js.map