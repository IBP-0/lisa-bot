"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const moment_1 = require("moment");
const inversify_1 = require("inversify");
let LisaStateStorageService = class LisaStateStorageService {
    fromStorable(jsonState) {
        const state = lodash_1.cloneDeep(jsonState);
        if (state.life.time != null) {
            state.life.time = new Date(state.life.time);
        }
        if (state.death.time != null) {
            state.death.time = new Date(state.death.time);
        }
        state.bestLifetime = moment_1.duration(state.bestLifetime);
        return state;
    }
    toStorable(state) {
        const storedState = lodash_1.cloneDeep(state);
        if (storedState.life.time != null) {
            storedState.life.time = storedState.life.time.getTime();
        }
        if (storedState.death.time != null) {
            storedState.death.time = storedState.death.time.getTime();
        }
        storedState.bestLifetime = state.bestLifetime.asMilliseconds();
        return storedState;
    }
};
LisaStateStorageService = __decorate([
    inversify_1.injectable()
], LisaStateStorageService);
exports.LisaStateStorageService = LisaStateStorageService;
