import { DefaultBootstrappings, Injectable } from "chevronjs";
import { interval } from "rxjs";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStateController } from "./LisaStateController";
import Timer = NodeJS.Timer;

const USER_TICK = "Time";

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: [LisaStateController]
})
class LisaTimer {
    private static readonly logger = rootLogger.child({
        target: LisaTimer
    });

    private static readonly TIMEOUT = 60000;
    private static readonly WATER_MODIFIER = -0.5;
    private static readonly HAPPINESS_MODIFIER = -0.75;

    private timer: Timer | null;

    constructor(private readonly lisaStateController: LisaStateController) {
        this.timer = null;
    }

    public start(): void {
        interval(LisaTimer.TIMEOUT).subscribe(() => this.tick());
        LisaTimer.logger.info(
            `Started Lisa timer with an interval of ${LisaTimer.TIMEOUT}.`
        );
    }

    private tick(): void {
        LisaTimer.logger.debug("Performing tick.");

        const newWater =
            this.lisaStateController.getStateCopy().status.water +
            LisaTimer.WATER_MODIFIER;
        const newHappiness =
            this.lisaStateController.getStateCopy().status.happiness +
            LisaTimer.HAPPINESS_MODIFIER;

        this.lisaStateController.setWater(newWater, USER_TICK);
        this.lisaStateController.setHappiness(newHappiness, USER_TICK);
    }
}

export { LisaTimer };
