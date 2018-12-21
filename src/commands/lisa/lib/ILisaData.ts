import { Deaths } from "./Deaths";

interface ILisaData {
    status: {
        water: number;
        happiness: number;
    };
    life: {
        isAlive: boolean;
        killer: string;
        deathThrough: Deaths;
        birth: number;
        death: number;
    };
    score: {
        highScore: number;
    };
}

export { ILisaData };
