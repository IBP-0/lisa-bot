import { LisaData } from "./LisaData";
import { LisaStatusService } from "./LisaStatusService";
declare class LisaStringifyService {
    private readonly lisaStatusService;
    constructor(lisaStatusService: LisaStatusService);
    stringifyStatus(lisaData: LisaData): string;
    stringifyStatusShort(lisaData: LisaData): string;
    private stringifyScore;
    private humanizeDuration;
}
export { LisaStringifyService };
//# sourceMappingURL=LisaStringifyService.d.ts.map