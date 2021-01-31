/* eslint-disable @typescript-eslint/naming-convention */
import { duration } from "moment";
import type { LisaDeathCause, LisaState } from "./LisaState";

import { inject, injectable } from "inversify";
import { PersistenceProvider } from "../PersistenceProvider";
import { TYPES } from "../../types";
import { rootLogger } from "../../logger";

interface LisaStateRow {
    readonly current_water: number;
    readonly current_happiness: number;

    readonly birth_timestamp: number;
    readonly birth_initiator: string;

    readonly death_timestamp: number | null;
    readonly death_initiator: string | null;
    readonly death_cause: string | null;

    readonly best_lifetime_duration: number;
}

@injectable()
export class LisaStateRepository {
    private static readonly logger = rootLogger.child({
        target: LisaStateRepository,
    });
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
        const serializedParams = this.serializeStateToParameters(state);
        LisaStateRepository.logger.silly(
            "Inserting lisa state.",
            serializedParams
        );
        await database.run(
            "INSERT INTO lisa_state(current_water, current_happiness, birth_timestamp, birth_initiator, death_timestamp, death_initiator, death_cause, best_lifetime_duration) VALUES(:current_water, :current_happiness, :birth_timestamp, :birth_initiator, :death_timestamp, :death_initiator,:death_cause, :best_lifetime_duration)",
            serializedParams
        );
    }

    public async update(state: LisaState): Promise<void> {
        const database = this.storageProvider.getDb()!;
        const serializedParams = this.serializeStateToParameters(state);
        LisaStateRepository.logger.silly(
            "Updating lisa state.",
            serializedParams
        );
        await database.run(
            "UPDATE lisa_state SET current_water=:current_water, current_happiness=:current_happiness, birth_timestamp=:birth_timestamp, birth_initiator=:birth_initiator, death_timestamp=:death_timestamp, death_initiator=:death_initiator, death_cause=:death_cause, best_lifetime_duration=:best_lifetime_duration WHERE id = 1",
            serializedParams
        );
    }

    public async load(): Promise<LisaState> {
        const database = this.storageProvider.getDb()!;
        const lisaStateRow = await database.get<LisaStateRow>(
            "SELECT current_water, current_happiness, birth_timestamp, birth_initiator, death_timestamp, death_initiator, death_cause, best_lifetime_duration FROM lisa_state WHERE id = 1"
        );
        if (lisaStateRow == null) {
            throw new TypeError("No state found!");
        }
        LisaStateRepository.logger.silly("Loading lisa state.", lisaStateRow);
        return this.deserializeState(lisaStateRow);
    }

    private serializeStateToParameters(
        state: LisaState
    ): Record<string, string | number | null> {
        return {
            ":current_water": state.status.water,
            ":current_happiness": state.status.happiness,

            ":birth_timestamp": state.birth.timestamp.getTime(),
            ":birth_initiator": state.birth.initiator,

            ":death_timestamp": state.death.timestamp?.getTime() ?? null,
            ":death_initiator": state.death.initiator,
            ":death_cause": state.death.cause,

            ":best_lifetime_duration": state.bestLifetimeDuration.asMilliseconds(),
        };
    }

    private deserializeState(lisaStateRow: LisaStateRow): LisaState {
        return {
            status: {
                water: lisaStateRow.current_water,
                happiness: lisaStateRow.current_happiness,
            },
            birth: {
                timestamp: new Date(lisaStateRow.birth_timestamp),
                initiator: lisaStateRow.birth_initiator,
            },
            death: {
                timestamp:
                    lisaStateRow.death_timestamp != null
                        ? new Date(lisaStateRow.death_timestamp)
                        : null,
                initiator: lisaStateRow.death_initiator,
                cause: lisaStateRow.death_cause as LisaDeathCause,
            },
            bestLifetimeDuration: duration(lisaStateRow.best_lifetime_duration),
        };
    }
}
