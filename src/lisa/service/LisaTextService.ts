import { DefaultBootstrappings, Injectable } from "chevronjs";
import * as moment from "moment";
import { chevron } from "../../chevron";
import { LisaState } from "../LisaState";
import { LisaStatusService } from "./LisaStatusService";

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: [LisaStatusService]
})
class LisaTextService {
    constructor(private readonly lisaStatusService: LisaStatusService) {}

    public createStatusText(state: LisaState): string {
        const statusLabel = `Lisa is ${this.createStatusLabel(state)}`;
        const scoreText = this.createScoreText(state);
        let text: string[];

        if (!this.lisaStatusService.isAlive(state)) {
            const timeSinceDeathLabel = this.humanizeDuration(
                this.lisaStatusService.getTimeSinceDeath(state)!
            );
            const lifetimeLabel = this.humanizeDuration(
                this.lisaStatusService.getLifetime(state)
            );

            text = [
                `Lisa died ${timeSinceDeathLabel} ago, and was alive for ${lifetimeLabel}.`,
                `She was killed by ${state.death.byUser} through ${state.death.cause}.`
            ];
        } else {
            const waterLevel = state.status.water.toFixed(2);
            const happinessLevel = state.status.happiness.toFixed(2);

            text = [`Water: ${waterLevel}% | Happiness: ${happinessLevel}%.`];
        }

        return [statusLabel, ...text, scoreText].join("\n");
    }

    public createStatusLabel(state: LisaState): string {
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

    private createScoreText(state: LisaState): string {
        const lifetimeLabel = this.humanizeDuration(
            this.lisaStatusService.getLifetime(state)
        );
        const highScoreLabel = this.humanizeDuration(state.highScore);
        const currentLabel = this.lisaStatusService.isAlive(state)
            ? "Current lifetime"
            : "Lifetime";

        return `${currentLabel}: ${lifetimeLabel} | Best lifetime: ${highScoreLabel}.`;
    }

    private humanizeDuration(durationMs: number): string {
        return moment.duration(durationMs).humanize();
    }
}

export { LisaTextService };
