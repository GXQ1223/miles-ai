"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type TimelineAxonChapter = {
  id: string;
  title: string;
  org: string;
  period: string;
  summary: string;
  tags: string[];
};

type View = "flat" | "axon";

type Leader = { id: string; x1: number; y1: number; x2: number; y2: number };

// Every layer's placement is a formula of its `backRank`/`depth` from the chapters array,
// not a per-index constant — the newest chapter (depth === count - 1) is always the thin
// "current" bar/front card; every older one gets a backRank (0 = just-older-than-current,
// increasing with age). Adding a 4th (older) chapter to the array needs no changes here.
function placementFor(depth: number, count: number) {
  const isCurrent = depth === count - 1;
  const backRank = isCurrent ? -1 : count - 2 - depth;
  return {
    isCurrent,
    backRank,
    flatX: isCurrent ? 0 : -(24 + backRank * 36),
    flatY: isCurrent ? -170 : 10 + backRank * 130,
    flatScale: isCurrent ? 1 : 1 - (backRank + 1) * 0.045,
    flatZ: isCurrent ? 100 : 90 - backRank * 10,
  };
}

// Axon view: every chapter is a flat plate at the SAME footprint (PLATE_WIDTH x
// PLATE_HEIGHT) — only translateZ differs, by depth * PLATE_SPACING — so the stack
// explodes purely vertically within the shared isometric rig, oldest (depth 0) at the
// bottom. A formula of depth, not a per-index constant, so a 4th chapter needs no
// changes here. Matches the approved corrected-base-structure reference's proportions.
const PLATE_WIDTH = 360;
const PLATE_HEIGHT = 220;
const PLATE_SPACING = 130;

// Four dashed corner guides span the shared footprint's corners for the full stack
// height, centered on the stack's Z midpoint — same technique as the reference's
// .guide/.g-a..d, generalized to any chapter count via `count`.
function guideSpecs(count: number) {
  const totalZ = (count - 1) * PLATE_SPACING;
  const height = totalZ + 40;
  const z = totalZ / 2;
  const hw = PLATE_WIDTH / 2;
  const hh = PLATE_HEIGHT / 2;
  return [
    { id: "a", x: -hw, y: -hh, z, height },
    { id: "b", x: hw, y: -hh, z, height },
    { id: "c", x: -hw, y: hh, z, height },
    { id: "d", x: hw, y: hh, z, height },
  ];
}

// The badge/leader/text callout sits a short, fixed screen-space distance from each
// plate's own corner anchor (a real DOM child of the plate, so it's structurally glued
// to that plate's transform) — not a floating guess independent of the plate.
const CALLOUT_DX = 42;
const CALLOUT_DY = -10;

type AxonPin = { id: string; label: string; x: number; y: number };
type AxonLeader = { id: string; x: number; y: number; length: number; angle: number };
type AxonLabel = { id: string; title: string; org: string; period: string; x: number; y: number };

