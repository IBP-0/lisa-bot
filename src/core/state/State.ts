import type { Duration } from "moment";

const WATER_INITIAL = 100;
const WATER_MIN = 0.1;
const WATER_MAX = 150;

const HAPPINESS_INITIAL = 100;
const HAPPINESS_MIN = 0.1;
const HAPPINESS_MAX = 100;

enum DeathCause {
    DROWNING = "drowning",
    DEHYDRATION = "dehydration",
    SADNESS = "sadness",
    FIRE = "fire",
}

interface State {
    status: {
        water: number;
        happiness: number;
    };
    birth: {
        timestamp: Date;
        initiator: string;
    };
    death: {
        timestamp: Date | null;
        initiator: string | null;
        cause: DeathCause | null;
    };
    bestLifetimeDuration: Duration;
}

export {
    State,
    DeathCause,
    WATER_INITIAL,
    WATER_MIN,
    WATER_MAX,
    HAPPINESS_INITIAL,
    HAPPINESS_MIN,
    HAPPINESS_MAX,
};
