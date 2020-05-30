"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateStorageService = void 0;
const moment_1 = require("moment");
const inversify_1 = require("inversify");
let StateStorageService = /** @class */ (() => {
    let StateStorageService = class StateStorageService {
        fromStorable(jsonState) {
            return {
                status: { ...jsonState.status },
                life: {
                    ...jsonState.life,
                    time: new Date(jsonState.life.time),
                },
                death: {
                    ...jsonState.death,
                    time: jsonState.death.time != null
                        ? new Date(jsonState.death.time)
                        : null,
                },
                bestLifetime: moment_1.duration(jsonState.bestLifetime),
            };
        }
        toStorable(state) {
            return {
                status: { ...state.status },
                life: {
                    ...state.life,
                    time: state.life.time.getTime(),
                },
                death: {
                    ...state.death,
                    time: state.death.time != null
                        ? state.death.time.getTime()
                        : null,
                },
                bestLifetime: state.bestLifetime.asMilliseconds(),
            };
        }
    };
    StateStorageService = __decorate([
        inversify_1.injectable()
    ], StateStorageService);
    return StateStorageService;
})();
exports.StateStorageService = StateStorageService;
//# sourceMappingURL=StateStorageService.js.map