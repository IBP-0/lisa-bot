import { lisaChevron } from "../../../di";
import { lisaBotLogby } from "../../../logger";
import { LisaController } from "./LisaController";

const TICK_INTERVAL = 5000;

const logger = lisaBotLogby.getLogger("LisaListeners");

const initTickInterval = () => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    setInterval(() => {
        lisaController.modify("Time", -1, -1);
    }, TICK_INTERVAL);
};

const increaseHappiness = () => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    lisaController.modify("Activity", 0, 0.1);
};

const onConnect = () => {
    logger.trace("Running onConnect.");
    initTickInterval();
};

const onMessage = () => {
    logger.trace("Running onMessage.");
    increaseHappiness();
};

export { onConnect, onMessage };
