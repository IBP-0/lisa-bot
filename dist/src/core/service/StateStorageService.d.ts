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
declare class StateStorageService {
    fromStorable(jsonState: JsonLisaState): LisaState;
    toStorable(state: LisaState): JsonLisaState;
}
export { StateStorageService };
