import { test } from "node:test";
import assert from "node:assert/strict";
import { createSessionToken, verifySessionToken } from "../lib/auth/session.ts";

const SECRET = "test-secret-do-not-use-in-real-env";

test("a token signed with the correct secret verifies and carries the username", async () => {
  const token = await createSessionToken("owner", SECRET);
  const session = await verifySessionToken(token, SECRET);
  assert.ok(session);
  assert.equal(session?.sub, "owner");
});

test("a token verified with the wrong secret is rejected", async () => {
  const token = await createSessionToken("owner", SECRET);
  const session = await verifySessionToken(token, "a-different-secret");
  assert.equal(session, null);
});

test("a tampered payload is rejected even though the signature segment is untouched", async () => {
  const token = await createSessionToken("owner", SECRET);
  const [, signature] = token.split(".");
  const forgedPayload = Buffer.from(JSON.stringify({ sub: "attacker", iat: 0, exp: 9999999999 })).toString(
    "base64url"
  );
  const forged = `${forgedPayload}.${signature}`;
  const session = await verifySessionToken(forged, SECRET);
  assert.equal(session, null);
});

test("an expired token is rejected", async () => {
  const past = Math.floor(Date.now() / 1000) - 3600;
  const payload = Buffer.from(JSON.stringify({ sub: "owner", iat: past - 10, exp: past })).toString(
    "base64url"
  );
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = Buffer.from(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  ).toString("base64url");
  const expiredToken = `${payload}.${signature}`;

  const session = await verifySessionToken(expiredToken, SECRET);
  assert.equal(session, null);
});

test("a malformed token is rejected", async () => {
  assert.equal(await verifySessionToken("not-a-real-token", SECRET), null);
  assert.equal(await verifySessionToken("", SECRET), null);
});
