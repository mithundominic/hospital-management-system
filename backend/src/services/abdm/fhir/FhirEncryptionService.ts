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
    const ephemeralKeys = generateKeyPairSync("x25519");
    const hiuPublicKey = this.importX25519PublicKey(hiuPublicKeyBase64);

    const sharedSecret = diffieHellman({
      privateKey: ephemeralKeys.privateKey,
      publicKey: hiuPublicKey,
    });

    const kek = createHash("sha256").update(sharedSecret).digest();

    const nonce = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", kek, nonce);

    const ciphertext = Buffer.concat([
      cipher.update(bundleJson, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    const encryptedWithTag = Buffer.concat([ciphertext, authTag]).toString(
      "base64",
    );

    return {
      encryptedData: encryptedWithTag,
      keyMaterial: {
        cryptoAlg: "ECDH",
        curve: "Curve25519",
        dhPublicKey: {
          keyValue: this.exportX25519PublicKey(ephemeralKeys.publicKey),
          parameters: "Curve25519",
        },
        nonce: nonce.toString("base64"),
      },
    };
  }

  private static importX25519PublicKey(base64Key: string): KeyObject {
    const keyBuffer = Buffer.from(base64Key, "base64");
    return {
      asymmetricKeyType: "x25519",
      export: () => keyBuffer,
    } as KeyObject;
  }

  private static exportX25519PublicKey(publicKey: KeyObject): string {
    return publicKey.export({ type: "spki", format: "der" }).toString("base64");
  }
}
