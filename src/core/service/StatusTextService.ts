import type { LisaState } from "../LisaState";
import type { StatusService } from "./StatusService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

@injectable()
class StatusTextService {
    private readonly lisaStatusService: StatusService;

    constructor(
        @inject(TYPES.LisaStatusService) lisaStatusService: StatusService
    ) {
        this.lisaStatusService = lisaStatusService;
    }

    public createStatusText(state: LisaState): string {
        const statusLabel = `Lisa is ${this.createStatusLabel(state)}.`;
        const scoreText = this.createScoreText(state);
        let text: string;

        if (!this.lisaStatusService.isAlive(state)) {
            const timeSinceDeathLabel = this.lisaStatusService
                .getTimeSinceDeath(state)!
                .humanize();

            text = `Lisa died ${timeSinceDeathLabel} ago, she was killed by ${
                state.death.byUser ?? "anonymous"
            } through ${state.death.cause ?? "unknown cause"}.`;
        } else {
            const waterLevel = state.status.water.toFixed(2);
            const happinessLevel = state.status.happiness.toFixed(2);

            text = `Water: ${waterLevel}% | Happiness: ${happinessLevel}%.`;
        }

        return [statusLabel, text, scoreText].join("\n");
    }

    public createStatusLabel(state: LisaState): string {
        if (!this.lisaStatusService.isAlive(state)) {
            return "is dead";
        }

        const relativeIndex = this.lisaStatusService.calculateRelativeIndex(
            state
        );
        if (relativeIndex > 0.666) {
            return "doing great";
        } else if (relativeIndex > 0.333) {
            return "doing fine";
        }
        return "close to dying";
    }

    private createScoreText(state: LisaState): string {
        const lifetimeLabel = this.lisaStatusService
            .getLifetime(state)
            .humanize();
        const highScoreLabel = state.bestLifetime.humanize();
        const currentLabel = this.lisaStatusService.isAlive(state)
            ? "Current lifetime"
            : "Lifetime";

        return `${currentLabel}: ${lifetimeLabel} | Best lifetime: ${highScoreLabel}.`;
    }
}

export { StatusTextService };
