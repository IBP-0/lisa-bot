import { DefaultBootstrappings, Injectable } from "chevronjs";
import { chevron } from "../../chevron";
import { HAPPINESS_MAX, LisaState, WATER_MAX } from "../LisaState";

const FACTOR = (WATER_MAX + HAPPINESS_MAX) / 2;

@Injectable(chevron, { bootstrapping: DefaultBootstrappings.CLASS })
class LisaStatusService {
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
     * Returns an relative index how well lisa is doing.
     *
     * @return relative index.
     */
    public getRelativeIndex(state: LisaState): number {
        const relWater = state.status.water / WATER_MAX;
        const relHappiness = state.status.happiness / HAPPINESS_MAX;

        return relWater * relHappiness * FACTOR;
    }
}

export { LisaStatusService };
