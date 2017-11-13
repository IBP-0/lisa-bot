"use strict";

module.exports = (a, b) => {
    const a_lower = a.trim().toLowerCase();
    const b_lower = b.trim().toLowerCase();

    if (a_lower < b_lower) {
        return -1;
    } else if (a_lower > b_lower) {
        return 1;
    } else {
        return 0;
    }
};
