import { Injectable } from "chevronjs";
import { interval, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { chevron } from "../../chevron";
import { rootLogger } from "../../logger";

interface TickData {
    waterModifier: number;
    happinessModifier: number;
    byUser: string;
}

@Injectable(chevron)
class LisaTickController {
    private static readonly logger = rootLogger.child({
        target: LisaTickController,
    });

    private static readonly TIMEOUT = 60000;
    private static readonly WATER_MODIFIER = -0.5;
    private static readonly HAPPINESS_MODIFIER = -0.75;
    private static readonly USER_TICK = "Time";

    public readonly tickObservable: Observable<TickData>;

    constructor() {
        this.tickObservable = this.createTickObservable();
        LisaTickController.logger.debug(
            `Started Lisa timer with an interval of ${LisaTickController.TIMEOUT}.`
        );
    }

    private createTickObservable(): Observable<TickData> {
        return interval(LisaTickController.TIMEOUT).pipe(
            map(() => {
                LisaTickController.logger.debug("Running tick.");
                return {
                    waterModifier: LisaTickController.WATER_MODIFIER,
                    happinessModifier: LisaTickController.HAPPINESS_MODIFIER,
                    byUser: LisaTickController.USER_TICK,
                };
            })
        );
    }
}

export { LisaTickController };
