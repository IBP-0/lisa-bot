import { toFullName } from "di-ngy";
import { isNil } from "lightdash";
import { calcNumberFromUniqueString, calcUniqueString, calcUserUniqueString } from "./lib/calcUnique";
const rateFn = (args, argsAll, msg) => {
    let targetName;
    let rating;
    const target = args.get("target");
    if (!isNil(target)) {
        targetName = target;
        rating = calcNumberFromUniqueString(calcUniqueString(targetName), 10);
    }
    else {
        targetName = toFullName(msg.author);
        rating = calcNumberFromUniqueString(calcUserUniqueString(msg.author), 10);
    }
    return `I rate ${targetName} a ${rating}/10`;
};
const rate = {
    fn: rateFn,
    args: [
        {
            name: "target",
            required: false
        }
    ],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Rates something from 1 to 10."
    }
};
export { rate };
//# sourceMappingURL=rate.js.map