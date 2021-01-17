/* eslint-disable @typescript-eslint/naming-convention */
import { duration } from "moment";
import type { LisaDeathCause, LisaState } from "./LisaState";

import { inject, injectable } from "inversify";
import type { PersistenceProvider } from "../PersistenceProvider";
import { TYPES } from "../../types";

interface LisaStateRow {
    readonly current_water: number;
    readonly current_happiness: number;

    readonly birth_timestamp: number;

    readonly death_timestamp: number | null;
    readonly death_cause: string | null;

    readonly best_lifetime_duration: number;
}

@injectable()
export class LisaStateRepository {
    private readonly storageProvider: PersistenceProvider;

    constructor(
        @inject(TYPES.PersistenceProvider) storageProvider: PersistenceProvider
    ) {
        this.storageProvider = storageProvider;
    }

    public async count(): Promise<number> {
        const database = this.storageProvider.getDb()!;
        const countResult = await database.get<{ "COUNT(*)": number }>(
            "SELECT COUNT(*) FROM lisa_state"
        );
        return countResult?.["COUNT(*)"] ?? 0;
    }

    public async insert(state: LisaState): Promise<void> {
        const database = this.storageProvider.getDb()!;

        await database.run(
            "INSERT INTO lisa_state(current_water, current_happiness, birth_timestamp, death_timestamp, death_cause, best_lifetime_duration) VALUES(:current_water, :current_happiness, :birth_timestamp, :death_timestamp, :death_cause, :best_lifetime_duration)",
            this.serializeStateToParameters(state)
        );
    }

    public async update(state: LisaState): Promise<void> {
        const database = this.storageProvider.getDb()!;
        await database.run(
            "UPDATE lisa_state SET current_water=:current_water, current_happiness=:current_happiness, birth_timestamp=:birth_timestamp, death_timestamp=:death_timestamp, death_cause=:death_cause, best_lifetime_duration=:best_lifetime_duration WHERE id = 1",
            this.serializeStateToParameters(state)
        );
    }

    public async load(): Promise<LisaState> {
        const database = this.storageProvider.getDb()!;
        const lisaStateRow = await database.get<LisaStateRow>(
            "SELECT current_water, current_happiness, birth_timestamp, death_timestamp, death_cause, best_lifetime_duration FROM lisa_state WHERE id = 1"
        );
        if (lisaStateRow == null) {
            throw new TypeError("No state found!");
        }
        return this.deserializeState(lisaStateRow);
    }

    private serializeStateToParameters(
        state: LisaState
    ): Record<string, string | number | null> {
        return {
            ":current_water": state.status.water,
            ":current_happiness": state.status.happiness,

            ":birth_timestamp": state.life.time.getMilliseconds(),

            ":death_timestamp": state.death.time?.getMilliseconds() ?? null,
            ":death_cause": state.death.cause,

            ":best_lifetime_duration": state.bestLifetime.asMilliseconds(),
        };
    }

    private deserializeState(lisaStateRow: LisaStateRow): LisaState {
        return {
            status: {
                water: lisaStateRow.current_water,
                happiness: lisaStateRow.current_happiness,
            },
            life: {
                time: new Date(lisaStateRow.birth_timestamp),
                byUser: "NONE",
            },
            death: {
                time:
                    lisaStateRow.death_timestamp != null
                        ? new Date(lisaStateRow.death_timestamp)
                        : null,
                byUser: "NONE",
                cause: lisaStateRow.death_cause as LisaDeathCause,
            },
            bestLifetime: duration(lisaStateRow.best_lifetime_duration),
        };
    }
}
