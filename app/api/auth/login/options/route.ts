import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { getAuthConfig } from "@/lib/auth/config";
import { getStoredCredential } from "@/lib/auth/passkey";
import { setChallengeCookie } from "@/lib/auth/webauthn-challenge";

export async function POST() {
  const stored = getStoredCredential();
  if (!stored) {
    return NextResponse.json({ error: "no passkey is registered" }, { status: 404 });
  }

  const { rpId } = getAuthConfig();

  const options = await generateAuthenticationOptions({
    rpID: rpId,
    userVerification: "required",
    allowCredentials: [{ id: stored.id, transports: stored.transports }]
  });

  const response = NextResponse.json(options);
  setChallengeCookie(response, options.challenge);
  return response;
}
