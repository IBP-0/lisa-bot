import { Dingy } from "di-ngy";
import { lisaChevron } from "../../../di";
import { lisaLogby } from "../../../logger";
import { LisaController } from "./LisaController";

const TICK_INTERVAL = 60000; // 1min

const USERNAME_TICK = "Time";
const USERNAME_ACTIVITY = "Activity";

const logger = lisaLogby.getLogger("LisaListeners");

const initTickInterval = (lisaBot: Dingy) => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    lisaBot.client.setInterval(() => {
        lisaController.modify(USERNAME_TICK, -0.5, -0.75);

        lisaBot.client.user
            .setGame(lisaController.stringifyStatusShort())
            .catch(err =>
                logger.warn("Could not update currently playing.", err)
            );
    }, TICK_INTERVAL);
};

const increaseHappiness = () => {
    const lisaController: LisaController = lisaChevron.get(LisaController);

    lisaController.modify(USERNAME_ACTIVITY, 0, 0.25);
};

const onConnect = (lisaBot: Dingy) => {
    logger.trace("Running onConnect.");
    initTickInterval(lisaBot);
};

const onMessage = () => {
    logger.trace("Running onMessage.");
    increaseHappiness();
};

export { onConnect, onMessage };
