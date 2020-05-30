"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusTextService = void 0;
const StatusService_1 = require("./StatusService");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
let StatusTextService = /** @class */ (() => {
    let StatusTextService = class StatusTextService {
        constructor(lisaStatusService) {
            this.lisaStatusService = lisaStatusService;
        }
        createStatusText(state) {
            var _a, _b;
            const statusLabel = `Lisa is ${this.createStatusLabel(state)}.`;
            const scoreText = this.createScoreText(state);
            let text;
            if (!this.lisaStatusService.isAlive(state)) {
                const timeSinceDeathLabel = this.lisaStatusService
                    .getTimeSinceDeath(state)
                    .humanize();
                text = `Lisa died ${timeSinceDeathLabel} ago, she was killed by ${(_a = state.death.byUser) !== null && _a !== void 0 ? _a : "anonymous"} through ${(_b = state.death.cause) !== null && _b !== void 0 ? _b : "unknown cause"}.`;
            }
            else {
                const waterLevel = state.status.water.toFixed(2);
                const happinessLevel = state.status.happiness.toFixed(2);
                text = `Water: ${waterLevel}% | Happiness: ${happinessLevel}%.`;
            }
            return [statusLabel, text, scoreText].join("\n");
        }
        createStatusLabel(state) {
            if (!this.lisaStatusService.isAlive(state)) {
                return "is dead";
            }
            const relativeIndex = this.lisaStatusService.calculateRelativeIndex(state);
            if (relativeIndex > 0.666) {
                return "doing great";
            }
            else if (relativeIndex > 0.333) {
                return "doing fine";
            }
            return "close to dying";
        }
        createScoreText(state) {
            const lifetimeLabel = this.lisaStatusService
                .getLifetime(state)
                .humanize();
            const highScoreLabel = state.bestLifetime.humanize();
            const currentLabel = this.lisaStatusService.isAlive(state)
                ? "Current lifetime"
                : "Lifetime";
            return `${currentLabel}: ${lifetimeLabel} | Best lifetime: ${highScoreLabel}.`;
        }
    };
    StatusTextService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.LisaStatusService)),
        __metadata("design:paramtypes", [StatusService_1.StatusService])
    ], StatusTextService);
    return StatusTextService;
})();
exports.StatusTextService = StatusTextService;
//# sourceMappingURL=StatusTextService.js.map