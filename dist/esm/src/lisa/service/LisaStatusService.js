var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LisaStatusService_1;
import { DefaultBootstrappings, Injectable } from "chevronjs";
import { chevron } from "../../chevron";
import { rootLogger } from "../../logger";
import { HAPPINESS_INITIAL, WATER_INITIAL } from "../LisaState";
let LisaStatusService = LisaStatusService_1 = class LisaStatusService {
    isAlive(state) {
        return state.death.time == null;
    }
    getLifetime(state) {
        const birth = state.life.time.getTime();
        if (!this.isAlive(state)) {
            const death = state.death.time.getTime();
            return death - birth;
        }
        const now = Date.now();
        return now - birth;
    }
    getTimeSinceDeath(state) {
        if (this.isAlive(state)) {
            return null;
        }
        const death = state.death.time.getTime();
        const now = Date.now();
        return now - death;
    }
    /**
     * Returns an relative index from 0 to 1 how well lisa is doing, where 1 is the best and 0 the worst.
     *
     * @return relative index.
     */
    getRelativeIndex(state) {
        let relWater = state.status.water / WATER_INITIAL;
        if (relWater > 1) {
            relWater = 1;
        }
        const relHappiness = state.status.happiness / HAPPINESS_INITIAL;
        const index = (relWater + relHappiness) / 2;
        LisaStatusService_1.logger.debug(`Calculated relative index ${index.toFixed(2)} for water ${state.status.water} and happiness ${state.status.happiness}.`);
        return index;
    }
};
LisaStatusService.logger = rootLogger.child({
    target: LisaStatusService_1
});
LisaStatusService = LisaStatusService_1 = __decorate([
    Injectable(chevron, { bootstrapping: DefaultBootstrappings.CLASS })
], LisaStatusService);
export { LisaStatusService };
//# sourceMappingURL=LisaStatusService.js.map