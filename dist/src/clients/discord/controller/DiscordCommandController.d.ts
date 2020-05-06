import { User } from "discord.js";
import { StateController } from "../../../core/controller/StateController";
import { LisaDeathCause } from "../../../core/LisaState";
import { StatusService } from "../../../core/service/StatusService";
import { StatusTextService } from "../../../core/service/StatusTextService";
import { DiscordService } from "../service/DiscordService";
declare class DiscordCommandController {
    private static readonly logger;
    private readonly lisaStateController;
    private readonly lisaStatusService;
    private readonly lisaTextService;
    private readonly lisaDiscordService;
    constructor(lisaStateController: StateController, lisaStatusService: StatusService, lisaTextService: StatusTextService, lisaDiscordService: DiscordService);
    performAction(author: User, waterModifier: number, happinessModifier: number, allowedUserIds: string[] | null, textSuccess: string[], textDead: string[], textNotAllowed?: string[]): string;
    performKill(author: User, cause: LisaDeathCause, allowedUserIds: string[] | null, textSuccess: string[], textAlreadyDead: string[], textNotAllowed?: string[]): string;
    performReplant(author: User, allowedUserIds: string[] | null, textWasAlive: string[], textWasDead: string[], textNotAllowed?: string[]): string;
    createStatusText(): string;
    private isAlive;
}
export { DiscordCommandController };
