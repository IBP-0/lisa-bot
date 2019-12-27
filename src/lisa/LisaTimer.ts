import { Injectable } from "chevronjs";
import { interval } from "rxjs";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStateController } from "./LisaStateController";
import Timer = NodeJS.Timer;

@Injectable(chevron, {
    dependencies: [LisaStateController]
})
class LisaTimer {
    private static readonly logger = rootLogger.child({
        target: LisaTimer
    });

    private static readonly TIMEOUT = 60000;
    private static readonly WATER_MODIFIER = -0.5;
    private static readonly HAPPINESS_MODIFIER = -0.75;
    private static readonly USER_TICK = "Time";

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

        this.lisaStateController.modifyLisaStatus(
            LisaTimer.WATER_MODIFIER,
            LisaTimer.HAPPINESS_MODIFIER,
            LisaTimer.USER_TICK
        );
    }
}

export { LisaTimer };
