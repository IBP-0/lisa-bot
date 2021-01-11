import { duration } from "moment";
import { LisaState } from "../LisaState";
import { injectable } from "inversify";
import { JsonLisaState } from "../JsonLisaState";

@injectable()
class StateStorageService {
    public fromStorable(jsonState: JsonLisaState): LisaState {
        return {
            status: { ...jsonState.status },
            life: {
                ...jsonState.life,
                time: new Date(jsonState.life.time),
            },
            death: {
                ...jsonState.death,
                time:
                    jsonState.death.time != null
                        ? new Date(jsonState.death.time)
                        : null,
            },
            bestLifetime: duration(jsonState.bestLifetime),
        };
    }

    public toStorable(state: LisaState): JsonLisaState {
        return {
            status: { ...state.status },
            life: {
                ...state.life,
                time: state.life.time.getTime(),
            },
            death: {
                ...state.death,
                time:
                    state.death.time != null
                        ? state.death.time.getTime()
                        : null,
            },
            bestLifetime: state.bestLifetime.asMilliseconds(),
        };
    }
}

export { StateStorageService };
