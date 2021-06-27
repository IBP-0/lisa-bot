/* eslint-disable @typescript-eslint/naming-convention */
import { duration } from "moment";
import type { DeathCause, State } from "./State";

import { inject, injectable } from "inversify";
import { PersistenceProvider } from "../PersistenceProvider";
import { TYPES } from "../../types";
import { rootLogger } from "../../logger";

interface StateRow {
    readonly id: number;

    readonly current_water: number;
    readonly current_happiness: number;

    readonly birth_timestamp: number;
    readonly birth_initiator: string;

    readonly death_timestamp: number | null;
    readonly death_initiator: string | null;
    readonly death_cause: string | null;

    readonly best_lifetime_duration: number;
}

const GLOBAL_STATE_ID = 1;

@injectable()
export class StateRepository {
    private static readonly logger = rootLogger.child({
        target: StateRepository,
    });

    readonly #storageProvider: PersistenceProvider;

    constructor(
        @inject(TYPES.PersistenceProvider) storageProvider: PersistenceProvider
    ) {
        this.#storageProvider = storageProvider;
    }

    public async count(): Promise<number> {
        const database = this.#storageProvider.getDb()!;
        const countResult = await database.get<{ "COUNT(*)": number }>(
            "SELECT COUNT(*) FROM lisa_state"
        );
        if (countResult == null) {
            throw new TypeError("Could not count rows!");
        }
        return countResult["COUNT(*)"];
    }

    public async insert(state: State): Promise<void> {
        const database = this.#storageProvider.getDb()!;
        StateRepository.logger.silly(
            `Inserting lisa state: ${JSON.stringify(state)}.`
        );
        const serializedParams = this.#serializeStateToParameters(state);
        StateRepository.logger.silly(
            `Serialized lisa state: ${JSON.stringify(serializedParams)}.`
        );
        await database.run(
            `
                INSERT INTO lisa_state(id, current_water, current_happiness, birth_timestamp,
                                       birth_initiator,
                                       death_timestamp, death_initiator, death_cause,
                                       best_lifetime_duration)
                VALUES (:id, :current_water, :current_happiness, :birth_timestamp, :birth_initiator,
                        :death_timestamp,
                        :death_initiator, :death_cause, :best_lifetime_duration)
            `,
            {
                ":id": GLOBAL_STATE_ID,
                ...serializedParams,
            }
        );
        StateRepository.logger.silly(`Inserted lisa state.`);
    }

    public async update(state: State): Promise<void> {
        const database = this.#storageProvider.getDb()!;
        StateRepository.logger.silly(
            `Updating lisa state: ${JSON.stringify(state)}.`
        );
        const serializedParams = this.#serializeStateToParameters(state);
        StateRepository.logger.silly(
            `Serialized lisa state: ${JSON.stringify(serializedParams)}.`
        );
        await database.run(
            `
                UPDATE lisa_state
                SET current_water=:current_water,
                    current_happiness=:current_happiness,
                    birth_timestamp=:birth_timestamp,
                    birth_initiator=:birth_initiator,
                    death_timestamp=:death_timestamp,
                    death_initiator=:death_initiator,
                    death_cause=:death_cause,
                    best_lifetime_duration=:best_lifetime_duration
                WHERE id = :id
            `,
            {
                ":id": GLOBAL_STATE_ID,
                ...serializedParams,
            }
        );
        StateRepository.logger.silly(`Updated lisa state.`);
    }

    public async select(): Promise<State> {
        const database = this.#storageProvider.getDb()!;

        StateRepository.logger.silly(`Loading lisa state.`);
        const stateRow = await database.get<StateRow>(
            `
                SELECT id,
                       current_water,
                       current_happiness,
                       birth_timestamp,
                       birth_initiator,
                       death_timestamp,
                       death_initiator,
                       death_cause,
                       best_lifetime_duration
                FROM lisa_state
                WHERE id = :id
            `,
            { ":id": GLOBAL_STATE_ID }
        );
        if (stateRow == null) {
            throw new TypeError("No state found!");
        }
        StateRepository.logger.silly(
            `Deserializing lisa state: '${JSON.stringify(stateRow)}'.`
        );
        const state = this.#deserializeState(stateRow);
        StateRepository.logger.silly(
            `Loaded lisa state: '${JSON.stringify(state)}'.`
        );
        return state;
    }

    #serializeStateToParameters(
        state: State
    ): Record<string, string | number | null> {
        return {
            ":current_water": state.status.water,
            ":current_happiness": state.status.happiness,

            ":birth_timestamp": state.birth.timestamp.getTime(),
            ":birth_initiator": state.birth.initiator,

            ":death_timestamp": state.death.timestamp?.getTime() ?? null,
            ":death_initiator": state.death.initiator,
            ":death_cause": state.death.cause,

            ":best_lifetime_duration":
                state.bestLifetimeDuration.asMilliseconds(),
        };
    }

    #deserializeState(stateRow: StateRow): State {
        return {
            status: {
                water: stateRow.current_water,
                happiness: stateRow.current_happiness,
            },
            birth: {
                timestamp: new Date(stateRow.birth_timestamp),
                initiator: stateRow.birth_initiator,
            },
            death: {
                timestamp:
                    stateRow.death_timestamp != null
                        ? new Date(stateRow.death_timestamp)
                        : null,
                initiator: stateRow.death_initiator,
                cause: stateRow.death_cause as DeathCause,
            },
            bestLifetimeDuration: duration(stateRow.best_lifetime_duration),
        };
    }
}
