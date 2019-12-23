import { DefaultBootstrappings, Injectable } from "chevronjs";
import { chevron } from "../../chevron";
import { LisaState } from "../LisaState";

@Injectable(chevron, { bootstrapping: DefaultBootstrappings.CLASS })
class LisaTextService {
    public determineStatusLabel(state: LisaState) {
        return "foo";
    }
}

export { LisaTextService };
