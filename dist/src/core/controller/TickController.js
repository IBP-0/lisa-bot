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
exports.TickController = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const logger_1 = require("../../logger");
const inversify_1 = require("inversify");
let TickController = /** @class */ (() => {
    var TickController_1;
    let TickController = TickController_1 = class TickController {
        constructor() {
            this.tickObservable = this.createTickObservable();
            TickController_1.logger.debug(`Started Lisa timer with an interval of ${TickController_1.TIMEOUT}.`);
        }
        createTickObservable() {
            return rxjs_1.interval(TickController_1.TIMEOUT).pipe(operators_1.map(() => {
                TickController_1.logger.debug("Running tick.");
                return {
                    waterModifier: TickController_1.WATER_MODIFIER,
                    happinessModifier: TickController_1.HAPPINESS_MODIFIER,
                    byUser: TickController_1.USER_TICK,
                };
            }));
        }
    };
    TickController.logger = logger_1.rootLogger.child({
        target: TickController_1,
    });
    TickController.TIMEOUT = 60000;
    TickController.WATER_MODIFIER = -0.5;
    TickController.HAPPINESS_MODIFIER = -0.75;
    TickController.USER_TICK = "Time";
    TickController = TickController_1 = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], TickController);
    return TickController;
})();
exports.TickController = TickController;
//# sourceMappingURL=TickController.js.map