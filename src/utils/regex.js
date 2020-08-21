const LettersRegex = new RegExp("^[a-zA-Z]+$")

export const areLetters = string => LettersRegex.test(string)