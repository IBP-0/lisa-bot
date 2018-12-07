const eachOption = (
    options: string[],
    letters: string[][],
    fn: (option: string, letter: string[], i: number) => void
): void => {
    let i = 0;

    while (i < options.length && i < letters.length) {
        fn(options[i], letters[i], i);

        i++;
    }
};

export { eachOption };
