import { ILisaData } from "./ILisaData";
import { LisaStatusService } from "./LisaStatusService";
declare class LisaStringifyService {
    private readonly lisaStatusService;
    constructor(lisaStatusService: LisaStatusService);
    stringifyStatus(lisaData: ILisaData): string;
    stringifyStatusShort(lisaData: ILisaData): string;
    private stringifyScore;
    private humanizeDuration;
}
export { LisaStringifyService };
//# sourceMappingURL=LisaStringifyService.d.ts.map