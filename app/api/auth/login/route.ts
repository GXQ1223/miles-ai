import { createHash, timingSafeEqual } from "node:crypto";
import { getAuthConfig } from "@/lib/auth/config";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";

function timingSafeStringEqual(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  if (!body?.username || !body?.password) {
    return Response.json({ error: "username and password are required" }, { status: 400 });
  }

  const config = getAuthConfig();
  const passwordValid = await verifyPassword(body.password, config.passwordHash);
  const usernameValid = timingSafeStringEqual(body.username, config.username);

  if (!usernameValid || !passwordValid) {
    return Response.json({ error: "invalid credentials" }, { status: 401 });
  }

  const token = await createSessionToken(config.username, config.sessionSecret);
  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    [
      `${SESSION_COOKIE_NAME}=${token}`,
      "Path=/",
      `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
      "HttpOnly",
      "SameSite=Lax",
      ...(process.env.NODE_ENV === "production" ? ["Secure"] : [])
    ].join("; ")
  );

  return response;
}
