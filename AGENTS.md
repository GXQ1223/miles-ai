# Repository intent

This is a private-first life archive and public personal website.

Before editing:
1. Read `docs/ARCHITECTURE.md`.
2. Read `docs/CONTENT_MODEL.md`.
3. Preserve private-by-default behavior.
4. Never expose raw storage keys, provider API keys, or private asset metadata.
5. A public page must read from publication records, not directly from vault assets.
6. AI output is always a derivative with provenance; it never overwrites source material.
7. The public site (everything outside `app/studio/`) follows the "Quiet Grid" visual
   system: white/near-black/violet, Inter, rounded-corner soft-shadowed image cards,
   no full-bleed photos. `app/globals.css` and `app/layout.tsx` are shared with
   `/studio` (nested inside the same root layout) — treat shared class names as
   additive; don't repurpose `.page`/`.section`/`.card`/`.grid`/`.studioNav`/`.studioShell`
   in ways that would break Studio's structure.
8. Photography is centralized in `lib/content/images.ts` — reference images via its
   `imageUrl(key, w, h)`, never inline a picsum URL or a `public/images/...` path in a
   component. Most keys still resolve to a Picsum placeholder; a key graduates to a real,
   self-hosted photo by adding it to that file's `REAL_IMAGES` map, with the file living
   under `public/images/<section>/`.
9. The public IA is intentionally three panels: Work, Timeline, About (plus `/studio`,
   which is private/unrelated). `/now`, `/garden`, `/archive`, and `/miles` were cut by
   captain decision — don't recreate them or re-add their nav links without a fresh
   decision. `/work` leads with live/clickable projects (`otherProjects` in
   `lib/content/sample.ts`), then the confidential narrative case studies
   (`featuredSystems`); keep that order. Running/Miles content lives as a couple of
   sentences in the About page's "Life" card, not a dedicated section.

## Studio authentication

`/studio/**` pages and their backing API routes (`/api/compose`,
`/api/uploads/local`, `/api/assets/upload-target`) are gated by `proxy.ts`
(Next 16's replacement for `middleware.ts`), backed by `lib/auth/`. Single
owner, no user table, no username/password — passwordless WebAuthn passkey
only (`lib/auth/passkey.ts`, one-time registration at `/setup`). See
`.env.example` for the required `AUTH_*` env vars (including the RP ID/origin
binding a passkey is registered against) and `README.md`'s "Registering the
passkey" section for the registration flow, the domain-binding gotcha, and
what this does and does not cover per `docs/PRIVACY.md`.

## Timeline (zoomable map)

`/timeline` is an interactive three-level zoom (chapter -> moment -> case study),
not flat text — `components/timeline-zoom-map.tsx` is the client component;
`app/timeline/page.tsx` assembles its chapter data from `lib/content/sample.ts`
(`featuredSystems`, `otherProjects`) rather than duplicating copy. Node
positions use `--pos-x`/`--pos-y` CSS custom properties so a single `max-width:
699px` media query in `app/globals.css` can redirect the whole axis from
horizontal (desktop, position = real year) to vertical (mobile, even index
spacing — some chapters have adjacent year ranges that would collide if
stacked proportionally) without any JS viewport branching. Breadcrumb + zoom-
out live in one sticky `.tl-controlbar` rather than per-level floating
buttons — a floating button scrolled underneath the sticky site header and
became unclickable. Each zoom level needs explicit CSS hiding it at every
*deeper* level, not just the next one down, or a shallower level bleeds
through at the bottom of the stack.

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
