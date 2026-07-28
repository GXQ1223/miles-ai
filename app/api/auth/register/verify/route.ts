import { NextResponse, type NextRequest } from "next/server";
import { verifyRegistrationResponse, type RegistrationResponseJSON } from "@simplewebauthn/server";
import { getAuthConfig } from "@/lib/auth/config";
import { checkRegistrationGate, OWNER_SUBJECT, serializeCredential } from "@/lib/auth/passkey";
import { buildSessionCookieHeader, createSessionToken } from "@/lib/auth/session";
import { clearChallengeCookie, readChallengeCookie } from "@/lib/auth/webauthn-challenge";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    setupToken?: string;
    response?: RegistrationResponseJSON;
  } | null;

  // Re-checked here (not just at /options) so a credential registered by a concurrent
  // request can't slip through between the two steps of the ceremony.
  const gate = checkRegistrationGate(body?.setupToken ?? null);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.reason }, { status: 403 });
  }

  if (!body?.response) {
    return NextResponse.json({ error: "missing registration response" }, { status: 400 });
  }

  const expectedChallenge = readChallengeCookie(request);
  if (!expectedChallenge) {
    return NextResponse.json({ error: "registration ceremony expired or missing, restart setup" }, { status: 400 });
  }

  const { rpId, origin, sessionSecret } = getAuthConfig();

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body.response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpId
    });
  } catch {
    return NextResponse.json({ error: "registration verification failed" }, { status: 400 });
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: "registration not verified" }, { status: 400 });
  }

  const stored = serializeCredential(verification.registrationInfo.credential);
  const token = await createSessionToken(OWNER_SUBJECT, sessionSecret);

  const response = NextResponse.json({ ok: true, credential: stored });
  clearChallengeCookie(response);
  response.headers.append("Set-Cookie", buildSessionCookieHeader(token));
  return response;
}
