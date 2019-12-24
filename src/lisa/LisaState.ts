const WATER_INITIAL = 100;
const WATER_MIN = 0.1;
const WATER_MAX = 150;

const HAPPINESS_INITIAL = 100;
const HAPPINESS_MIN = 0.1;
const HAPPINESS_MAX = 100;

const USER_SYSTEM = "System";

enum LisaDeathCause {
    UNKNOWN = "something unknown",
    DROWNING = "drowning",
    DEHYDRATION = "dehydration",
    SADNESS = "sadness",
    FIRE = "fire"
}

interface LisaLife {
    time: Date;
    byUser: string;
}

interface LisaDeath {
    time: Date | null;
    byUser: string | null;
    cause: LisaDeathCause | null;
}

interface LisaState {
    status: {
        water: number;
        happiness: number;
    };
    life: LisaLife;
    death: LisaDeath;
    highScore: number;
}

export {
    LisaState,
    LisaLife,
    LisaDeath,
    LisaDeathCause,
    WATER_INITIAL,
    WATER_MIN,
    WATER_MAX,
    HAPPINESS_INITIAL,
    HAPPINESS_MIN,
    HAPPINESS_MAX,
    USER_SYSTEM
};
