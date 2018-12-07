import { Message } from "discord.js";
import * as PromiseQueue from "promise-queue";
import { lisaBotLogby } from "../../../logger";
import { eachOption } from "./eachOption";

const MAX_QUEUE_SIZE = 20;

const logger = lisaBotLogby.getLogger("addReactions");

const addReactions = (
    options: string[],
    icons: string[][],
    msgSent: Message
) => {
    const queue = new PromiseQueue(1, MAX_QUEUE_SIZE);

    eachOption(options, icons, (option, icon) => {
        queue
            .add(() => msgSent.react(icon[1]))
            .catch(e => logger.error("Could not react to message.", e));
    });
};

export { addReactions };
