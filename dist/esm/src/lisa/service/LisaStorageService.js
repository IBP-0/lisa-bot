var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DefaultBootstrappings, Injectable } from "chevronjs";
import { readJSON, writeJSON } from "fs-extra";
import { cloneDeep } from "lodash";
import { chevron } from "../../chevron";
let LisaStorageService = class LisaStorageService {
    async loadStoredState(path) {
        const storedState = await readJSON(path);
        return this.fromJson(storedState);
    }
    async storeState(path, state) {
        const jsonLisaState = this.toJson(state);
        return await writeJSON(path, jsonLisaState);
    }
    fromJson(jsonState) {
        const state = cloneDeep(jsonState);
        if (state.life.time != null) {
            state.life.time = new Date(state.life.time);
        }
        if (state.death.time != null) {
            state.death.time = new Date(state.death.time);
        }
        return state;
    }
    toJson(state) {
        const storedState = cloneDeep(state);
        if (storedState.life.time != null) {
            storedState.life.time = storedState.life.time.getTime();
        }
        if (storedState.death.time != null) {
            storedState.death.time = storedState.death.time.getTime();
        }
        return storedState;
    }
};
LisaStorageService = __decorate([
    Injectable(chevron, { bootstrapping: DefaultBootstrappings.CLASS })
], LisaStorageService);
export { LisaStorageService };
//# sourceMappingURL=LisaStorageService.js.map