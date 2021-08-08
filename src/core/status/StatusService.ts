import { inject, injectable } from "inversify";
import type { Duration } from "luxon";
import { rootLogger } from "../../logger";
import { TYPES } from "../../types";
import type { State } from "../state/State";
import { HAPPINESS_INITIAL, WATER_INITIAL } from "../state/State";
import { TimeProvider } from "../time/TimeProvider";

@injectable()
class StatusService {
    private static readonly logger = rootLogger.child({
        target: StatusService,
    });

    readonly #timeProvider: TimeProvider;

    constructor(@inject(TYPES.TimeProvider) timeProvider: TimeProvider) {
        this.#timeProvider = timeProvider;
    }

    isAlive(state: State): boolean {
        return state.death.timestamp == null;
    }

    getLifetime(state: State): Duration {
        const birth = state.birth.timestamp;

        if (!this.isAlive(state)) {
            const death = state.death.timestamp!;
            return birth.diff(death);
        }
        return birth.diff(this.#timeProvider.now());
    }

    getTimeSinceDeath(state: State): Duration | null {
        if (this.isAlive(state)) {
            return null;
        }

        const death = state.death.timestamp!;
        return death.diff(this.#timeProvider.now());
    }

    /**
     * Returns an relative index from 0 to 1 how well lisa is doing, where 1 is the best and 0 the worst.
     *
     * @return relative index.
     */
    calculateRelativeIndex(state: State): number {
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
