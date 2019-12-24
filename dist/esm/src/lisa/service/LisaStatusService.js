var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DefaultBootstrappings, Injectable } from "chevronjs";
import { chevron } from "../../chevron";
let LisaStatusService = class LisaStatusService {
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
};
LisaStatusService = __decorate([
    Injectable(chevron, { bootstrapping: DefaultBootstrappings.CLASS })
], LisaStatusService);
export { LisaStatusService };
//# sourceMappingURL=LisaStatusService.js.map