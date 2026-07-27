# miles.ai — Life Archive Skeleton

A private-first personal archive with a curated public publishing layer.

## Core rule

**Everything can enter the Vault. Nothing becomes public without an explicit publication record.**

## Run

```bash
cp .env.example .env.local
npm install
npm run auth:hash-password -- "your-password"   # paste the output into AUTH_PASSWORD_HASH
openssl rand -hex 32                             # paste the output into AUTH_SESSION_SECRET
npm run dev
```

Set `AUTH_OWNER_USERNAME`, `AUTH_PASSWORD_HASH`, and `AUTH_SESSION_SECRET` in
`.env.local` before starting the server — every `/studio` route fails closed
without them.

Open:

- Public home: `http://localhost:3000`
- Studio sign-in: `http://localhost:3000/login`
- Private studio: `http://localhost:3000/studio`
- Vault: `http://localhost:3000/studio/vault`
- Composer: `http://localhost:3000/studio/compose`

`/studio/**` pages and their backing API routes (`/api/compose`,
`/api/uploads/local`, `/api/assets/upload-target`) now require a signed-in
session: unauthenticated page requests redirect to `/login`, and
unauthenticated API requests get `401`. Sign-in is single-owner,
credential-based (username + hashed password from environment variables —
there is no user table), and the session is carried in a signed, httpOnly
cookie. Because this is a single-owner app, the "is there a valid session"
check doubles as the authorization check on every Studio route and mutation.

This addresses the authentication (and, for a single-owner app, the
authorization) items on `docs/PRIVACY.md`'s "Required controls before
production" list. It does **not** cover the rest of that list — MFA, an
audit trail for privacy/publication changes, signed URLs with short
expiration, separate public/private media delivery, and consent/redaction
review are still outstanding and must be addressed before any public
deployment.

## What works now

- Public information architecture
- Single-owner authentication for `/studio` and its API routes
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

1. ~~Authentication for `/studio`~~ — done (single-owner credential login; MFA and the rest of `docs/PRIVACY.md`'s production controls remain outstanding)
2. PostgreSQL repository layer
3. Asset ingestion and metadata extraction
4. Google Photos/Drive import connector
5. Real AI provider adapters
6. Draft editor and revision history
7. Explicit publishing workflow
8. Search, relationships, maps and timelines
9. TTS derivatives
10. Background jobs and media processing
