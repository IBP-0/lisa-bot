import { Storage } from "di-ngy/dist/esm/src/storage/Storage";
import { Death } from "./Death";
import { LisaStatusService } from "./LisaStatusService";
import { LisaStringifyService } from "./LisaStringifyService";
declare class LisaController {
    private static readonly STORE_KEY;
    private static readonly logger;
    private readonly store;
    private readonly lisaStatusService;
    private readonly lisaStringifyService;
    private lisaData;
    constructor(store: Storage<any>, lisaStatusService: LisaStatusService, lisaStringifyService: LisaStringifyService);
    performAction(username: string, modifierWater: number, modifierHappiness: number, textSuccess: string[], textAlreadyDead: string[]): string;
    performKill(username: string, deathThrough: Death, textSuccess: string[], textAlreadyDead: string[]): string;
    modify(username: string, modifierWater: number, modifierHappiness: number): void;
    stringifyStatus(): string;
    stringifyStatusShort(): string;
    isAlive(): boolean;
    createNewLisa(): void;
    private save;
}
export { LisaController };
//# sourceMappingURL=LisaController.d.ts.map