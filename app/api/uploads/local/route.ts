import fs from "node:fs/promises";
import path from "node:path";

function resolveSafePath(key: string): string {
  const root = path.resolve(process.env.LOCAL_STORAGE_ROOT ?? "./data/uploads");
  const target = path.resolve(root, key);
  if (!target.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid storage key");
  }
  return target;
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key) return Response.json({ error: "key is required" }, { status: 400 });

  const target = resolveSafePath(key);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const bytes = Buffer.from(await request.arrayBuffer());
  await fs.writeFile(target, bytes);

  return Response.json({ ok: true, key, byteSize: bytes.length });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key) return Response.json({ error: "key is required" }, { status: 400 });

  try {
    const bytes = await fs.readFile(resolveSafePath(key));
    return new Response(bytes, {
      headers: {
        "content-type": "application/octet-stream",
        "cache-control": "private, no-store"
      }
    });
  } catch {
    return Response.json({ error: "not found" }, { status: 404 });
  }
}
