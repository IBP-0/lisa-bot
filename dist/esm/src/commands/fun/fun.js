import { clap } from "./clap";
import { interesting } from "./interesting";
import { rate } from "./rate";
import { roast } from "./roast";
import { rpg } from "./rpg";
import { ship } from "./ship";
import { square } from "./square";
const funFn = () => "Respects have been paid.";
// noinspection JSUnusedGlobalSymbols
const fun = {
    fn: funFn,
    args: [],
    alias: ["f"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Misc. fun commands."
    },
    sub: { clap, interesting, rate, roast, rpg, ship, square }
};
export { fun };
//# sourceMappingURL=fun.js.map