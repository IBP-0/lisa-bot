import { lisaBotLogby } from "./logger";

const logger = lisaBotLogby.getLogger("LisaListeners");

const onConnect = () => {
    logger.trace("Running onConnect.");
};

const onMessage = () => {
    logger.trace("Running onMessage.");
};

export { onConnect, onMessage };
