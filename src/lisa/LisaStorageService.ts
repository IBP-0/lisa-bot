import { DefaultBootstrappings, Injectable } from "chevronjs";
import { readJSON, writeJSON } from "fs-extra";
import { cloneDeep } from "lodash";
import { chevron } from "../chevron";
import { LisaDeathCause, LisaState } from "./state/LisaState";

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
    highScore: number;
}

@Injectable(chevron, { bootstrapping: DefaultBootstrappings.CLASS })
class LisaStorageService {
    public async loadStoredState(path: string): Promise<LisaState> {
        const storedState = await readJSON(path);
        return this.fromJson(storedState);
    }

    public async storeState(path: string, state: LisaState): Promise<void> {
        const jsonLisaState = this.toJson(state);
        return await writeJSON(path, jsonLisaState);
    }

    private fromJson(jsonState: JsonLisaState): LisaState {
        const state: any = cloneDeep(jsonState);
        if (state.life.time != null) {
            state.life.time = new Date(state.life.time);
        }
        if (state.death.time != null) {
            state.death.time = new Date(state.death.time);
        }
        return state;
    }

    private toJson(state: LisaState): JsonLisaState {
        const storedState: any = cloneDeep(state);
        if (storedState.life.time != null) {
            storedState.life.time = storedState.life.time.getTime();
        }
        if (storedState.death.time != null) {
            storedState.death.time = storedState.death.time.getTime();
        }
        return storedState;
    }
}

export { LisaStorageService };
