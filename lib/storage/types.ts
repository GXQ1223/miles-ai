export interface UploadTarget {
  key: string;
  method: "PUT";
  url: string;
  headers?: Record<string, string>;
  expiresAt: string;
}

export interface StorageProvider {
  createUploadTarget(input: {
    filename: string;
    contentType: string;
    byteSize: number;
  }): Promise<UploadTarget>;

  createReadUrl(key: string, expiresInSeconds?: number): Promise<string>;
  deleteObject(key: string): Promise<void>;
}
