import { storage } from "@/lib/storage";

const MAX_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB skeleton limit

export async function POST(request: Request) {
  const body = await request.json() as {
    filename?: string;
    contentType?: string;
    byteSize?: number;
  };

  if (!body.filename || !body.contentType || !body.byteSize) {
    return Response.json({ error: "filename, contentType and byteSize are required" }, { status: 400 });
  }
  if (!Number.isFinite(body.byteSize) || body.byteSize <= 0 || body.byteSize > MAX_BYTES) {
    return Response.json({ error: "invalid byteSize" }, { status: 400 });
  }

  const target = await storage().createUploadTarget({
    filename: body.filename,
    contentType: body.contentType,
    byteSize: body.byteSize
  });

  return Response.json(target);
}
