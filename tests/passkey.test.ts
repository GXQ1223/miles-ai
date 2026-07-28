import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkRegistrationGate,
  getStoredCredential,
  serializeCredential,
  toWebAuthnCredential,
  type StoredPasskeyCredential
} from "../lib/auth/passkey.ts";

function withEnv(vars: Record<string, string | undefined>, fn: () => void) {
  const previous: Record<string, string | undefined> = {};
  for (const key of Object.keys(vars)) {
    previous[key] = process.env[key];
    const value = vars[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    fn();
  } finally {
    for (const key of Object.keys(previous)) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("getStoredCredential returns null when unset", () => {
  withEnv({ AUTH_PASSKEY_CREDENTIAL: undefined }, () => {
    assert.equal(getStoredCredential(), null);
  });
});

test("getStoredCredential returns null for malformed JSON", () => {
  withEnv({ AUTH_PASSKEY_CREDENTIAL: "{not json" }, () => {
    assert.equal(getStoredCredential(), null);
  });
});

test("getStoredCredential returns null when required fields are missing", () => {
  withEnv({ AUTH_PASSKEY_CREDENTIAL: JSON.stringify({ id: "abc" }) }, () => {
    assert.equal(getStoredCredential(), null);
  });
});

test("getStoredCredential parses a valid stored credential", () => {
  const stored: StoredPasskeyCredential = { id: "abc", publicKey: "ZGVmZw", counter: 0 };
  withEnv({ AUTH_PASSKEY_CREDENTIAL: JSON.stringify(stored) }, () => {
    assert.deepEqual(getStoredCredential(), stored);
  });
});

test("serializeCredential and toWebAuthnCredential round-trip the public key bytes", () => {
  const original = {
    id: "credential-id",
    publicKey: new Uint8Array([1, 2, 3, 4, 250, 251]),
    counter: 7,
    transports: ["internal" as const]
  };

  const stored = serializeCredential(original);
  const restored = toWebAuthnCredential(stored);

  assert.equal(restored.id, original.id);
  assert.equal(restored.counter, original.counter);
  assert.deepEqual(restored.transports, original.transports);
  assert.deepEqual(Array.from(restored.publicKey), Array.from(original.publicKey));
});

test("checkRegistrationGate refuses registration when no setup token is configured", () => {
  withEnv({ AUTH_PASSKEY_CREDENTIAL: undefined, AUTH_SETUP_TOKEN: undefined }, () => {
    assert.equal(checkRegistrationGate("anything").ok, false);
  });
});

test("checkRegistrationGate refuses registration with the wrong token", () => {
  withEnv({ AUTH_PASSKEY_CREDENTIAL: undefined, AUTH_SETUP_TOKEN: "correct-token" }, () => {
    assert.equal(checkRegistrationGate("wrong-token").ok, false);
  });
});

test("checkRegistrationGate refuses registration when no token is supplied at all", () => {
  withEnv({ AUTH_PASSKEY_CREDENTIAL: undefined, AUTH_SETUP_TOKEN: "correct-token" }, () => {
    assert.equal(checkRegistrationGate(null).ok, false);
  });
});

test("checkRegistrationGate allows registration with the right token and no existing credential", () => {
  withEnv({ AUTH_PASSKEY_CREDENTIAL: undefined, AUTH_SETUP_TOKEN: "correct-token" }, () => {
    assert.equal(checkRegistrationGate("correct-token").ok, true);
  });
});

test("checkRegistrationGate permanently refuses registration once a credential exists, even with the correct token", () => {
  const stored: StoredPasskeyCredential = { id: "abc", publicKey: "ZGVmZw", counter: 0 };
  withEnv(
    { AUTH_PASSKEY_CREDENTIAL: JSON.stringify(stored), AUTH_SETUP_TOKEN: "correct-token" },
    () => {
      assert.equal(checkRegistrationGate("correct-token").ok, false);
    }
  );
});
