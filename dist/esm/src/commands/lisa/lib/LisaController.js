import { InjectableType } from "chevronjs";
import { randItem } from "lightdash";
import { lisaChevron, LisaDiKeys } from "../../../di";
import { lisaLogby } from "../../../logger";
import { LisaStatusService } from "./LisaStatusService";
import { LisaStringifyService } from "./LisaStringifyService";
class LisaController {
    constructor(store, lisaStatusService, lisaStringifyService) {
        this.store = store;
        this.lisaStatusService = lisaStatusService;
        this.lisaStringifyService = lisaStringifyService;
        if (store.has(LisaController.STORE_KEY)) {
            LisaController.logger.info("Loading Lisa data from store.");
            this.lisaData = store.get(LisaController.STORE_KEY);
        }
        else {
            LisaController.logger.info("Creating new Lisa data.");
            this.lisaData = this.lisaStatusService.createNewLisa();
            this.save();
        }
    }
    performAction(username, modifierWater, modifierHappiness, textSuccess, textAlreadyDead) {
        if (!this.lisaData.life.isAlive) {
            return randItem(textAlreadyDead);
        }
        this.modify(username, modifierWater, modifierHappiness);
        return [randItem(textSuccess), this.stringifyStatus()].join("\n");
    }
    performKill(username, deathThrough, textSuccess, textAlreadyDead) {
        if (!this.lisaData.life.isAlive) {
            return randItem(textAlreadyDead);
        }
        this.lisaData = this.lisaStatusService.kill(this.lisaData, username, deathThrough);
        this.save();
        return [randItem(textSuccess), this.stringifyStatus()].join("\n");
    }
    modify(username, modifierWater, modifierHappiness) {
        this.lisaData = this.lisaStatusService.modify(this.lisaData, username, modifierWater, modifierHappiness);
        this.save();
    }
    stringifyStatus() {
        return this.lisaStringifyService.stringifyStatus(this.lisaData);
    }
    stringifyStatusShort() {
        return this.lisaStringifyService.stringifyStatusShort(this.lisaData);
    }
    isAlive() {
        return this.lisaData.life.isAlive;
    }
    createNewLisa() {
        LisaController.logger.debug("Creating new Lisa.");
        this.lisaData = this.lisaStatusService.createNewLisa(this.lisaData);
        this.save();
    }
    save() {
        this.store.set(LisaController.STORE_KEY, this.lisaData);
    }
}
LisaController.STORE_KEY = "lisa";
LisaController.logger = lisaLogby.getLogger(LisaController);
lisaChevron.set(InjectableType.FACTORY, [LisaDiKeys.STORAGE, LisaStatusService, LisaStringifyService], LisaController);
export { LisaController };
//# sourceMappingURL=LisaController.js.map