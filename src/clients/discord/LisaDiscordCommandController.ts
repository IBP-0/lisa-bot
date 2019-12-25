import { DefaultBootstrappings, Injectable } from "chevronjs";
import { User } from "discord.js";
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
        author: User,
        waterModifier: number,
        happinessModifier: number,
        allowedIds: string[] | null,
        textSuccess: string[],
        textDead: string[],
        textNotAllowed: string[] = []
    ): string {
        if (allowedIds != null && !allowedIds.includes(author.id)) {
            return sample(textNotAllowed)!;
        }
        if (
            !this.lisaStatusService.isAlive(
                this.lisaStateController.getStateCopy()
            )
        ) {
            return sample(textDead)!;
        }

        this.lisaStateController.modifyStatus(
            waterModifier,
            happinessModifier,
            this.getFullUserName(author)
        );

        return [sample(textSuccess)!, this.createStatusText()].join("\n");
    }

    public createStatusText(): string {
        return this.lisaTextService.createStatusText(
            this.lisaStateController.getStateCopy()
        );
    }

    private getFullUserName(user: User): string {
        return `${user.username}#${user.discriminator}`;
    }
}

export { LisaDiscordCommandController };
