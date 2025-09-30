//node startGame.js 3 "../mortyBehavior/behavior.js:ClassicMorty"
//node startGame.js 3 "../mortyBehavior/behavior.js:LazyMorty"
//node startGame.js 3 "../mortyBehavior/behavior.js:AngryMorty"

import { MainGame } from "./src/mainGame/MainGame.js";
import { ArgumentValidator } from "./src/utils/argumentValidator.js";

try {
  const args = process.argv.slice(2);
  const { quantityBoxes, pathMorty } = await ArgumentValidator.checkArguments(
    args
  );

  const game = new MainGame(quantityBoxes, pathMorty);

  await game.start();
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
