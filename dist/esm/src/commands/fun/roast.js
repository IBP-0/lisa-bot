const roastFn = () => {
    return "Respects have been paid.";
};
const roast = {
    fn: roastFn,
    args: [
        {
            name: "target",
            required: true
        }
    ],
    alias: ["roasted"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Roast someone."
    }
};
export { roast };
//# sourceMappingURL=roast.js.map