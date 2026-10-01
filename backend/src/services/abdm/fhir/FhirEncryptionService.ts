// Responsibility: ECDH-ES encryption for FHIR bundles per ABDM spec

import {
  createECDH,
  createCipheriv,
  randomBytes,
  createHash,
} from "crypto";

interface EncryptedData {
  encryptedData: string;
  keyMaterial: {
    cryptoAlg: string;
    curve: string;
    dhPublicKey: {
      keyValue: string;
      parameters: string;
    };
    nonce: string;
  };
}

export class FhirEncryptionService {
  /**
   * Encrypt FHIR bundle using ECDH-ES with HIU's public key
   * @param bundleJson - Stringified FHIR bundle
   * @param hiuPublicKeyPem - HIU's X25519 public key from consent artifact
   */
  static encrypt(bundleJson: string, hiuPublicKeyPem: string): EncryptedData {
    const ecdh = createECDH("prime256v1");
    ecdh.generateKeys();

    const sharedSecret = ecdh.computeSecret(
      Buffer.from(hiuPublicKeyPem, "base64"),
    );

    const kek = createHash("sha256").update(sharedSecret).digest();

    const nonce = randomBytes(16);
    const cipher = createCipheriv("aes-256-gcm", kek, nonce);

    let encrypted = cipher.update(bundleJson, "utf8", "base64");
    encrypted += cipher.final("base64");

    const authTag = cipher.getAuthTag();
    const encryptedWithTag = encrypted + authTag.toString("base64");

    return {
      encryptedData: encryptedWithTag,
      keyMaterial: {
        cryptoAlg: "ECDH",
        curve: "Curve25519",
        dhPublicKey: {
          keyValue: ecdh.getPublicKey("base64"),
          parameters: "Curve25519",
        },
        nonce: nonce.toString("base64"),
      },
    };
  }
}
