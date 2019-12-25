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
Object.defineProperty(exports, "__esModule", { value: true });
const chevronjs_1 = require("chevronjs");
const chevron_1 = require("../../chevron");
const LisaStatusService_1 = require("./LisaStatusService");
let LisaTextService = class LisaTextService {
    constructor(lisaStatusService) {
        this.lisaStatusService = lisaStatusService;
    }
    determineStatusLabel(state) {
        if (!this.lisaStatusService.isAlive(state)) {
            return "is dead.";
        }
        const relativeIndex = this.lisaStatusService.calculateRelativeIndex(state);
        if (relativeIndex > 0.666) {
            return "doing great.";
        }
        else if (relativeIndex > 0.333) {
            return "doing fine.";
        }
        return "close to dying.";
    }
};
LisaTextService = __decorate([
    chevronjs_1.Injectable(chevron_1.chevron, {
        bootstrapping: chevronjs_1.DefaultBootstrappings.CLASS,
        dependencies: [LisaStatusService_1.LisaStatusService]
    }),
    __metadata("design:paramtypes", [LisaStatusService_1.LisaStatusService])
], LisaTextService);
exports.LisaTextService = LisaTextService;
