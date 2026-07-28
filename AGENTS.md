# Repository intent

This is a private-first life archive and public personal website.

Before editing:
1. Read `docs/ARCHITECTURE.md`.
2. Read `docs/CONTENT_MODEL.md`.
3. Preserve private-by-default behavior.
4. Never expose raw storage keys, provider API keys, or private asset metadata.
5. A public page must read from publication records, not directly from vault assets.
6. AI output is always a derivative with provenance; it never overwrites source material.

## Studio authentication

`/studio/**` pages and their backing API routes (`/api/compose`,
`/api/uploads/local`, `/api/assets/upload-target`) are gated by `proxy.ts`
(Next 16's replacement for `middleware.ts`), backed by `lib/auth/`. Single
owner, no user table — see `.env.example` for the three required
`AUTH_*` env vars and `README.md` for what this does and does not cover
per `docs/PRIVACY.md`.

## Known pre-existing issue

`npm run build` fails during its "Running TypeScript" step with `The "id"
argument must be of type string. Received undefined`, independent of any
app code changes (reproduces on a clean checkout). `npm run dev` and
`npm run typecheck` are unaffected. Don't assume a build failure here is a
regression from your change without first checking against a clean checkout.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
