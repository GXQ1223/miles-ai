export const RP_NAME = "xguo.ai Studio";

export interface AuthConfig {
  sessionSecret: string;
  rpId: string;
  origin: string;
}

export function getAuthConfig(): AuthConfig {
  const sessionSecret = process.env.AUTH_SESSION_SECRET;
  const rpId = process.env.AUTH_RP_ID;
  const origin = process.env.AUTH_ORIGIN;

  if (!sessionSecret || !rpId || !origin) {
    throw new Error(
      "Missing required auth environment variables: AUTH_SESSION_SECRET, AUTH_RP_ID, AUTH_ORIGIN"
    );
  }

  return { sessionSecret, rpId, origin };
}

// Present only during the one-time bootstrap registration window; absent (or removed) afterward.
export function getSetupToken(): string | null {
  return process.env.AUTH_SETUP_TOKEN || null;
}
