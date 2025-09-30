export class ArgumentValidator {
  static async checkArguments(args) {
    if (args.length < 2) {
      throw new Error(`Enter the two required arguments:
- First: number of boxes (example: 3)
- Second: file path (example: "./morty.js:classMorty")`);
    }

    const quantityBoxes = Number(args[0]);
    const pathMorty = args[1];

    if (!Number.isInteger(quantityBoxes) || quantityBoxes < 2) {
      throw new Error("The number of boxes must be an integer greater than 2");
    }

    const [path, classMorty] = pathMorty.split(":");

    if (!path || !classMorty) {
      throw new Error('Use format: "path.js:ClassName"');
    }
    if (!(await import(path))[classMorty]) {
      throw new Error(`Class "${classMorty}" not found`);
    }

    return { quantityBoxes, pathMorty };
  }
}
