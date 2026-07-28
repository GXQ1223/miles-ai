# miles.ai — Life Archive Skeleton

A private-first personal archive with a curated public publishing layer.

## Core rule

**Everything can enter the Vault. Nothing becomes public without an explicit publication record.**

## Run

```bash
cp .env.example .env.local
npm install
openssl rand -hex 32   # paste the output into AUTH_SESSION_SECRET
npm run dev
```

Set `AUTH_SESSION_SECRET`, `AUTH_RP_ID`, and `AUTH_ORIGIN` in `.env.local`
before starting the server — every `/studio` route fails closed without
them. Then register your passkey (see below) before `AUTH_PASSKEY_CREDENTIAL`
exists — until it does, `/studio` has no way to authenticate anyone.

Open:

- Public home: `http://localhost:3000`
- Passkey setup (one-time): `http://localhost:3000/setup?token=<AUTH_SETUP_TOKEN>`
- Studio sign-in: `http://localhost:3000/login`
- Private studio: `http://localhost:3000/studio`
- Vault: `http://localhost:3000/studio/vault`
- Composer: `http://localhost:3000/studio/compose`

### Registering the passkey

`/studio` uses fully passwordless WebAuthn: no username, no password, ever.
The owner's phone (Face ID / Touch ID / fingerprint via its platform
authenticator, or as a roaming authenticator for other devices) is the only
credential.

1. Set `AUTH_SETUP_TOKEN` to a random secret in your environment (e.g.
   `openssl rand -hex 32`), alongside `AUTH_SESSION_SECRET`, `AUTH_RP_ID`,
   and `AUTH_ORIGIN`. Leave `AUTH_PASSKEY_CREDENTIAL` unset.
2. Visit `/setup?token=<AUTH_SETUP_TOKEN>` **on the exact domain you intend
   to use going forward** and complete the WebAuthn registration prompt with
   your phone.
3. The page shows a JSON blob on success. Copy it into
   `AUTH_PASSKEY_CREDENTIAL` in your environment and redeploy.
4. Remove `AUTH_SETUP_TOKEN` from your environment. This isn't load-bearing —
   the server permanently refuses any further registration once
   `AUTH_PASSKEY_CREDENTIAL` is set, regardless of token — but removing it is
   good defense in depth.

**Domain-binding gotcha:** a WebAuthn credential is bound to the exact
`AUTH_RP_ID` (and origin) used during registration. If you register against
a Vercel preview URL and later move to a custom domain, the passkey will
**not** work on the new domain — you'd need to register a new one there.
Register directly against the final production domain (e.g. `xguo.ai`), not
a preview URL, if you're mid-migration to a custom domain.

There is intentionally no username/password fallback. If the passkey is
ever lost, recovery is by generating a new one through `/setup` again and
redeploying with the new `AUTH_PASSKEY_CREDENTIAL` — the same env-var-based
recovery model this app has always used, not a normal login path.

`/studio/**` pages and their backing API routes (`/api/compose`,
`/api/uploads/local`, `/api/assets/upload-target`) require a signed-in
session: unauthenticated page requests redirect to `/login`, and
unauthenticated API requests get `401`. Sign-in is single-owner and
passkey-based (WebAuthn public key stored in an environment variable — there
is no user table), and the session is carried in a signed, httpOnly cookie,
exactly as before. Because this is a single-owner app, the "is there a valid
session" check doubles as the authorization check on every Studio route and
mutation.

This addresses the authentication (and, for a single-owner app, the
authorization) items on `docs/PRIVACY.md`'s "Required controls before
production" list. It does **not** cover the rest of that list — an audit
trail for privacy/publication changes, signed URLs with short expiration,
separate public/private media delivery, and consent/redaction review are
still outstanding and must be addressed before any public deployment.

## What works now

- Public information architecture
- Single-owner passkey authentication for `/studio` and its API routes
- Private Studio and Vault screens
- Storage abstraction
- Local upload target and local upload endpoint
- S3-compatible presigned upload support
- Draft-composition workflow contract
- Mock AI composer
- PostgreSQL schema design
- Privacy and provenance model
- Roadmap

## Recommended next implementation order

1. ~~Authentication for `/studio`~~ — done (single-owner passkey login; the rest of `docs/PRIVACY.md`'s production controls remain outstanding)
2. PostgreSQL repository layer
3. Asset ingestion and metadata extraction
4. Google Photos/Drive import connector
5. Real AI provider adapters
6. Draft editor and revision history
7. Explicit publishing workflow
8. Search, relationships, maps and timelines
9. TTS derivatives
10. Background jobs and media processing
