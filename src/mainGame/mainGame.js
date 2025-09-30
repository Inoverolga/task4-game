import { LogicGame } from "./logicGame.js";
import { GameStatistics } from "../stat/stat.js";
import { UserInput } from "../utils/userInput.js";
import { print } from "../utils/print.js";

export class MainGame {
  constructor(quantityBoxes, pathMorty, mortyClass = null) {
    this.quantityBoxes = quantityBoxes;
    this.pathMorty = pathMorty;
    this.mortyClass = mortyClass;
    this.stat = new GameStatistics();
    this.userInput = new UserInput();
  }

  async start() {
    let playAgain = true;

    while (playAgain) {
      const logicGame = new LogicGame(this.quantityBoxes, this.pathMorty);
      const result = await logicGame.execute();

      this.stat.addRoundResult(result.rickWon, result.rickSwitched);

      const answer = this.userInput.getUserInput("").toLowerCase();
      playAgain = answer === "yes";
    }

    console.log("\n                    GAME STATS ");
    console.log(this.stat.displayFinalStatistics(this.quantityBoxes));

    print("Press Enter to clear terminal and return to command line...");
    this.userInput.getUserInput("");
  }
}
