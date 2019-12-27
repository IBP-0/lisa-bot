import { Injectable } from "chevronjs";
import { User } from "discord.js";
import { sample } from "lodash";
import { chevron } from "../../chevron";
import { LisaDeathCause } from "../../lisa/LisaState";
import { LisaStateController } from "../../lisa/LisaStateController";
import { LisaStatusService } from "../../lisa/service/LisaStatusService";
import { LisaTextService } from "../../lisa/service/LisaTextService";

@Injectable(chevron, {
    dependencies: [LisaStateController, LisaStatusService, LisaTextService]
})
class LisaDiscordCommandController {
    constructor(
        private readonly lisaStateController: LisaStateController,
        private readonly lisaStatusService: LisaStatusService,
        private readonly lisaTextService: LisaTextService
    ) {}

    public performAction(
        author: User,
        waterModifier: number,
        happinessModifier: number,
        allowedUserIds: string[] | null,
        textSuccess: string[],
        textDead: string[],
        textNotAllowed: string[] = []
    ): string {
        if (!this.isUserAllowed(allowedUserIds, author)) {
            return sample(textNotAllowed)!;
        }
        if (!this.isAlive()) {
            return sample(textDead)!;
        }

        this.lisaStateController.modifyLisaStatus(
            waterModifier,
            happinessModifier,
            this.getFullUserName(author)
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
        if (!this.isUserAllowed(allowedUserIds, author)) {
            return sample(textNotAllowed)!;
        }
        if (!this.isAlive()) {
            return sample(textAlreadyDead)!;
        }

        this.lisaStateController.killLisa(cause, this.getFullUserName(author));

        return [sample(textSuccess)!, this.createStatusText()].join("\n");
    }

    performReplant(
        author: User,
        allowedUserIds: string[] | null,
        textWasAlive: string[],
        textWasDead: string[],
        textNotAllowed: string[] = []
    ): string {
        if (!this.isUserAllowed(allowedUserIds, author)) {
            return sample(textNotAllowed)!;
        }

        const wasAlive = this.isAlive();
        this.lisaStateController.replantLisa(this.getFullUserName(author));

        return sample(wasAlive ? textWasAlive : textWasDead)!;
    }

    public createStatusText(): string {
        return this.lisaTextService.createStatusText(
            this.lisaStateController.getStateCopy()
        );
    }

    private getFullUserName(user: User): string {
        return `${user.username}#${user.discriminator}`;
    }

    private isAlive(): boolean {
        return this.lisaStatusService.isAlive(
            this.lisaStateController.getStateCopy()
        );
    }

    private isUserAllowed(
        allowedUserIds: string[] | null,
        author: User
    ): boolean {
        return allowedUserIds == null || allowedUserIds.includes(author.id);
    }
}

export { LisaDiscordCommandController };
