import readlineSync from "readline-sync";

export class UserInput {
  constructor() {}

  getUserInput(question = "") {
    return readlineSync.question(question);
  }

  validateInput(input, maxValue) {
    const userChoice = Number(input);
    const isValid =
      Number.isInteger(userChoice) && userChoice >= 0 && userChoice < maxValue;
    return {
      isValid,
      value: isValid ? userChoice : null,
    };
  }
}
