import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createStorageKey } from "./key";
import type { StorageProvider, UploadTarget } from "./types";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export class S3StorageProvider implements StorageProvider {
  private readonly bucket = required("S3_BUCKET");
  private readonly client = new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: {
      accessKeyId: required("S3_ACCESS_KEY_ID"),
      secretAccessKey: required("S3_SECRET_ACCESS_KEY")
    }
  });

  async createUploadTarget(input: {
    filename: string;
    contentType: string;
    byteSize: number;
  }): Promise<UploadTarget> {
    const key = createStorageKey(input.filename);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: input.contentType,
      Metadata: {
        "original-filename": encodeURIComponent(input.filename)
      }
    });
    const expiresIn = 15 * 60;
    const url = await getSignedUrl(this.client, command, { expiresIn });
    return {
      key,
      method: "PUT",
      url,
      headers: { "content-type": input.contentType },
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
    };
  }

  async createReadUrl(key: string, expiresInSeconds = 15 * 60): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
