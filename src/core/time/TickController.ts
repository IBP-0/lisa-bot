import type { Observable } from "rxjs";
import { interval } from "rxjs";
import { map } from "rxjs/operators";
import { rootLogger } from "../../logger";
import { injectable } from "inversify";

interface TickData {
    waterModifier: number;
    happinessModifier: number;
    initiator: string;
}

@injectable()
class TickController {
    private static readonly logger = rootLogger.child({
        target: TickController,
    });

    private static readonly TIMEOUT = 60000;
    private static readonly WATER_MODIFIER = -0.5;
    private static readonly HAPPINESS_MODIFIER = -0.75;
    private static readonly INITIATOR_TICK = "Time";

    public readonly tickObservable: Observable<TickData>;

    constructor() {
        this.tickObservable = this.createTickObservable();
        TickController.logger.debug(
            `Started Lisa timer with an interval of ${TickController.TIMEOUT}.`
        );
    }

    private createTickObservable(): Observable<TickData> {
        return interval(TickController.TIMEOUT).pipe(
            map(() => {
                TickController.logger.debug("Running tick.");
                return {
                    waterModifier: TickController.WATER_MODIFIER,
                    happinessModifier: TickController.HAPPINESS_MODIFIER,
                    initiator: TickController.INITIATOR_TICK,
                };
            })
        );
    }
}

export { TickController };
