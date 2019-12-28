import { Injectable } from "chevronjs";
import { cloneDeep } from "lodash";
import { duration } from "moment";
import { chevron } from "../../chevron";
import { LisaDeathCause, LisaState } from "../LisaState";
import { JsonStorageService } from "./JsonStorageService";

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

@Injectable(chevron, { dependencies: [JsonStorageService] })
class LisaStateStorageService {
    private static readonly STORAGE_PATH= "data/storage.json";
    private static readonly STORAGE_KEY= "lisaState";

    constructor(private readonly jsonStorageService: JsonStorageService) {}

    public async hasStoredState(): Promise<boolean> {
        return this.jsonStorageService.hasStorageKey(
            LisaStateStorageService.STORAGE_PATH,
            LisaStateStorageService.STORAGE_KEY
        );
    }

    public async loadStoredState(): Promise<LisaState> {
        const storedState = await this.jsonStorageService.load(
            LisaStateStorageService.STORAGE_PATH,
            LisaStateStorageService.STORAGE_KEY
        );
        return this.fromStorable(storedState);
    }

    public async storeState(state: LisaState): Promise<void> {
        const jsonLisaState = this.toStorable(state);
        return await this.jsonStorageService.store(
            LisaStateStorageService.STORAGE_PATH,
            LisaStateStorageService.STORAGE_KEY,
            jsonLisaState
        );
    }

    private fromStorable(jsonState: JsonLisaState): LisaState {
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

    private toStorable(state: LisaState): JsonLisaState {
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