export function TimelineAxon({ chapters }: { chapters: TimelineAxonChapter[] }) {
  const [view, setView] = useState<View>("flat");
  const [isNarrow, setIsNarrow] = useState(false);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [leadersVisible, setLeadersVisible] = useState(false);
  const [pins, setPins] = useState<AxonPin[]>([]);
  const [axonLeaders, setAxonLeaders] = useState<AxonLeader[]>([]);
  const [axonLabels, setAxonLabels] = useState<AxonLabel[]>([]);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const planeRefs = useRef(new Map<string, HTMLDivElement>());
  const badgeRefs = useRef(new Map<string, HTMLDivElement>());
  const anchorRefs = useRef(new Map<string, HTMLDivElement>());

  const count = chapters.length;
  const placements = chapters.map((chapter, depth) => ({ chapter, depth, ...placementFor(depth, count) }));

  // The side panel lists newest first (top) to oldest last (bottom) — the same
  // front-to-back order the visual stack reads in both views. Correspondence between a
  // card and its panel entry comes from the shared numbered badge (depth), not list
  // position, so the badges stay fixed to each chapter while the list order flips.
  const panelPlacements = [...placements].reverse();

  const effectiveView = isNarrow ? "flat" : view;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function recomputeLeaders() {
    const wrap = wrapRef.current;
    if (!wrap || effectiveView !== "flat") {
      setLeaders([]);
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    const next: Leader[] = [];
    chapters.forEach((chapter) => {
      const plane = planeRefs.current.get(chapter.id);
      const badge = badgeRefs.current.get(chapter.id);
      if (!plane || !badge) return;
      const pr = plane.getBoundingClientRect();
      const br = badge.getBoundingClientRect();
      next.push({
        id: chapter.id,
        x1: pr.right - wrapRect.left,
        y1: pr.top + pr.height / 2 - wrapRect.top,
        x2: wrapRect.width,
        y2: br.top + br.height / 2 - wrapRect.top,
      });
    });
    setLeaders(next);
  }

  // Axon annotation is measured, never guessed, and structurally attached: each plate
  // carries its own corner anchor (.tlx-axon-anchor, a real child of that plate, so it
  // inherits the plate's exact translateZ position via the shared rig transform). The
  // badge sits directly on the anchor's measured position; the leader line and text
  // block sit a short, fixed screen-space offset away — read via getBoundingClientRect()
  // after layout settles, then converted to wrap-relative coordinates for the flat,
  // unrotated overlay (so the text never inherits the rig's isometric skew).
  function recomputeAxon() {
    const wrap = wrapRef.current;
    if (!wrap || effectiveView !== "axon") {
      setPins([]);
      setAxonLeaders([]);
      setAxonLabels([]);
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();

    const nextPins: AxonPin[] = [];
    const nextLeaders: AxonLeader[] = [];
    const nextLabels: AxonLabel[] = [];

    chapters.forEach((chapter, depth) => {
      const anchor = anchorRefs.current.get(chapter.id);
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      const x = r.left - wrapRect.left;
      const y = r.top - wrapRect.top;
      nextPins.push({ id: chapter.id, label: String(depth), x, y });
      nextLeaders.push({
        id: chapter.id,
        x,
        y,
        length: Math.hypot(CALLOUT_DX, CALLOUT_DY),
        angle: (Math.atan2(CALLOUT_DY, CALLOUT_DX) * 180) / Math.PI,
      });
      nextLabels.push({
        id: chapter.id,
        title: chapter.title,
        org: chapter.org,
        period: chapter.period,
        x: x + CALLOUT_DX + 10,
        y: y + CALLOUT_DY,
      });
    });

    setPins(nextPins);
    setAxonLeaders(nextLeaders);
    setAxonLabels(nextLabels);
  }

  useEffect(() => {
    setLeadersVisible(false);
    recomputeLeaders();
    recomputeAxon();
    const early = window.setTimeout(() => {
      recomputeLeaders();
      recomputeAxon();
    }, 60);
    const settled = window.setTimeout(() => {
      recomputeLeaders();
      recomputeAxon();
      setLeadersVisible(true);
    }, 400);
    return () => {
      window.clearTimeout(early);
      window.clearTimeout(settled);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveView]);

  useEffect(() => {
    const onResize = () => {
      recomputeLeaders();
      recomputeAxon();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveView]);

  return (
    <div className="tlx-wrap">
      <div className="tlx-toggle-row">
        <div className="tlx-toggle">
          <button
            type="button"
            className={view === "flat" ? "active" : ""}
            onClick={() => setView("flat")}
          >
            Flat View
          </button>
          <button
            type="button"
            className={view === "axon" ? "active" : ""}
            onClick={() => setView("axon")}
          >
            Axon View
          </button>
        </div>
        <p className="tlx-note">
          An architect&rsquo;s way of drawing a life &mdash; axonometric projection, so the years
          read as depth instead of a list.
        </p>
      </div>

      {isNarrow && view === "axon" && (
        <p className="tlx-axon-fallback-note">
          Axon View needs more width to stay legible &mdash; showing Flat View here.
        </p>
      )}

      <div className="tlx-stage-row">
        <div className="tlx-stage-wrap" ref={wrapRef}>
          {effectiveView === "flat" ? (
            <div className="tlx-stage" data-view="flat">
              {placements.map(({ chapter, depth, isCurrent, backRank, flatX, flatY, flatScale, flatZ }) => (
                <div
                  key={chapter.id}
                  ref={(el) => {
                    if (el) planeRefs.current.set(chapter.id, el);
                    else planeRefs.current.delete(chapter.id);
                  }}
                  className={`tlx-plane${isCurrent ? " is-current" : ""}${!isCurrent && backRank > 0 ? " is-back" : ""}`}
                  style={
                    {
                      "--flat-x": `${flatX}px`,
                      "--flat-y": `${flatY}px`,
                      "--flat-scale": flatScale,
                      "--flat-z": flatZ,
                    } as CSSProperties
                  }
                >
                  <span className="tlx-plane-badge">{depth}</span>
                  <div className="tlx-plane-head">
                    <div>
                      <span className="tlx-plane-title">{chapter.title}</span>
                      <span className="tlx-plane-org">{chapter.org}</span>
                    </div>
                    <span className="tlx-plane-period">{chapter.period}</span>
                  </div>
                  <p className="tlx-plane-desc">{chapter.summary}</p>
                  <div className="tlx-plane-tags">
                    {chapter.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
            <div className="tlx-axon-backdrop" />
            <div className="tlx-axon-rig">
              {guideSpecs(count).map((g) => (
                <div
                  key={g.id}
                  className="tlx-axon-guide"
                  style={{
                    height: g.height,
                    marginTop: -g.height / 2,
                    transform: `translate3d(${g.x}px, ${g.y}px, ${g.z}px) rotateX(90deg)`,
                  }}
                />
              ))}
              {placements.map(({ chapter, depth }) => (
                <div
                  key={chapter.id}
                  className="tlx-axon-plate"
                  style={{ transform: `translateZ(${depth * PLATE_SPACING}px)` }}
                >
                  <div
                    ref={(el) => {
                      if (el) anchorRefs.current.set(chapter.id, el);
                      else anchorRefs.current.delete(chapter.id);
                    }}
                    className="tlx-axon-anchor"
                  />
                </div>
              ))}
            </div>
            </>
          )}

          {effectiveView === "flat" && (
            <svg className={`tlx-leader-svg${leadersVisible ? "" : " is-hidden"}`} aria-hidden="true">
              {leaders.map((leader) => (
                <g key={leader.id}>
                  <circle cx={leader.x1} cy={leader.y1} r={3.5} />
                  <line x1={leader.x1} y1={leader.y1} x2={leader.x2} y2={leader.y2} />
                </g>
              ))}
            </svg>
          )}

          {effectiveView === "axon" && (
            <div className={`tlx-axon-annot${leadersVisible ? "" : " is-hidden"}`}>
              {axonLeaders.map((leader) => (
                <div
                  key={leader.id}
                  className="tlx-axon-leader"
                  style={{ top: leader.y, left: leader.x, width: leader.length, transform: `rotate(${leader.angle}deg)` }}
                />
              ))}
              {pins.map((pin) => (
                <div key={pin.id} className="tlx-axon-pin" style={{ top: pin.y, left: pin.x }}>
                  {pin.label}
                </div>
              ))}
              {axonLabels.map((label) => (
                <div key={label.id} className="tlx-axon-label" style={{ top: label.y, left: label.x }}>
                  <span className="tlx-axon-label-title">{label.title}</span>
                  <span className="tlx-axon-label-meta">
                    {label.org} &middot; {label.period}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="tlx-panel">
          <h2>What you see, newest to oldest</h2>
          {panelPlacements.map(({ chapter, depth }) => (
            <div className="tlx-panel-card" key={chapter.id}>
              <div
                className="tlx-panel-badge"
                ref={(el) => {
                  if (el) badgeRefs.current.set(chapter.id, el);
                  else badgeRefs.current.delete(chapter.id);
                }}
              >
                {depth}
              </div>
              <div>
                <div className="tlx-panel-title">{chapter.title}</div>
                <div className="tlx-panel-meta">
                  {chapter.org} &middot; {chapter.period}
                </div>
                <p className="tlx-panel-desc">{chapter.summary}</p>
                <div className="tlx-panel-tags">
                  {chapter.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
