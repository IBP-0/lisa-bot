import { LisaState } from "./state/LisaState";
declare class LisaStorageService {
    loadStoredState(path: string): Promise<LisaState>;
    storeState(path: string, state: LisaState): Promise<void>;
    private fromJson;
    private toJson;
}
export { LisaStorageService };
//# sourceMappingURL=LisaStorageService.d.ts.map