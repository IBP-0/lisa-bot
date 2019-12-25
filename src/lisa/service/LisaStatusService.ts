import { DefaultBootstrappings, Injectable } from "chevronjs";
import { chevron } from "../../chevron";
import { rootLogger } from "../../logger";
import { HAPPINESS_INITIAL, LisaState, WATER_INITIAL } from "../LisaState";

@Injectable(chevron, { bootstrapping: DefaultBootstrappings.CLASS })
class LisaStatusService {
    private static readonly logger = rootLogger.child({
        target: LisaStatusService
    });

    public isAlive(state: LisaState): boolean {
        return state.death.time == null;
    }

    public getLifetime(state: LisaState): number {
        const birth = state.life.time.getTime();

        if (!this.isAlive(state)) {
            const death = state.death.time!.getTime();
            return death - birth;
        }

        const now = Date.now();
        return now - birth;
    }

    public getTimeSinceDeath(state: LisaState): number | null {
        if (this.isAlive(state)) {
            return null;
        }

        const death = state.death.time!.getTime();
        const now = Date.now();
        return now - death;
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

        const relativeIndex = (relativeWater + relativeHappiness) / 2;
        LisaStatusService.logger.debug(
            `Calculated relative index ${relativeIndex.toFixed(2)} for water ${
                state.status.water
            } and happiness ${state.status.happiness}.`
        );
        return relativeIndex;
    }
}

export { LisaStatusService };
