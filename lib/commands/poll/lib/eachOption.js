"use strict";

module.exports = (options, letters, fn) => {
    let i = 0;

    while (i < options.length && i < letters.length) {
        fn(options[i], letters[i], i);

        i++;
    }
};
