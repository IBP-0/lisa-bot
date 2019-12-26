import { Subject } from "rxjs";
import { LisaDeathCause, LisaState } from "./LisaState";
import { LisaStatusService } from "./service/LisaStatusService";
declare class LisaStateController {
    private readonly lisaStatusService;
    private static readonly logger;
    readonly stateChangeSubject: Subject<void>;
    private state;
    constructor(lisaStatusService: LisaStatusService);
    /**
     * Gets a copy of the state to process e.g. when creating text for the current status.
     *
     * @return copy of the current state.
     */
    getStateCopy(): LisaState;
    /**
     * Only used for loading persisted data, do not use for regular state changes.
     *
     * @param state State to load.
     */
    load(state: LisaState): void;
    replantLisa(byUser?: string): void;
    killLisa(cause: LisaDeathCause, byUser?: string): void;
    modifyLisaStatus(waterModifier: number, happinessModifier: number, byUser?: string): void;
    private performReplant;
    private performKill;
    private performModifyStatus;
    private checkStats;
    private updateHighScoreIfRequired;
    private stateChanged;
}
export { LisaStateController };
