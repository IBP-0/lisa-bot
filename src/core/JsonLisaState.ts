import type { LisaDeathCause } from "./LisaState";

interface JsonLisaState extends Record<string, unknown> {
    status: {
        water: number;
        happiness: number;
    };
    life: {
        time: number;
        byUser: string;
    };
    death: {
        time: number | null;
        byUser: string | null;
        cause: LisaDeathCause | null;
    };
    bestLifetime: number;
}

export { JsonLisaState };
