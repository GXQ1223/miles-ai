import { createStorageKey } from "./key";
import type { StorageProvider, UploadTarget } from "./types";

export class LocalStorageProvider implements StorageProvider {
  async createUploadTarget(input: {
    filename: string;
    contentType: string;
    byteSize: number;
  }): Promise<UploadTarget> {
    const key = createStorageKey(input.filename);
    const base = process.env.PUBLIC_BASE_URL ?? "http://localhost:3000";
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    const url = new URL("/api/uploads/local", base);
    url.searchParams.set("key", key);
    return {
      key,
      method: "PUT",
      url: url.toString(),
      headers: { "content-type": input.contentType },
      expiresAt: expires.toISOString()
    };
  }

  async createReadUrl(key: string): Promise<string> {
    const base = process.env.PUBLIC_BASE_URL ?? "http://localhost:3000";
    const url = new URL("/api/uploads/local", base);
    url.searchParams.set("key", key);
    return url.toString();
  }

  async deleteObject(): Promise<void> {
    throw new Error("Local deletion is intentionally not implemented in the skeleton.");
  }
}
