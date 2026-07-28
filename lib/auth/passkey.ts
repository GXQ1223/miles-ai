import { timingSafeEqual } from "node:crypto";
import type { AuthenticatorTransportFuture, WebAuthnCredential } from "@simplewebauthn/server";
import { getSetupToken } from "./config.ts";

export const OWNER_SUBJECT = "owner";

export interface StoredPasskeyCredential {
  id: string; // base64url credential ID
  publicKey: string; // base64url-encoded COSE public key
  counter: number;
  transports?: AuthenticatorTransportFuture[];
}

function isStoredPasskeyCredential(value: unknown): value is StoredPasskeyCredential {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === "string" && typeof candidate.publicKey === "string" && typeof candidate.counter === "number";
}

// The credential lives in an env var, not a database, matching how this single-owner
// app has always stored its one auth secret (previously AUTH_PASSWORD_HASH).
export function getStoredCredential(): StoredPasskeyCredential | null {
  const raw = process.env.AUTH_PASSKEY_CREDENTIAL;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isStoredPasskeyCredential(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function toWebAuthnCredential(stored: StoredPasskeyCredential): WebAuthnCredential {
  return {
    id: stored.id,
    publicKey: new Uint8Array(Buffer.from(stored.publicKey, "base64url")),
    counter: stored.counter,
    transports: stored.transports
  };
}

export function serializeCredential(credential: WebAuthnCredential): StoredPasskeyCredential {
  return {
    id: credential.id,
    publicKey: Buffer.from(credential.publicKey).toString("base64url"),
    counter: credential.counter,
    transports: credential.transports
  };
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // Compare fixed-length digests first so differing input lengths don't short-circuit
  // timingSafeEqual (which requires equal-length buffers) and leak length via timing.
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export type RegistrationGate = { ok: true } | { ok: false; reason: string };

// Fail-closed bootstrap check: registration is only ever possible before any credential
// exists AND with the correct one-time setup token. Once a credential is stored, this
// permanently refuses further registration regardless of token — closing the bootstrap
// window for good, with no runtime override.
export function checkRegistrationGate(providedToken: string | null): RegistrationGate {
  if (getStoredCredential()) {
    return { ok: false, reason: "A passkey is already registered. Registration is permanently closed." };
  }

  const configuredToken = getSetupToken();
  if (!configuredToken) {
    return { ok: false, reason: "Setup is not enabled." };
  }

  if (!providedToken || !timingSafeStringEqual(providedToken, configuredToken)) {
    return { ok: false, reason: "Invalid setup token." };
  }

  return { ok: true };
}
