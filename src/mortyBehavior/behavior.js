import { print } from "../utils/print.js";

export class MortyBehavior {
  constructor(quantityBoxes, boxesToRemove = 0, mortyValue) {
    this.quantityBoxes = quantityBoxes;
    this.boxesToRemove = boxesToRemove;
    this.mortyValue = mortyValue;
  }
  getBox(rickWasRight) {
    print(`You portal gun is in the box ${this.mortyValue}`);
    return this.mortyValue;
  }
  chooseBoxes(rickWasRight, rickAnswerTwo) {
    return {
      leaveBox: this.getBox(rickWasRight),
      secondBox: rickAnswerTwo,
    };
  }
}

export class ClassicMorty extends MortyBehavior {
  constructor(quantityBoxes, answerRick, mortyValue) {
    super(quantityBoxes, 0, mortyValue);
    this.answerRick = answerRick;
    this.generatedRandomBox = null;
  }

  getBox(rickWasRight) {
    this.generatedRandomBox = this.generateRandomBox(this.answerRick);
    return rickWasRight ? this.generatedRandomBox : this.mortyValue;
  }

  generateRandomBox(answerRick) {
    let randomBox;
    do {
      randomBox = Math.floor(Math.random() * this.quantityBoxes);
    } while (randomBox === answerRick || randomBox === this.mortyValue);
    return randomBox;
  }
}

export class LazyMorty extends MortyBehavior {
  constructor(quantityBoxes, answerRick, mortyValue) {
    super(quantityBoxes, 0, mortyValue);
    this.answerRick = answerRick;
  }
  chooseBoxes(rickWasRight, rickAnswerTwo) {
    const { otherBox } = this.findBoxesToKeep();
    return {
      leaveBox: otherBox,
      secondBox: this.mortyValue,
    };
  }

  findBoxesToKeep() {
    const keptBoxes = [];

    for (let i = 0; i < this.quantityBoxes; i++) {
      if (i === this.mortyValue) {
        keptBoxes.push(i);
      } else if (keptBoxes.length < 2) {
        keptBoxes.push(i);
      }

      if (keptBoxes.length === 2) break;
    }

    if (!keptBoxes.includes(this.mortyValue)) {
      keptBoxes[1] = this.mortyValue;
    }

    const otherBox = keptBoxes.find((box) => box !== this.mortyValue);

    return {
      gunBox: this.mortyValue,
      otherBox,
    };
  }

  getBox(rickWasRight) {
    return this.mortyValue;
  }
}
