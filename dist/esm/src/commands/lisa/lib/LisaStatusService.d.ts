import { Death } from "./Death";
import { ILisaData } from "./ILisaData";
declare class LisaStatusService {
    modify(lisaData: ILisaData, username: string, modifierWater: number, modifierHappiness: number): ILisaData;
    kill(lisaData: ILisaData, username: string, deathThrough: Death): ILisaData;
    createNewLisa(oldLisaData?: ILisaData): ILisaData;
    getLifetime(lisaData: ILisaData): number;
    getTimeSinceDeath(lisaData: ILisaData): number;
    getHighScore(lisaData: ILisaData): number;
    getRelativeState(lisaData: ILisaData): number;
    private setDeath;
    private updateHighScoreIfRequired;
}
export { LisaStatusService };
//# sourceMappingURL=LisaStatusService.d.ts.map