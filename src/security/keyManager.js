import crypto from "crypto";

export class KeyManager {
  constructor() {}

  async generateKey(bits = 256) {
    if (bits < 256) {
      throw new Error("Key length < 256 bits");
    }
    return crypto.randomBytes(Math.ceil(bits / 8));
  }

  async generateMorty(min, max) {
    if (min >= max) {
      throw new Error("min must be less than max");
    }
    const mortyValue = crypto.randomInt(min, max);
    return mortyValue;
  }
}
