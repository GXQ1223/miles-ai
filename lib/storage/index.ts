import { LocalStorageProvider } from "./local";
import { S3StorageProvider } from "./s3";
import type { StorageProvider } from "./types";

let singleton: StorageProvider | undefined;

export function storage(): StorageProvider {
  if (singleton) return singleton;
  const driver = process.env.STORAGE_DRIVER ?? "local";
  singleton = driver === "s3"
    ? new S3StorageProvider()
    : new LocalStorageProvider();
  return singleton;
}
