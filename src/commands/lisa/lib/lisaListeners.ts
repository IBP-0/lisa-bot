import { Dingy } from "di-ngy";
import { lisaChevron } from "../../../di";
import { lisaLogby } from "../../../logger";
import { LisaController } from "./LisaController";

const TICK_INTERVAL = 60000; // 1min

const USERNAME_TICK = "Time";
const USERNAME_ACTIVITY = "Activity";

const logger = lisaLogby.getLogger("LisaListeners");

const initTickInterval = (lisaBot: Dingy): void => {
    const lisaController: LisaController = lisaChevron.get(LisaController);
    const lisaTickFn = (): void => {
        lisaBot.client.user
            .setActivity(lisaController.stringifyStatusShort())
            .catch(err =>
                logger.warn("Could not update currently playing.", err)
            );
        logger.trace("Ran tickInterval updateActivity.");
        lisaController.modify(USERNAME_TICK, -0.5, -0.75);
        logger.trace("Ran tickInterval statDecay.");
    };

    lisaBot.client.setInterval(lisaTickFn, TICK_INTERVAL);
    logger.trace("Initialized tickInterval.");
};

const increaseHappiness = (): void => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    lisaController.modify(USERNAME_ACTIVITY, 0, 0.25);
    logger.trace("Ran onMessage increaseHappiness.");
};

const onConnect = (lisaBot: Dingy): void => {
    logger.trace("Running onConnect.");
    initTickInterval(lisaBot);
};

const onMessage = (): void => {
    logger.trace("Running onMessage.");
    increaseHappiness();
};

export { onConnect, onMessage };
