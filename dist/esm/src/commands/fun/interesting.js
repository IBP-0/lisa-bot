const INTERESTING_IMAGE_LINK = "https://media.giphy.com/media/KKtAZiNVEeU8/giphy.gif";
const interestingFn = () => {
    return {
        val: "Interesting.",
        files: [INTERESTING_IMAGE_LINK]
    };
};
const interesting = {
    fn: interestingFn,
    args: [],
    alias: [],
    data: {
        hidden: false,
        usableInDMs: true,
        powerRequired: 0,
        help: "Declare something as interesting."
    }
};
export { interesting };
//# sourceMappingURL=interesting.js.map