import type { User } from "discord.js";
import { inject, injectable } from "inversify";
import { sample } from "lodash";
import type { DeathCause } from "../../core/state/State";
import { StateController } from "../../core/state/StateController";
import { StatusService } from "../../core/status/StatusService";
import { StatusTextService } from "../../core/status/StatusTextService";
import { rootLogger } from "../../logger";
import { TYPES } from "../../types";
import { DiscordService } from "./DiscordService";

@injectable()
class DiscordCommandController {
    private static readonly logger = rootLogger.child({
        target: DiscordCommandController,
    });
    private static readonly DISCORD_USER_INITIATOR = "Discord user";

    readonly #stateController: StateController;
    readonly #statusService: StatusService;
    readonly #statusTextService: StatusTextService;
    readonly #discordService: DiscordService;

    constructor(
        @inject(TYPES.StateController)
        stateController: StateController,
        @inject(TYPES.StatusService) statusService: StatusService,
        @inject(TYPES.StatusTextService) statusTextService: StatusTextService,
        @inject(TYPES.DiscordService) discordService: DiscordService
    ) {
        this.#discordService = discordService;
        this.#statusTextService = statusTextService;
        this.#statusService = statusService;
        this.#stateController = stateController;
    }

    performAction(
        author: User,
        waterModifier: number,
        happinessModifier: number,
        allowedUserIds: string[] | null,
        textSuccess: string[],
        textDead: string[],
        textNotAllowed: string[] = []
    ): string {
        if (!this.#discordService.isUserAllowed(allowedUserIds, author)) {
            return sample(textNotAllowed)!;
        }
        if (!this.#isAlive()) {
            return sample(textDead)!;
        }

        DiscordCommandController.logger.info(
            `Discord user modified status; water modifier ${waterModifier}, happiness modifier ${happinessModifier}.`
        );
        this.#stateController.modifyLisaStatus(
            waterModifier,
            happinessModifier,
            DiscordCommandController.DISCORD_USER_INITIATOR
        );

        return [sample(textSuccess)!, this.createStatusText()].join("\n");
    }

    performKill(
        author: User,
        cause: DeathCause,
        allowedUserIds: string[] | null,
        textSuccess: string[],
        textAlreadyDead: string[],
        textNotAllowed: string[] = []
    ): string {
        if (!this.#discordService.isUserAllowed(allowedUserIds, author)) {
            return sample(textNotAllowed)!;
        }
        if (!this.#isAlive()) {
            return sample(textAlreadyDead)!;
        }

        this.#stateController.killLisa(
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
        if (!this.#discordService.isUserAllowed(allowedUserIds, author)) {
            return sample(textNotAllowed)!;
        }

        const wasAlive = this.#isAlive();
        this.#stateController.replantLisa(
            DiscordCommandController.DISCORD_USER_INITIATOR
        );

        return sample(wasAlive ? textWasAlive : textWasDead)!;
    }

    createStatusText(): string {
        return this.#statusTextService.createStatusText(
            this.#stateController.getStateCopy()
        );
    }

    #isAlive(): boolean {
        return this.#statusService.isAlive(
            this.#stateController.getStateCopy()
        );
    }
}

export { DiscordCommandController };
