import { Death } from "./Death";
import { LisaData } from "./LisaData";
declare class LisaStatusService {
    modify(lisaData: LisaData, username: string, modifierWater: number, modifierHappiness: number): LisaData;
    kill(lisaData: LisaData, username: string, deathThrough: Death): LisaData;
    createNewLisa(oldLisaData?: LisaData): LisaData;
    getLifetime(lisaData: LisaData): number;
    getTimeSinceDeath(lisaData: LisaData): number;
    getHighScore(lisaData: LisaData): number;
    getRelativeState(lisaData: LisaData): number;
    private setDeath;
    private updateHighScoreIfRequired;
}
export { LisaStatusService };
//# sourceMappingURL=LisaStatusService.d.ts.map