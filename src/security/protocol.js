import crypto from "crypto";

export class Protocol {
  calculateHMAC(mortyValue, secretKey, algorithm = "sha256") {
    return crypto
      .createHmac(algorithm, secretKey)
      .update(mortyValue.toString())
      .digest();
  }

  toHex(buffer) {
    return buffer.toString("hex").toUpperCase();
  }
}
