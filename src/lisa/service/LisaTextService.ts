import { DefaultBootstrappings, Injectable } from "chevronjs";
import { chevron } from "../../chevron";
import { LisaState } from "../LisaState";
import { LisaStatusService } from "./LisaStatusService";

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

        const relativeIndex = this.lisaStatusService.calculateRelativeIndex(
            state
        );
        if (relativeIndex > 0.666) {
            return "doing great.";
        } else if (relativeIndex > 0.333) {
            return "doing fine.";
        }
        return "close to dying.";
    }
}

export { LisaTextService };
