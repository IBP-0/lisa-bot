import type { DateTime, Duration } from "luxon";

export const WATER_INITIAL = 100;
export const WATER_MIN = 0.1;
export const WATER_MAX = 150;

export const HAPPINESS_INITIAL = 100;
export const HAPPINESS_MIN = 0.1;
export const HAPPINESS_MAX = 100;

export enum DeathCause {
	DROWNING = "drowning",
	DEHYDRATION = "dehydration",
	SADNESS = "sadness",
	FIRE = "fire",
}

export interface State {
	status: {
		water: number;
		happiness: number;
	};
	birth: {
		timestamp: DateTime; // UTC
		initiator: string;
	};
	death: {
		timestamp: DateTime | null; // UTC
		initiator: string | null;
		cause: DeathCause | null;
	};
	bestLifetimeDuration: Duration;
}
