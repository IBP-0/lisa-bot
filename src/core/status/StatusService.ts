import type { Duration } from "moment";
import { duration } from "moment";
import { rootLogger } from "../../logger";
import type { LisaState } from "../state/LisaState";
import { HAPPINESS_INITIAL, WATER_INITIAL } from "../state/LisaState";
import { injectable } from "inversify";

@injectable()
class StatusService {
    private static readonly logger = rootLogger.child({
        target: StatusService,
    });

    public isAlive(state: LisaState): boolean {
        return state.death.timestamp == null;
    }

    public getLifetime(state: LisaState): Duration {
        const birth = state.birth.timestamp.getTime();

        if (!this.isAlive(state)) {
            const death = state.death.timestamp!.getTime();
            return duration(death - birth);
        }

        const now = Date.now();
        return duration(now - birth);
    }

    public getTimeSinceDeath(state: LisaState): Duration | null {
        if (this.isAlive(state)) {
            return null;
        }

        const death = state.death.timestamp!.getTime();
        const now = Date.now();
        return duration(death - now);
    }

    /**
     * Returns an relative index from 0 to 1 how well lisa is doing, where 1 is the best and 0 the worst.
     *
     * @return relative index.
     */
    public calculateRelativeIndex(state: LisaState): number {
        let relativeWater = state.status.water / WATER_INITIAL;
        if (relativeWater > 1) {
            relativeWater = 1;
        }
        const relativeHappiness = state.status.happiness / HAPPINESS_INITIAL;

        const relativeIndex =
            relativeWater < relativeHappiness
                ? relativeWater
                : relativeHappiness;
        StatusService.logger.debug(
            `Calculated relative index ${relativeIndex.toFixed(2)} for water ${
                state.status.water
            } and happiness ${state.status.happiness}.`
        );
        return relativeIndex;
    }
}

export { StatusService };
