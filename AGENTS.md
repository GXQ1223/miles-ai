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
8. Placeholder photography (Picsum, no real photos yet) is centralized in
   `lib/content/images.ts` — reference images via its `imageUrl(key, w, h)`, never
   inline a picsum URL in a component, so swapping in real photos later is a one-file change.
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

## Timeline (flat/axon toggle)

`/timeline` is a Flat View / Axon View toggle (not the earlier zoomable-map
mechanic — see git history for `components/timeline-zoom-map.tsx` if that
reasoning is ever needed again). `components/timeline-axon.tsx` is the client
component; `app/timeline/page.tsx` assembles its three chapters from
`lib/content/sample.ts` (`featuredSystems`, `otherProjects`) rather than
duplicating copy — tags are the real project/case-study titles, read live.
Chapter-level content only, no drill-down into individual case studies, by
design.

Each chapter's placement in both views is a formula of its `backRank`/depth
in the chapters array (`placementFor` in `timeline-axon.tsx`), not per-index
constants, so a 4th (older) chapter needs no layout-code changes. Position is
set via `--flat-x`/`--flat-y`/`--flat-scale`/`--z-depth` custom properties
consumed inside `transform: translate3d(...)`, which animates cleanly with no
`@property` registration needed.

The side panel lists chapters newest-first (top) to oldest-last (bottom),
matching the visual stack's front-to-back order exactly — keep these in sync;
a mismatch is what makes the straight connector lines between a card and its
panel entry cross. Card-to-panel-entry correspondence is carried by a fixed
numbered badge (0 = oldest) on both, independent of list position. Leader
lines are hidden below the `900px` breakpoint, where the panel stacks under
the stage instead of beside it and a straight line no longer makes geometric
sense — the badges alone carry correspondence there.

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
