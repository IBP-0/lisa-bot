const UNICODE_POS_A = 0x1f1e6;
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

const createLetterEmoji = (letter: string): string => {
    const index = LETTERS.indexOf(letter.toLowerCase());

    if (index === -1) {
        throw new Error("Letter is not in range.");
    }

    return String.fromCodePoint(UNICODE_POS_A + index);
};

export { createLetterEmoji };
