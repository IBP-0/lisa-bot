import { LisaState } from "../LisaState";
import { LisaStatusService } from "./LisaStatusService";
declare class LisaTextService {
    private readonly lisaStatusService;
    constructor(lisaStatusService: LisaStatusService);
    determineStatusLabel(state: LisaState): string;
}
export { LisaTextService };
//# sourceMappingURL=LisaTextService.d.ts.map