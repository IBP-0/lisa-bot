const clapFn = (args) => args
    .get("text")
    .split(" ")
    .map(word => "**" + word.toUpperCase() + "**")
    .join(":clap:");
// Noinspection SpellCheckingInspection
const clap = {
    fn: clapFn,
    args: [
        {
            name: "text",
            required: true
        }
    ],
    alias: ["clapifier"],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Clap a text."
    }
};
export { clap };
//# sourceMappingURL=clap.js.map