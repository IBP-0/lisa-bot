import { resolvedArgumentMap } from "cli-ngy/types/argument/resolvedArgumentMap";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";

const squareText = (str: string): string => {
    /*
     * Use spread rather than .split() to support wide characters
     * https://github.com/mmmpld/lisa-bot/commit/c701cec417d6c53a700b8c038da99bc8e6617e0c
     */
    const word = [...str];
    const wordReversed = Array.from(word).reverse();
    const result = [];

    for (let rowIndex = 0; rowIndex < word.length; rowIndex++) {
        const line = [];

        for (let lineIndex = 0; lineIndex < word.length; lineIndex++) {
            let val;

            if (rowIndex === 0) {
                val = word[lineIndex];
            } else if (rowIndex === word.length - 1) {
                val = wordReversed[lineIndex];
            } else if (lineIndex === 0) {
                val = word[rowIndex];
            } else if (lineIndex === word.length - 1) {
                val = wordReversed[rowIndex];
            } else {
                val = " ";
            }

            line.push(val);
        }

        result.push(line.join(" "));
    }

    return result.join("\n");
};

const squareFn = (args: resolvedArgumentMap) => {
    return {
        val: squareText(args.get("text")!),
        code: true
    };
};

const square: IDingyCommand = {
    fn: squareFn,
    args: [
        {
            name: "text",
            required: true
        }
    ],
    alias: ["squares"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Output a text as a square."
    }
};

export { square };
