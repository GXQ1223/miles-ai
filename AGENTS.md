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
   in ways that would break Studio's structure. Exception: `/` (`app/page.tsx`) uses a
   bright soft-UI neumorphic material (captain-approved) instead of Quiet Grid card
   chrome, self-contained in `app/page.module.css` — it deliberately does not reuse the
   shared card/hero/work-row/gallery classnames from `app/globals.css`, so other pages
   are unaffected. Any future single-page visual departure should follow the same
   pattern: a page-scoped CSS Module, not edits to `app/globals.css`.
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

## Timeline (flat/axon toggle)

`/timeline` is a Flat View / Axon View toggle (not the earlier zoomable-map
mechanic — see git history for `components/timeline-zoom-map.tsx` if that
reasoning is ever needed again). `components/timeline-axon.tsx` is the client
component; `app/timeline/page.tsx` assembles its three chapters from
`lib/content/sample.ts` (`featuredSystems`, `otherProjects`) rather than
duplicating copy — tags are the real project/case-study titles, read live.
Chapter-level content only, no drill-down into individual case studies, by
design.

Flat View: each chapter's placement is a formula of its `backRank`/depth in
the chapters array (`placementFor`), not per-index constants, so a 4th
(older) chapter needs no layout-code changes. Position is set via
`--flat-x`/`--flat-y`/`--flat-scale` custom properties consumed inside
`transform: translate3d(...)`. The side panel lists chapters newest-first
(top) to oldest-last (bottom), matching the visual stack's front-to-back
order exactly — keep these in sync; a mismatch is what makes the straight
connector lines between a card and its panel entry cross. Card-to-panel-entry
correspondence is carried by a fixed numbered badge (0 = oldest) on both,
independent of list position. Leader lines are hidden below the `900px`
breakpoint, where the panel stacks under the stage instead of beside it and a
straight line no longer makes geometric sense — the badges alone carry
correspondence there.

Axon View: a true orthographic (parallel-projection) axonometric — no CSS
`perspective` anywhere in the rig's ancestor chain, by design, per a captain
decision that rejected an earlier vanishing-point version. Every chapter is a
flat plate at the *same* x/y footprint, offset only by
`translateZ(depth * PLATE_SPACING)` (a formula of depth, not per-index
constants), so the "explosion" reads as pure vertical stacking
inside one shared `rotateX(55deg) rotateZ(-45deg)` rig. Dashed vertical
corner guides connect the stack's 4 shared footprint corners
(`guideSpecs(count)`, generalized to any chapter count). The plates use a
bespoke soft-UI neumorphic skin (`--axon-bg`/`--axon-card`/`--axon-edge`/
`--axon-guide`, scoped as local custom properties on `.tlx-wrap`, not added
to `:root` — this is a deliberately bespoke material for this one 3D scene,
not a Quiet Grid palette change) with a crisp solid edge in addition to the
soft shadow, since shadow alone lets plate boundaries dissolve. The numbered
badge + short leader line + text label per plate is anchored to a real DOM
child of that plate (`.tlx-axon-anchor`) so it's structurally glued to the
plate's transform, then converted to flat 2D screen coordinates via
`getBoundingClientRect()` after layout settles (never hand-guessed) — this is
the same measure-don't-guess approach the reference design required after an
earlier draft's pins drifted from their volumes. Below 640px, Axon falls back
to rendering the Flat stage automatically (`isNarrow` in
`timeline-axon.tsx`) with an on-screen note, since a full 3D axonometric
can't stay legible at phone widths. An earlier, since-rejected iteration
built each chapter as a distinct 3D building volume (top/front/right faces)
scattered on a hatched ground plane with red Tschumi-style pin/path/callout
annotation — see git history if that reasoning is ever needed again.

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
