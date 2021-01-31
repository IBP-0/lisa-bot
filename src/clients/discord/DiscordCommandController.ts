import type { User } from "discord.js";
import { sample } from "lodash";
import { StateController } from "../../core/state/StateController";
import type { LisaDeathCause } from "../../core/state/LisaState";
import { StatusService } from "../../core/status/StatusService";
import { StatusTextService } from "../../core/status/StatusTextService";
import { DiscordService } from "./DiscordService";
import { rootLogger } from "../../logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

@injectable()
class DiscordCommandController {
    private static readonly logger = rootLogger.child({
        target: DiscordCommandController,
    });
    private static readonly DISCORD_USER_INITIATOR = "Discord user";

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

        DiscordCommandController.logger.info(
            `Discord user modified status; water modifier ${waterModifier}, happiness modifier ${happinessModifier}.`
        );
        this.lisaStateController.modifyLisaStatus(
            waterModifier,
            happinessModifier,
            DiscordCommandController.DISCORD_USER_INITIATOR
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
            DiscordCommandController.DISCORD_USER_INITIATOR
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
            DiscordCommandController.DISCORD_USER_INITIATOR
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
