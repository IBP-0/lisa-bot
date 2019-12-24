import { LisaState } from "../LisaState";
declare class LisaStorageService {
    static readonly STORAGE_PATH = "data/lisaState.json";
    hasStoredState(): Promise<boolean>;
    loadStoredState(): Promise<LisaState>;
    storeState(state: LisaState): Promise<void>;
    private fromJson;
    private toJson;
}
export { LisaStorageService };
//# sourceMappingURL=LisaStorageService.d.ts.map