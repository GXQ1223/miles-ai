import crypto from "node:crypto";

function safeExtension(filename: string): string {
  const match = filename.toLowerCase().match(/\.([a-z0-9]{1,10})$/);
  return match ? `.${match[1]}` : "";
}

export function createStorageKey(filename: string): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const id = crypto.randomUUID();
  return `vault/originals/${year}/${month}/${id}${safeExtension(filename)}`;
}
