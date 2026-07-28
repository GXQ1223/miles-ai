import type { NextRequest, NextResponse } from "next/server";

const CHALLENGE_COOKIE_NAME = "miles_webauthn_challenge";
const CHALLENGE_MAX_AGE_SECONDS = 60 * 5;

// Carries the WebAuthn challenge between the "options" and "verify" steps of a ceremony.
// Scoped to /api/auth so it's only ever sent on the ceremony endpoints themselves.
export function setChallengeCookie(response: NextResponse, challenge: string): void {
  response.cookies.set(CHALLENGE_COOKIE_NAME, challenge, {
    path: "/api/auth",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: CHALLENGE_MAX_AGE_SECONDS
  });
}

export function readChallengeCookie(request: NextRequest): string | null {
  return request.cookies.get(CHALLENGE_COOKIE_NAME)?.value ?? null;
}

export function clearChallengeCookie(response: NextResponse): void {
  response.cookies.set(CHALLENGE_COOKIE_NAME, "", {
    path: "/api/auth",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0
  });
}
