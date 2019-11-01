import { ResolvedArgumentMap } from "cli-ngy/dist/esm/src/argument/ResolvedArgumentMap";
import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
import { calcNumberFromUniqueString, calcUniqueString } from "./lib/calcUnique";

const getMiddleIndex = (str: string): number => Math.round(str.length / 2);

const shipFn: CommandFn = (args: ResolvedArgumentMap) => {
    const person1 = args.get("person1")!;
    const person2 = args.get("person2")!;

    const shipName =
        person1.substr(0, getMiddleIndex(person1)) +
        person2.substr(getMiddleIndex(person2));

    const person1Score = calcNumberFromUniqueString(
        calcUniqueString(person1),
        10
    );
    const person2Score = calcNumberFromUniqueString(
        calcUniqueString(person2),
        10
    );
    const scoreTotal = person1Score * person2Score;

    return {
        val: [
            "Shipping Complete:",
            "---",
            `${person1} + ${person2} (Ship name: ${shipName})`,
            `Score: ${scoreTotal}%`
        ].join("\n"),
        code: true
    };
};

const ship: DingyCommand = {
    fn: shipFn,
    args: [
        {
            name: "person1",
            required: true
        },
        {
            name: "person2",
            required: false
        }
    ],
    alias: ["fuse"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Ships two people."
    }
};

export { ship };
