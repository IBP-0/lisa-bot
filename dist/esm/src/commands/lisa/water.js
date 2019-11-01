import { toFullName } from "di-ngy";
import { lisaChevron } from "../../di";
import { LisaController } from "./lib/LisaController";
const waterFn = (args, argsAll, msg) => {
    const lisaController = lisaChevron.get(LisaController);
    return lisaController.performAction(toFullName(msg.author), 25, 0, [
        "_Is being watered_",
        "_Water splashes._",
        "_Watering noises._",
        "You hear Lisa sucking up the water."
    ], ["It's too late to water poor Lisa..."]);
};
const water = {
    fn: waterFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: false,
        powerRequired: 0,
        help: "Water Lisa."
    }
};
export { water };
//# sourceMappingURL=water.js.map