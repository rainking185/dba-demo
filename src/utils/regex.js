const LettersRegex = new RegExp("^[a-zA-Z]+$")

export const areLetters = (string) => {
  return LettersRegex.test(string)
}