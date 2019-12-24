var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LisaTimer_1;
import { DefaultBootstrappings, Injectable } from "chevronjs";
import { interval } from "rxjs";
import { chevron } from "../chevron";
import { rootLogger } from "../logger";
import { LisaStateController } from "./LisaStateController";
let LisaTimer = LisaTimer_1 = class LisaTimer {
    constructor(lisaStateController) {
        this.lisaStateController = lisaStateController;
        this.timer = null;
    }
    start() {
        interval(LisaTimer_1.TIMEOUT).subscribe(() => this.tick());
        LisaTimer_1.logger.info(`Started Lisa timer with an interval of ${LisaTimer_1.TIMEOUT}.`);
    }
    tick() {
        LisaTimer_1.logger.debug(`Performing tick.`);
        this.lisaStateController.setWater(this.lisaStateController.getWater() + LisaTimer_1.WATER_MODIFIER);
        this.lisaStateController.setHappiness(this.lisaStateController.getHappiness() +
            LisaTimer_1.HAPPINESS_MODIFIER);
    }
};
LisaTimer.logger = rootLogger.child({
    service: LisaTimer_1
});
LisaTimer.TIMEOUT = 60000;
LisaTimer.WATER_MODIFIER = -0.5;
LisaTimer.HAPPINESS_MODIFIER = -0.75;
LisaTimer = LisaTimer_1 = __decorate([
    Injectable(chevron, {
        bootstrapping: DefaultBootstrappings.CLASS,
        dependencies: [LisaStateController]
    }),
    __metadata("design:paramtypes", [LisaStateController])
], LisaTimer);
export { LisaTimer };
//# sourceMappingURL=LisaTimer.js.map