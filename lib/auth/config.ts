export interface AuthConfig {
  username: string;
  passwordHash: string;
  sessionSecret: string;
}

export function getAuthConfig(): AuthConfig {
  const username = process.env.AUTH_OWNER_USERNAME;
  const passwordHash = process.env.AUTH_PASSWORD_HASH;
  const sessionSecret = process.env.AUTH_SESSION_SECRET;

  if (!username || !passwordHash || !sessionSecret) {
    throw new Error(
      "Missing required auth environment variables: AUTH_OWNER_USERNAME, AUTH_PASSWORD_HASH, AUTH_SESSION_SECRET"
    );
  }

  return { username, passwordHash, sessionSecret };
}
