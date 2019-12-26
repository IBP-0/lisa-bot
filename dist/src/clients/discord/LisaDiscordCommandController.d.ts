import { User } from "discord.js";
import { LisaDeathCause } from "../../lisa/LisaState";
import { LisaStateController } from "../../lisa/LisaStateController";
import { LisaStatusService } from "../../lisa/service/LisaStatusService";
import { LisaTextService } from "../../lisa/service/LisaTextService";
declare class LisaDiscordCommandController {
    private readonly lisaStateController;
    private readonly lisaStatusService;
    private readonly lisaTextService;
    private static readonly logger;
    constructor(lisaStateController: LisaStateController, lisaStatusService: LisaStatusService, lisaTextService: LisaTextService);
    performAction(author: User, waterModifier: number, happinessModifier: number, allowedUserIds: string[] | null, textSuccess: string[], textDead: string[], textNotAllowed?: string[]): string;
    performKill(author: User, cause: LisaDeathCause, allowedUserIds: string[] | null, textSuccess: string[], textAlreadyDead: string[], textNotAllowed?: string[]): string;
    performReplant(author: User, allowedUserIds: string[] | null, textWasAlive: string[], textWasDead: string[], textNotAllowed?: string[]): string;
    createStatusText(): string;
    private getFullUserName;
    private isAlive;
    private isUserAllowed;
}
export { LisaDiscordCommandController };
