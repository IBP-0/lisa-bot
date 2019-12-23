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

export { LisaState, LisaLife, LisaDeath, LisaDeathCause };
