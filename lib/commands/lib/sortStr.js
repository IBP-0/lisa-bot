"use strict";

module.exports = (a, b) =>
    a
    .trim()
    .toLowerCase()
    .localeCompare(b.trim().toLowerCase());
