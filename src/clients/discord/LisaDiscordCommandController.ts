import { DefaultBootstrappings, Injectable } from "chevronjs";
import { CommandMessage } from "discord.js-commando";
import { sample } from "lodash";
import { chevron } from "../../chevron";
import { LisaStateController } from "../../lisa/LisaStateController";
import { LisaStatusService } from "../../lisa/service/LisaStatusService";
import { LisaTextService } from "../../lisa/service/LisaTextService";
import { rootLogger } from "../../logger";

@Injectable(chevron, {
    bootstrapping: DefaultBootstrappings.CLASS,
    dependencies: [LisaStateController, LisaStatusService, LisaTextService]
})
class LisaDiscordCommandController {
    private static readonly logger = rootLogger.child({
        target: LisaDiscordCommandController
    });

    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly lisaStatusService: LisaStatusService,
        private readonly lisaTextService: LisaTextService
    ) {}

    public performAction(
        message: CommandMessage,
        waterModifier: number,
        happinessModifier: number,
        allowedIds: string[] | null,
        textSuccess: string[],
        textDead: string[],
        textNotAllowed: string[] = []
    ): string {
        if (allowedIds != null && !allowedIds.includes(message.author.id)) {
            return sample(textNotAllowed)!;
        }

        if (
            !this.lisaStatusService.isAlive(
                this.lisaStateController.getStateCopy()
            )
        ) {
            return sample(textDead)!;
        }

        if (waterModifier !== 0) {
            this.lisaStateController.setWater(
                this.lisaStateController.getStateCopy().status.water +
                    waterModifier
            );
        }
        if (happinessModifier !== 0) {
            this.lisaStateController.setHappiness(
                this.lisaStateController.getStateCopy().status.happiness +
                    happinessModifier
            );
        }

        return [sample(textSuccess)!, this.createStatusText()].join("\n");
    }

    public createStatusText(): string {
        return this.lisaTextService.createStatusText(
            this.lisaStateController.getStateCopy()
        );
    }
}

export { LisaDiscordCommandController };
