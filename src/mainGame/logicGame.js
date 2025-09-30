import { HMACGenerator } from "../security/HMACGenerator.js";
import { UserInput } from "../utils/userInput.js";
import { print } from "../utils/print.js";

export class LogicGame {
  constructor(quantityBoxes, pathMorty) {
    console.log(
      "LogicGame constructor - pathMorty:",
      pathMorty,
      "type:",
      typeof pathMorty
    );

    this.quantityBoxes = quantityBoxes;
    const [path, classMorty] = pathMorty.split(":");
    this.pathMorty = path; //../mortyBehavior/behavior.js
    this.pathBehaviorMorty = classMorty; // ClassicMorty/LazyMorty/...
    this.hmacGenerator = new HMACGenerator();
    this.userInput = new UserInput();
    this.secretsMorty = null;
  }

  async getRickAnswer(msg = "Rick:  ") {
    let validation;
    let input;
    do {
      input = this.userInput.getUserInput(msg);

      validation = this.userInput.validateInput(input, this.quantityBoxes);
      if (!validation.isValid) {
        print(
          `There is no box ${input}, please choose between 0 and ${
            this.quantityBoxes - 1
          }`
        );
      }
    } while (!validation.isValid);
    return validation.value;
  }

  calculateFinalResult(mortyValue, rickValue, quantityBoxes) {
    return (mortyValue + rickValue) % quantityBoxes;
  }

  checkFairPlay(
    mortyBehavior,
    mortyFinalBox,
    rickAnswerTwo,
    originalMortyValue
  ) {
    return mortyBehavior.constructor.name === "ClassicMorty"
      ? this.calculateFinalResult(
          mortyBehavior.generatedRandomBox,
          rickAnswerTwo,
          this.quantityBoxes
        ) === mortyFinalBox
      : mortyFinalBox === originalMortyValue;
  }

  showLastSecret() {
    if (!this.secretsMorty)
      return print("No game data available. Play a round first!");
    print("=== SECRET INFO ===");
    print(`Original morty value: ${this.secretsMorty.mortyValue}`);
    print(`Final result: ${this.secretsMorty.mortyFinalBox}`);
    print(
      `Secret key: ${this.secretsMorty.secretKey.toString("hex").toUpperCase()}`
    );
  }

  async execute() {
    const behaviorFile = await import(this.pathMorty);
    const behaviorClass = behaviorFile[this.pathBehaviorMorty];

    print(
      `Oh geez, Rick, I'm gonna hide your portal gun in one of the ${this.quantityBoxes} boxes, okay? `
    );
    const HMAC1 = await this.hmacGenerator.generateHMAC(this.quantityBoxes, 0);
    print(`HMAC1=${HMAC1.hmacHex}`);
    print(
      ` Rick, enter your number [0,${this.quantityBoxes}) so you don’t whine later that I cheated, alright?  `
    );
    const rickAnswerFirst = await this.getRickAnswer();
    print(
      `Okay, okay, I hid the gun. What’s your guess [0,${this.quantityBoxes})? `
    );
    const rickAnswerTwo = await this.getRickAnswer();
    print(
      `Let’s, uh, generate another value now, I mean, to select a box to keep in the game.`
    );
    const gunBox = this.calculateFinalResult(
      HMAC1.mortyValue,
      rickAnswerTwo,
      this.quantityBoxes
    );
    const rickWasRight = rickAnswerTwo === HMAC1.mortyValue;
    const mortyBehavior = new behaviorClass(
      this.quantityBoxes,
      rickAnswerTwo,
      HMAC1.mortyValue
    );

    const { leaveBox, secondBox } = mortyBehavior.chooseBoxes(
      rickWasRight,
      rickAnswerTwo
    );

    const HMAC2 = await this.hmacGenerator.generateHMAC(this.quantityBoxes - 1);
    print(`HMAC2=${HMAC2.hmacHex}`);
    print(
      `Rick, enter your number [0,${
        this.quantityBoxes - 1
      }), and, uh, don’t say I didn’t play fair, okay?  `
    );
    const rickAnswerTree = await this.getRickAnswer();
    if (mortyBehavior.constructor.name === "LazyMorty") {
      print(
        `I'm keeping the box with the portal gun (${secondBox}), and the box ${leaveBox}.`
      );
    } else {
      print(
        `I'm keeping the box you chose, I mean ${secondBox}, and the box ${leaveBox}.`
      );
    }
    print(
      `You can switch your box (enter 0), or, you know, stick with it (enter 1)`
    );
    const rickAnswerFinal = await this.getRickAnswer();
    const rickFinalBox = rickAnswerFinal === 0 ? leaveBox : rickAnswerTwo;
    print(`Aww man, my 1st random value is ${HMAC1.mortyValue}`);
    print(`KEY1=${HMAC1.secretKey.toString("hex")}`);

    const firstFairNumber = this.calculateFinalResult(
      HMAC1.mortyValue,
      rickAnswerTwo,
      this.quantityBoxes
    );
    const secondFairNumber = this.calculateFinalResult(
      HMAC2.mortyValue,
      rickAnswerTree,
      2
    );
    print(
      `So the 1st fair number is (${rickAnswerTwo} + ${HMAC1.mortyValue}) % ${this.quantityBoxes} = ${firstFairNumber}`
    );
    print(`Aww man, my 2nd random value is ${HMAC2.mortyValue}`);
    print(`KEY2=${HMAC2.secretKey.toString("hex")}`);

    print(
      `Uh, okay, the 2nd fair number is (${rickAnswerTree} + ${HMAC2.mortyValue}) % 2 = ${secondFairNumber}`
    );
    print(`You portal gun is in the box ${gunBox}`);

    const rickWon = gunBox === rickFinalBox;

    if (rickWon) {
      print(`Aww man, you won!`);
    } else {
      print(
        `Aww man, you lost, Rick. Now we gotta go on one of *my* adventures!`
      );
    }
    const rickSwitched = rickAnswerFinal === 0;

    this.secretsMorty = {
      secretKey: HMAC1.secretKey,
      mortyValue: HMAC1.mortyValue,
      mortyFinalBox: gunBox,
    };
    return {
      rickSwitched,
      rickWon,
    };
  }
}
