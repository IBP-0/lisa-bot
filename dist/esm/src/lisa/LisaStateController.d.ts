import { Subject } from "rxjs";
import { LisaDeath, LisaDeathCause, LisaLife, LisaState } from "./LisaState";
declare class LisaStateController {
    readonly stateChangeSubject: Subject<LisaState>;
    private state;
    constructor();
    /**
     * Gets a copy of the state to process e.g. when creating text for the current status.
     *
     * @return copy of the current state.
     */
    getStateCopy(): LisaState;
    /**
     * Only used for loading od persisted data, do not use for regular state changes.
     *
     * @param state State to load.
     */
    load(state: LisaState): void;
    isAlive(): boolean;
    getWater(): number;
    setWater(water: number, byUser?: string): void;
    getHappiness(): number;
    setHappiness(happiness: number, byUser?: string): void;
    getHighScore(): number;
    getLife(): LisaLife;
    setLife(byUser?: string): void;
    getDeath(): LisaDeath;
    setDeath(cause: LisaDeathCause, byUser?: string): void;
    private stateChanged;
    private updateStats;
    private updateHighScoreIfRequired;
    private getLifetime;
}
export { LisaStateController };
//# sourceMappingURL=LisaStateController.d.ts.map