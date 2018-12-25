import { commandFn } from "di-ngy/types/command/commandFn";
import { IDingyCommand } from "di-ngy/types/command/IDingyCommand";
import { Message } from "discord.js";

const INTERESTING_IMAGE_LINK =
    "https://media.giphy.com/media/KKtAZiNVEeU8/giphy.gif";

const interestingFn: commandFn = () => {
    return {
        val: "Interesting.",
        files: [INTERESTING_IMAGE_LINK]
    };
};

const interesting: IDingyCommand = {
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
