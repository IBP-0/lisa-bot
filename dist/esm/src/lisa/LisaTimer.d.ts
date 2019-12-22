import { LisaStateController } from "./state/LisaStateController";
declare class LisaTimer {
    private readonly lisaStateController;
    private static readonly logger;
    private static readonly TIMEOUT;
    private static readonly WATER_MODIFIER;
    private static readonly HAPPINESS_MODIFIER;
    private timer;
    constructor(lisaStateController: LisaStateController);
    start(): void;
    private tick;
}
export { LisaTimer };
//# sourceMappingURL=LisaTimer.d.ts.map