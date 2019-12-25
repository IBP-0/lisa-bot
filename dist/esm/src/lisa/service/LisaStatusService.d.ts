import { LisaState } from "../LisaState";
declare class LisaStatusService {
    private static readonly logger;
    isAlive(state: LisaState): boolean;
    getLifetime(state: LisaState): number;
    getTimeSinceDeath(state: LisaState): number | null;
    /**
     * Returns an relative index from 0 to 1 how well lisa is doing, where 1 is the best and 0 the worst.
     *
     * @return relative index.
     */
    getRelativeIndex(state: LisaState): number;
}
export { LisaStatusService };
//# sourceMappingURL=LisaStatusService.d.ts.map