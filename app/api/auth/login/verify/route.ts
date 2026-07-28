import { NextResponse, type NextRequest } from "next/server";
import { verifyAuthenticationResponse, type AuthenticationResponseJSON } from "@simplewebauthn/server";
import { getAuthConfig } from "@/lib/auth/config";
import { getStoredCredential, OWNER_SUBJECT, toWebAuthnCredential } from "@/lib/auth/passkey";
import { buildSessionCookieHeader, createSessionToken } from "@/lib/auth/session";
import { clearChallengeCookie, readChallengeCookie } from "@/lib/auth/webauthn-challenge";

export async function POST(request: NextRequest) {
  const stored = getStoredCredential();
  if (!stored) {
    return NextResponse.json({ error: "no passkey is registered" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { response?: AuthenticationResponseJSON } | null;
  if (!body?.response) {
    return NextResponse.json({ error: "missing authentication response" }, { status: 400 });
  }

  const expectedChallenge = readChallengeCookie(request);
  if (!expectedChallenge) {
    return NextResponse.json({ error: "authentication ceremony expired or missing, try again" }, { status: 400 });
  }

  const { rpId, origin, sessionSecret } = getAuthConfig();

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: body.response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpId,
      credential: toWebAuthnCredential(stored)
    });
  } catch {
    return NextResponse.json({ error: "authentication verification failed" }, { status: 401 });
  }

  if (!verification.verified) {
    return NextResponse.json({ error: "authentication not verified" }, { status: 401 });
  }

  // verification.authenticationInfo.newCounter is intentionally not persisted: the
  // credential lives in an env var with no runtime write path, and phone/platform
  // passkeys (synced via iCloud/Google) universally report counter 0, so there's
  // nothing meaningful to track here anyway.

  const token = await createSessionToken(OWNER_SUBJECT, sessionSecret);
  const response = NextResponse.json({ ok: true });
  clearChallengeCookie(response);
  response.headers.append("Set-Cookie", buildSessionCookieHeader(token));
  return response;
}
