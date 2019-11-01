import { CommandFn } from "di-ngy/dist/esm/src/command/CommandFn";
import { DingyCommand } from "di-ngy/dist/esm/src/command/DingyCommand";
const INTERESTING_IMAGE_LINK =
    "https://media.giphy.com/media/KKtAZiNVEeU8/giphy.gif";

const interestingFn: CommandFn = () => {
    return {
        val: "Interesting.",
        files: [INTERESTING_IMAGE_LINK]
    };
};

const interesting: DingyCommand = {
    fn: interestingFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Declare something as interesting."
    }
};

export { interesting };
