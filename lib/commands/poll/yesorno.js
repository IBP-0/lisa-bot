"use strict";

const YESORNO_ICONS = [{
    emoji: ":white_check_mark:"
}, {
    emoji: ":negative_squared_cross_mark: "
}];
module.exports = function (args, msg) {
    const result = [];

    result.push(`${args.question}:`);
    result.push("Y/N?");

    return result.join("\n");
};
