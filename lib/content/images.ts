/**
 * Placeholder photography for the public site.
 *
 * No real photos exist yet, so every logical image key below resolves to a
 * Picsum deterministic seeded URL (`picsum.photos/seed/<seed>/<w>/<h>`) — the
 * same seed always returns the same "photo", so a subject (e.g. the safe-ai-actions
 * case study) looks consistent everywhere it recurs (nav, hero, cross-links).
 *
 * TODO(real photography): once real photos exist, replace the seed strings
 * below with real asset URLs (or branch `picsumUrl` to return a real URL when
 * one is configured). Every call site references a logical key via `imageUrl`,
 * never a raw URL, so that swap happens in one place.
 */

const SEEDS = {
  heroHome: "miles-hero-1",
  workSafeAiActions: "miles-work-1",
  workHostileIntegrations: "miles-work-2",
  workMultiTenantAi: "miles-work-3",
  workBreak: "miles-break-1",
  timeline: "miles-timeline-1",
  about: "miles-about-1",
  architecture: "miles-architecture-1",
} as const;

export type ImageKey = keyof typeof SEEDS;

export function imageUrl(key: ImageKey, width: number, height: number): string {
  return `https://picsum.photos/seed/${SEEDS[key]}/${width}/${height}`;
}

// Single source of truth for which case study (by slug) uses which hero/thumbnail image,
// so app/page.tsx, app/work/page.tsx, and app/work/[slug]/page.tsx can't drift apart.
export const workImageKeyBySlug: Record<string, ImageKey> = {
  "safe-ai-actions": "workSafeAiActions",
  "hostile-integrations": "workHostileIntegrations",
  "multi-tenant-ai": "workMultiTenantAi",
};
