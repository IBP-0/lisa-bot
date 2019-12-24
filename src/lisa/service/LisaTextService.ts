import { DefaultBootstrappings, Injectable } from "chevronjs";
import { chevron } from "../../chevron";
import { LisaState } from "../LisaState";
import { LisaStatusService } from "./LisaStatusService";

const RELATIVE_STATE_GOOD = 90;
const RELATIVE_STATE_OK = 40;

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: [LisaStatusService]
})
class LisaTextService {
    constructor(private readonly lisaStatusService: LisaStatusService) {}

    public determineStatusLabel(state: LisaState): string {
        if (!this.lisaStatusService.isAlive(state)) {
            return "is dead.";
        }

        const relativeState = this.lisaStatusService.getRelativeIndex(state);
        if (relativeState > RELATIVE_STATE_GOOD) {
            return "doing great.";
        }
        if (relativeState > RELATIVE_STATE_OK) {
            return "doing fine.";
        }
        return "close to dying.";
    }
}

export { LisaTextService };
