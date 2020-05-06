import { LisaState } from "../LisaState";
import { StatusService } from "./StatusService";
declare class StatusTextService {
    private readonly lisaStatusService;
    constructor(lisaStatusService: StatusService);
    createStatusText(state: LisaState): string;
    createStatusLabel(state: LisaState): string;
    private createScoreText;
}
export { StatusTextService };
