import crypto from "node:crypto";

/**
 * AES-256-GCM helpers for encrypting integration secrets (API keys, tokens)
 * before they are stored in IntegrationSetting.config.
 *
 * ENCRYPTION_KEY must be 64 hex chars (32 bytes). Generate with:
 *   openssl rand -hex 32
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // GCM standard
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be set to a 64-char hex string (32 bytes). Run: openssl rand -hex 32",
    );
  }
  return Buffer.from(hex, "hex");
}

/** Encrypt a UTF-8 string → base64 payload of `iv:authTag:ciphertext`. */
export function encrypt(plain: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString("base64");
}

/** Decrypt a payload produced by {@link encrypt}. */
export function decrypt(payload: string): string {
  const key = getKey();
  const data = Buffer.from(payload, "base64");
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
}

/**
 * Encrypt every value in a flat config object. Keys ending in a "public"
 * marker (e.g. keyId) can be left in clear by passing them in `skip`.
 */
export function encryptConfig(
  config: Record<string, unknown>,
  skip: string[] = [],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(config)) {
    out[k] =
      skip.includes(k) || typeof v !== "string" ? v : encrypt(v);
  }
  return out;
}

/** Inverse of {@link encryptConfig}. */
export function decryptConfig(
  config: Record<string, unknown>,
  skip: string[] = [],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(config)) {
    try {
      out[k] =
        skip.includes(k) || typeof v !== "string" ? v : decrypt(v);
    } catch {
      // Value wasn't encrypted (e.g. legacy/plain) — pass through.
      out[k] = v;
    }
  }
  return out;
}
