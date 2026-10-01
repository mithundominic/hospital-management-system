// Responsibility: ECDH-ES encryption for FHIR bundles per ABDM spec

import {
  diffieHellman,
  generateKeyPairSync,
  createCipheriv,
  randomBytes,
  createHash,
  KeyObject,
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
   * Encrypt FHIR bundle using X25519 ECDH with HIU's public key
   * @param bundleJson - Stringified FHIR bundle
   * @param hiuPublicKeyBase64 - HIU's X25519 public key from consent artifact
   */
  static encrypt(
    bundleJson: string,
    hiuPublicKeyBase64: string,
  ): EncryptedData {
    // Generate X25519 keypair
    const { privateKey, publicKey } = generateKeyPairSync("x25519", {
      privateKeyEncoding: { type: "pkcs8", format: "der" },
      publicKeyEncoding: { type: "spki", format: "der" },
    });

    // Import HIU public key
    const hiuKeyBuffer = Buffer.from(hiuPublicKeyBase64, "base64");
    const hiuKey = {
      asymmetricKeyType: "x25519",
      export: () => hiuKeyBuffer,
    } as KeyObject;

    const myPrivateKey = {
      asymmetricKeyType: "x25519",
      export: () => privateKey,
    } as KeyObject;

    // Compute shared secret using X25519
    const sharedSecret = diffieHellman({
      privateKey: myPrivateKey,
      publicKey: hiuKey,
    });

    const kek = createHash("sha256").update(sharedSecret).digest();

    const nonce = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", kek, nonce);

    const ciphertextBuffer = Buffer.concat([
      cipher.update(bundleJson, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    const encryptedWithTag = Buffer.concat([
      ciphertextBuffer,
      authTag,
    ]).toString("base64");

    return {
      encryptedData: encryptedWithTag,
      keyMaterial: {
        cryptoAlg: "ECDH",
        curve: "Curve25519",
        dhPublicKey: {
          keyValue: (publicKey as Buffer).toString("base64"),
          parameters: "Curve25519",
        },
        nonce: nonce.toString("base64"),
      },
    };
  }
}
