#!/usr/bin/env node
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error("Usage: node scripts/hash-password.mjs <password>");
    process.exitCode = 1;
    return;
  }

  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, KEY_LENGTH);
  console.log(`${salt.toString("hex")}:${derived.toString("hex")}`);
}

main();
