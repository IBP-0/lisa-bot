import { Injectable } from "chevronjs";
import { User } from "discord.js";
import { sample } from "lodash";
import { chevron } from "../../../chevron";
import { LisaStateController } from "../../../lisa/controller/LisaStateController";
import { LisaDeathCause } from "../../../lisa/LisaState";
import { LisaStatusService } from "../../../lisa/service/LisaStatusService";
import { LisaTextService } from "../../../lisa/service/LisaTextService";
import { DiscordService } from "../service/DiscordService";

@Injectable(chevron, {
    dependencies: [
        LisaStateController,
        LisaStatusService,
        LisaTextService,
        DiscordService
    ]
})
class DiscordCommandController {
    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly lisaStatusService: LisaStatusService,
        private readonly lisaTextService: LisaTextService,
        private readonly lisaDiscordService: DiscordService
    ) {
    }

    public performAction(
        author: User,
        waterModifier: number,
        happinessModifier: number,
        allowedUserIds: string[] | null,
        textSuccess: string[],
        textDead: string[],
        textNotAllowed: string[] = []
    ): string {
        if (!this.lisaDiscordService.isUserAllowed(allowedUserIds, author)) {
            return sample(textNotAllowed)!;
        }
        if (!this.isAlive()) {
            return sample(textDead)!;
        }

        this.lisaStateController.modifyLisaStatus(
            waterModifier,
            happinessModifier,
            this.lisaDiscordService.getFullUserName(author)
        );

        return [sample(textSuccess)!, this.createStatusText()].join("\n");
    }

    public performKill(
        author: User,
        cause: LisaDeathCause,
        allowedUserIds: string[] | null,
        textSuccess: string[],
        textAlreadyDead: string[],
        textNotAllowed: string[] = []
    ): string {
        if (!this.lisaDiscordService.isUserAllowed(allowedUserIds, author)) {
            return sample(textNotAllowed)!;
        }
        if (!this.isAlive()) {
            return sample(textAlreadyDead)!;
        }

        this.lisaStateController.killLisa(
            cause,
            this.lisaDiscordService.getFullUserName(author)
        );

        return [sample(textSuccess)!, this.createStatusText()].join("\n");
    }

    performReplant(
        author: User,
        allowedUserIds: string[] | null,
        textWasAlive: string[],
        textWasDead: string[],
        textNotAllowed: string[] = []
    ): string {
        if (!this.lisaDiscordService.isUserAllowed(allowedUserIds, author)) {
            return sample(textNotAllowed)!;
        }

        const wasAlive = this.isAlive();
        this.lisaStateController.replantLisa(
            this.lisaDiscordService.getFullUserName(author)
        );

        return sample(wasAlive ? textWasAlive : textWasDead)!;
    }

    public createStatusText(): string {
        return this.lisaTextService.createStatusText(
            this.lisaStateController.getStateCopy()
        );
    }

    private isAlive(): boolean {
        return this.lisaStatusService.isAlive(
            this.lisaStateController.getStateCopy()
        );
    }
}

export { DiscordCommandController };
