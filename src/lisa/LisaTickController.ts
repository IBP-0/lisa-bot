import { Injectable } from "chevronjs";
import { interval } from "rxjs";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStateController } from "./LisaStateController";
import Timer = NodeJS.Timer;

@Injectable(chevron, {
    dependencies: [LisaStateController]
})
class LisaTickController {
    private static readonly logger = rootLogger.child({
        target: LisaTickController
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
        interval(LisaTickController.TIMEOUT).subscribe(() => this.tick());
        LisaTickController.logger.info(
            `Started Lisa timer with an interval of ${LisaTickController.TIMEOUT}.`
        );
    }

    private tick(): void {
        LisaTickController.logger.debug("Performing tick.");

        this.lisaStateController.modifyLisaStatus(
            LisaTickController.WATER_MODIFIER,
            LisaTickController.HAPPINESS_MODIFIER,
            LisaTickController.USER_TICK
        );
    }
}

export { LisaTickController };
