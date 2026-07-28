import { NextResponse, type NextRequest } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { getAuthConfig, RP_NAME } from "@/lib/auth/config";
import { checkRegistrationGate, OWNER_SUBJECT } from "@/lib/auth/passkey";
import { setChallengeCookie } from "@/lib/auth/webauthn-challenge";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { setupToken?: string } | null;
  const gate = checkRegistrationGate(body?.setupToken ?? null);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.reason }, { status: 403 });
  }

  const { rpId } = getAuthConfig();

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: rpId,
    userName: OWNER_SUBJECT,
    userDisplayName: "Owner",
    attestationType: "none",
    excludeCredentials: [],
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required"
    }
  });

  const response = NextResponse.json(options);
  setChallengeCookie(response, options.challenge);
  return response;
}
