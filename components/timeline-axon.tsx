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
    zDepth: depth * 128,
  };
}

export function TimelineAxon({ chapters }: { chapters: TimelineAxonChapter[] }) {
  const [view, setView] = useState<View>("flat");
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [leadersVisible, setLeadersVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const planeRefs = useRef(new Map<string, HTMLDivElement>());
  const badgeRefs = useRef(new Map<string, HTMLDivElement>());

  const count = chapters.length;
  const placements = chapters.map((chapter, depth) => ({ chapter, depth, ...placementFor(depth, count) }));

  // The side panel lists newest first (top) to oldest last (bottom) — the same
  // front-to-back order the visual stack reads in both views. Correspondence between a
  // card and its panel entry comes from the shared numbered badge (depth), not list
  // position, so the badges stay fixed to each chapter while the list order flips.
  const panelPlacements = [...placements].reverse();

  function recomputeLeaders() {
    const wrap = wrapRef.current;
    if (!wrap) return;
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

  useEffect(() => {
    setLeadersVisible(false);
    recomputeLeaders();
    const early = window.setTimeout(recomputeLeaders, 60);
    const settled = window.setTimeout(() => {
      recomputeLeaders();
      setLeadersVisible(true);
    }, 780);
    return () => {
      window.clearTimeout(early);
      window.clearTimeout(settled);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    window.addEventListener("resize", recomputeLeaders);
    return () => window.removeEventListener("resize", recomputeLeaders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          An architect&rsquo;s way of drawing a life — axonometric projection, so the years
          read as depth instead of a list.
        </p>
      </div>

      <div className="tlx-stage-row">
        <div className="tlx-stage-wrap" ref={wrapRef}>
          <div className="tlx-stage" data-view={view}>
            {placements.map(({ chapter, depth, isCurrent, backRank, flatX, flatY, flatScale, flatZ, zDepth }) => (
              <div
                key={chapter.id}
                ref={(el) => {
                  if (el) planeRefs.current.set(chapter.id, el);
                }}
                className={`tlx-plane${isCurrent ? " is-current" : ""}${!isCurrent && backRank > 0 ? " is-back" : ""}`}
                style={
                  {
                    "--flat-x": `${flatX}px`,
                    "--flat-y": `${flatY}px`,
                    "--flat-scale": flatScale,
                    "--flat-z": flatZ,
                    "--z-depth": `${zDepth}px`,
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
          <svg className={`tlx-leader-svg${leadersVisible ? "" : " is-hidden"}`} aria-hidden="true">
            {leaders.map((leader) => (
              <g key={leader.id}>
                <circle cx={leader.x1} cy={leader.y1} r={3.5} />
                <line x1={leader.x1} y1={leader.y1} x2={leader.x2} y2={leader.y2} />
              </g>
            ))}
          </svg>
        </div>

        <aside className="tlx-panel">
          <h2>What you see, newest to oldest</h2>
          {panelPlacements.map(({ chapter, depth }) => (
            <div className="tlx-panel-card" key={chapter.id}>
              <div
                className="tlx-panel-badge"
                ref={(el) => {
                  if (el) badgeRefs.current.set(chapter.id, el);
                }}
              >
                {depth}
              </div>
              <div>
                <div className="tlx-panel-title">{chapter.title}</div>
                <div className="tlx-panel-meta">
                  {chapter.org} · {chapter.period}
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
