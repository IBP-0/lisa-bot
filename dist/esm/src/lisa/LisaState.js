const WATER_INITIAL = 100;
const WATER_MIN = 0.1;
const WATER_MAX = 150;
const HAPPINESS_INITIAL = 100;
const HAPPINESS_MIN = 0.1;
const HAPPINESS_MAX = 100;
const USER_SYSTEM = "System";
var LisaDeathCause;
(function (LisaDeathCause) {
    LisaDeathCause["UNKNOWN"] = "something unknown";
    LisaDeathCause["DROWNING"] = "drowning";
    LisaDeathCause["DEHYDRATION"] = "dehydration";
    LisaDeathCause["SADNESS"] = "sadness";
    LisaDeathCause["FIRE"] = "fire";
})(LisaDeathCause || (LisaDeathCause = {}));
export { LisaDeathCause, WATER_INITIAL, WATER_MIN, WATER_MAX, HAPPINESS_INITIAL, HAPPINESS_MIN, HAPPINESS_MAX, USER_SYSTEM };
//# sourceMappingURL=LisaState.js.map