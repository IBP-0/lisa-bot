import { Subject } from "rxjs";
import { LisaDeathCause, LisaState } from "./LisaState";
declare class LisaStateController {
    private static readonly logger;
    readonly stateChangeSubject: Subject<void>;
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
    isLisaAlive(): boolean;
    setWater(water: number, byUser?: string): void;
    setHappiness(happiness: number, byUser?: string): void;
    replantLisa(byUser?: string): void;
    killLisa(cause: LisaDeathCause, byUser?: string): void;
    private stateChanged;
    private checkStats;
    private updateHighScoreIfRequired;
    private getLifetime;
}
export { LisaStateController };
//# sourceMappingURL=LisaStateController.d.ts.map