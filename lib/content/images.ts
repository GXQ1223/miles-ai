/**
 * Photography for the public site.
 *
 * Most logical image keys below still have no real photo, so they resolve to
 * a Picsum deterministic seeded URL (`picsum.photos/seed/<seed>/<w>/<h>`) —
 * the same seed always returns the same "photo", so a subject (e.g. the
 * safe-ai-actions case study) looks consistent everywhere it recurs (nav,
 * hero, cross-links).
 *
 * A key can graduate out of placeholder status by adding an entry to
 * REAL_IMAGES below, pointing at a self-hosted file under `public/images/`.
 * Every call site references a logical key via `imageUrl`, never a raw URL
 * or path, so that swap happens in one place.
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
  architectureBreak: "miles-architecture-2",
} as const;

export type ImageKey = keyof typeof SEEDS;

// Real, self-hosted photography for keys that have moved past placeholder
// status — sourced from the KPF-era architecture portfolio. Renderings of
// "Auto Industry Community Center" (exploded axonometric, interior mechanical
// systems vs. exterior form) and "Future Airport" (section perspective of the
// internal logistics system).
const REAL_IMAGES: Partial<Record<ImageKey, string>> = {
  architecture: "/images/architecture/auto-industry-community-center.jpg",
  architectureBreak: "/images/architecture/future-airport.jpg",
};

export function imageUrl(key: ImageKey, width: number, height: number): string {
  const real = REAL_IMAGES[key];
  if (real) return real;
  return `https://picsum.photos/seed/${SEEDS[key]}/${width}/${height}`;
}

// Single source of truth for which case study (by slug) uses which hero/thumbnail image,
// so app/page.tsx, app/work/page.tsx, and app/work/[slug]/page.tsx can't drift apart.
export const workImageKeyBySlug: Record<string, ImageKey> = {
  "safe-ai-actions": "workSafeAiActions",
  "hostile-integrations": "workHostileIntegrations",
  "multi-tenant-ai": "workMultiTenantAi",
};
