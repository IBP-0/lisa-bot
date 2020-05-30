import { LisaState } from "../LisaState";
import { JsonLisaState } from "../JsonLisaState";
declare class StateStorageService {
    fromStorable(jsonState: JsonLisaState): LisaState;
    toStorable(state: LisaState): JsonLisaState;
}
export { StateStorageService };
