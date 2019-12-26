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
var LisaTimer_1;
Object.defineProperty(exports, "__esModule", { value: true });
const chevronjs_1 = require("chevronjs");
const rxjs_1 = require("rxjs");
const chevron_1 = require("../chevron");
const logger_1 = require("../logger");
const LisaStateController_1 = require("./LisaStateController");
let LisaTimer = LisaTimer_1 = class LisaTimer {
    constructor(lisaStateController) {
        this.lisaStateController = lisaStateController;
        this.timer = null;
    }
    start() {
        rxjs_1.interval(LisaTimer_1.TIMEOUT).subscribe(() => this.tick());
        LisaTimer_1.logger.info(`Started Lisa timer with an interval of ${LisaTimer_1.TIMEOUT}.`);
    }
    tick() {
        LisaTimer_1.logger.debug("Performing tick.");
        this.lisaStateController.modifyLisaStatus(LisaTimer_1.WATER_MODIFIER, LisaTimer_1.HAPPINESS_MODIFIER, LisaTimer_1.USER_TICK);
    }
};
LisaTimer.logger = logger_1.rootLogger.child({
    target: LisaTimer_1
});
LisaTimer.TIMEOUT = 60000;
LisaTimer.WATER_MODIFIER = -0.5;
LisaTimer.HAPPINESS_MODIFIER = -0.75;
LisaTimer.USER_TICK = "Time";
LisaTimer = LisaTimer_1 = __decorate([
    chevronjs_1.Injectable(chevron_1.chevron, {
        bootstrapping: chevronjs_1.DefaultBootstrappings.CLASS,
        dependencies: [LisaStateController_1.LisaStateController]
    }),
    __metadata("design:paramtypes", [LisaStateController_1.LisaStateController])
], LisaTimer);
exports.LisaTimer = LisaTimer;
