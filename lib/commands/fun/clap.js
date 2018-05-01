"use strict";

module.exports = args =>
    args.text
    .split(" ")
    .map(word => "**" + word.toUpperCase() + "**")
    .join(":clap:");
