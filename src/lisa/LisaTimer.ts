import { DefaultBootstrappings, Injectable } from "chevronjs";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStateController } from "./state/LisaStateController";
import Timer = NodeJS.Timer;

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: [LisaStateController]
})
class LisaTimer {
    private static readonly logger = rootLogger.child({
        service: LisaTimer
    });

    private static readonly TIMEOUT = 60000;
    private static readonly WATER_MODIFIER = -2;
    private static readonly HAPPINESS_MODIFIER = -1;

    private timer: Timer | null;

    constructor(private readonly lisaStateController: LisaStateController) {
        this.timer = null;
    }

    public start(): void {
        this.timer = setInterval(() => this.tick(), LisaTimer.TIMEOUT);
        LisaTimer.logger.info(
            `Started Lisa timer with an interval of ${LisaTimer.TIMEOUT}.`
        );
    }

    private tick(): void {
        LisaTimer.logger.debug(
            `Performing tick.
Water modifier: ${LisaTimer.WATER_MODIFIER}.
Happiness modifier: ${LisaTimer.HAPPINESS_MODIFIER}.`
        );
        this.lisaStateController.setWater(
            this.lisaStateController.getWater() + LisaTimer.WATER_MODIFIER
        );
        this.lisaStateController.setHappiness(
            this.lisaStateController.getHappiness() +
                LisaTimer.HAPPINESS_MODIFIER
        );
    }
}

export { LisaTimer };
