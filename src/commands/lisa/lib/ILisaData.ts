import { Death } from "./Death";

interface ILisaData {
    status: {
        water: number;
        happiness: number;
    };
    life: {
        isAlive: boolean;
        killer: string;
        deathThrough: Death;
        birth: number;
        death: number;
    };
    score: {
        highScore: number;
    };
}

export { ILisaData };
