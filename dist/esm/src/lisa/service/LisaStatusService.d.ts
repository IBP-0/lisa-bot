import { LisaState } from "../LisaState";
declare class LisaStatusService {
    isAlive(state: LisaState): boolean;
    getLifetime(state: LisaState): number;
    getTimeSinceDeath(state: LisaState): number | null;
    /**
     * Returns an relative index how well lisa is doing.
     *
     * @return relative index.
     */
    getRelativeIndex(state: LisaState): number;
}
export { LisaStatusService };
//# sourceMappingURL=LisaStatusService.d.ts.map