import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../lib/auth/password.ts";

test("a hashed password never stores the plaintext", async () => {
  const hash = await hashPassword("correct horse battery staple");
  assert.ok(!hash.includes("correct horse battery staple"));
  assert.match(hash, /^[0-9a-f]+:[0-9a-f]+$/);
});

test("the correct password verifies against its hash", async () => {
  const hash = await hashPassword("correct horse battery staple");
  assert.equal(await verifyPassword("correct horse battery staple", hash), true);
});

test("an incorrect password is rejected", async () => {
  const hash = await hashPassword("correct horse battery staple");
  assert.equal(await verifyPassword("wrong password", hash), false);
});

test("a malformed stored hash is rejected rather than throwing", async () => {
  assert.equal(await verifyPassword("anything", "not-a-valid-hash"), false);
});
