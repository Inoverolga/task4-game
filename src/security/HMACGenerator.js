import { KeyManager } from "./keyManager.js";
import { Protocol } from "./protocol.js";

export class HMACGenerator {
  constructor() {
    this.keyManager = new KeyManager();
    this.protocol = new Protocol();
  }

  async generateHMAC(quantityBoxes) {
    const secretKey = await this.keyManager.generateKey();
    const mortyValue = await this.keyManager.generateMorty(0, quantityBoxes);
    const hmacBuffer = this.protocol.calculateHMAC(mortyValue, secretKey);
    const hmacHex = this.protocol.toHex(hmacBuffer);

    return {
      secretKey,
      mortyValue,
      hmacHex,
    };
  }
}
