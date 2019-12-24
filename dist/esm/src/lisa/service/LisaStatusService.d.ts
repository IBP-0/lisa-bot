import { LisaState } from "../LisaState";
declare class LisaStatusService {
    isAlive(state: LisaState): boolean;
    getLifetime(state: LisaState): number;
    getTimeSinceDeath(state: LisaState): number | null;
}
export { LisaStatusService };
//# sourceMappingURL=LisaStatusService.d.ts.map