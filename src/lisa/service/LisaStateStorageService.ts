import { Injectable } from "chevronjs";
import { cloneDeep } from "lodash";
import { duration } from "moment";
import { chevron } from "../../chevron";
import { LisaDeathCause, LisaState } from "../LisaState";

interface JsonLisaState {
    status: {
        water: number;
        happiness: number;
    };
    life: {
        time: number;
        byUser: string;
    };
    death: {
        time: number | null;
        byUser: string | null;
        cause: LisaDeathCause | null;
    };
    bestLifetime: number;
}

@Injectable(chevron)
class LisaStateStorageService {
    public fromStorable(jsonState: JsonLisaState): LisaState {
        const state: any = cloneDeep(jsonState);
        if (state.life.time != null) {
            state.life.time = new Date(state.life.time);
        }
        if (state.death.time != null) {
            state.death.time = new Date(state.death.time);
        }
        state.bestLifetime = duration(state.bestLifetime);
        return state;
    }

    public toStorable(state: LisaState): JsonLisaState {
        const storedState: any = cloneDeep(state);
        if (storedState.life.time != null) {
            storedState.life.time = storedState.life.time.getTime();
        }
        if (storedState.death.time != null) {
            storedState.death.time = storedState.death.time.getTime();
        }
        storedState.bestLifetime = state.bestLifetime.asMilliseconds();
        return storedState;
    }
}

export { LisaStateStorageService };
