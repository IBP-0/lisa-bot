"use strict";

const MAX_WATER = 100;
const MAX_HAPPINESS = 100;
const FACTOR = (MAX_WATER + MAX_HAPPINESS) / 2;

const getLifeTime = (statusCurrent, until) => until - statusCurrent.birth;

const statusToNumber = statusCurrent => {
    if (statusCurrent.isAlive) {
        const relWater = statusCurrent.water / MAX_WATER;
        const relHappiness = statusCurrent.happiness / MAX_HAPPINESS;

        return relWater * relHappiness * FACTOR;
    }

    return 0;
};

module.exports = {
    getLifeTime,
    statusToNumber
};
