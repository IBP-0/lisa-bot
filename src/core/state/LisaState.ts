import type { Duration } from "moment";

const WATER_INITIAL = 100;
const WATER_MIN = 0.1;
const WATER_MAX = 150;

const HAPPINESS_INITIAL = 100;
const HAPPINESS_MIN = 0.1;
const HAPPINESS_MAX = 100;

enum LisaDeathCause {
    DROWNING = "drowning",
    DEHYDRATION = "dehydration",
    SADNESS = "sadness",
    FIRE = "fire",
}

interface LisaState extends Record<string, unknown> {
    status: {
        water: number;
        happiness: number;
    };
    life: {
        time: Date;
        byUser: string;
    };
    death: {
        time: Date | null;
        byUser: string | null;
        cause: LisaDeathCause | null;
    };
    bestLifetime: Duration;
}

export {
    LisaState,
    LisaDeathCause,
    WATER_INITIAL,
    WATER_MIN,
    WATER_MAX,
    HAPPINESS_INITIAL,
    HAPPINESS_MIN,
    HAPPINESS_MAX,
};
