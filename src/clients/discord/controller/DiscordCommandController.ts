import { User } from "discord.js";
import { sample } from "lodash";
import { StateController } from "../../../core/controller/StateController";
import { LisaDeathCause } from "../../../core/LisaState";
import { StatusService } from "../../../core/service/StatusService";
import { StatusTextService } from "../../../core/service/StatusTextService";
import { DiscordService } from "../service/DiscordService";
import { rootLogger } from "../../../logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";

@injectable()
class DiscordCommandController {
    private static readonly logger = rootLogger.child({
        target: DiscordCommandController,
    });

    private readonly lisaStateController: StateController;
    private readonly lisaStatusService: StatusService;
    private readonly lisaTextService: StatusTextService;
    private readonly lisaDiscordService: DiscordService;

    constructor(
        @inject(TYPES.LisaStateController)
        lisaStateController: StateController,
        @inject(TYPES.LisaStatusService) lisaStatusService: StatusService,
        @inject(TYPES.LisaTextService) lisaTextService: StatusTextService,
        @inject(TYPES.DiscordService) lisaDiscordService: DiscordService
    ) {
        this.lisaDiscordService = lisaDiscordService;
        this.lisaTextService = lisaTextService;
        this.lisaStatusService = lisaStatusService;
        this.lisaStateController = lisaStateController;
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

        const byUser = this.lisaDiscordService.getFullUserName(author);
        DiscordCommandController.logger.info(
            `Discord user '${byUser}' modified status; water modifier ${waterModifier}, happiness modifier ${happinessModifier}.`
        );
        this.lisaStateController.modifyLisaStatus(
            waterModifier,
            happinessModifier,
            byUser
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
