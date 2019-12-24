import { DefaultBootstrappings, Injectable } from "chevronjs";
import { chevron } from "../../chevron";
import { LisaState } from "../LisaState";

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
}

export { LisaStatusService };
