"use client";

import { Fragment, useState, type CSSProperties } from "react";
import Link from "next/link";

type CaseStudyEvent = {
  kind: "case-study";
  id: string;
  period: string;
  title: string;
  summary: string;
  stack: string[];
  sections: { reality: string; role: string; hardDecision: string; outcome: string };
  slug: string;
};

type LinkEvent = {
  kind: "link";
  id: string;
  period: string;
  title: string;
  role: string;
  summary: string;
  href: string;
  external: boolean;
};

export type TimelineEvent = CaseStudyEvent | LinkEvent;

export type TimelineChapter = {
  id: string;
  period: string;
  org: string;
  title: string;
  yearStart: number;
  yearEnd: number;
  summary: string;
  events: TimelineEvent[];
};

// Positioned along the axis via a `--pos` custom property rather than an inline `left`/`top`
// so the CSS alone can redirect it to either axis depending on viewport width — the same
// number drives a horizontal position on wide screens and a vertical one on narrow screens.
function posStyle(pct: number): CSSProperties {
  return { "--pos": `${pct}%` } as CSSProperties;
}

// Chapters need two different coordinates, not one reused: on the horizontal (desktop) axis,
// a card's position must be true to its real year range — that's the whole "position on
// screen means position in time" identity of this design. But two chapters can have adjacent
// or overlapping year ranges (Computer science and Forward-deployed AI both sit in 2025), so
// stacked in a single mobile column that same year-proportional spacing collides. On the
// vertical axis we space chapters evenly by index instead, same as moments already are.
function evenPct(index: number, count: number) {
  return count === 1 ? 50 : (index / (count - 1)) * 84 + 8;
}

function nodeStyle(pctX: number, pctY: number): CSSProperties {
  return { "--pos-x": `${pctX}%`, "--pos-y": `${pctY}%` } as CSSProperties;
}

export function TimelineZoomMap({ chapters }: { chapters: TimelineChapter[] }) {
  const [level, setLevel] = useState<0 | 1 | 2>(0);
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  // Derived from the chapters prop rather than duplicated as constants, so the axis
  // stays in sync if a chapter's year range ever changes in app/timeline/page.tsx.
  const yearMin = Math.min(...chapters.map((c) => c.yearStart));
  const yearMax = Math.max(...chapters.map((c) => c.yearEnd));
  const lastTickYear = Math.floor(yearMax);
  const isOngoing = yearMax > lastTickYear;
  const years: number[] = [];
  for (let y = Math.ceil(yearMin); y <= lastTickYear; y++) years.push(y);

  function xPct(year: number) {
    return ((year - yearMin) / (yearMax - yearMin)) * 100;
  }

  const chapter = chapters.find((c) => c.id === chapterId) ?? null;
  const event = chapter?.events.find((e) => e.id === eventId) ?? null;

  function goTo(next: 0 | 1 | 2) {
    setLevel(next);
    if (next < 2) setEventId(null);
    if (next < 1) setChapterId(null);
  }

  function openChapter(id: string) {
    setChapterId(id);
    setLevel(1);
  }

  function openEvent(id: string) {
    setEventId(id);
    setLevel(2);
  }

  const crumbs: { label: string; onClick: () => void }[] = [{ label: "Timeline", onClick: () => goTo(0) }];
  if (chapter) crumbs.push({ label: chapter.title, onClick: () => goTo(1) });
  if (event) crumbs.push({ label: event.title, onClick: () => goTo(2) });

  return (
    <div className="tl-wrap">
      <div className="tl-controlbar">
        <nav className="tl-crumbs">
          {crumbs.map((c, i) => (
            <Fragment key={c.label}>
              {i > 0 && <span className="tl-sep">/</span>}
              <button
                type="button"
                className={`tl-crumb${i === crumbs.length - 1 ? " current" : ""}`}
                onClick={c.onClick}
              >
                {c.label}
              </button>
            </Fragment>
          ))}
        </nav>
        {level > 0 && (
          <button
            type="button"
            className="tl-zoom-out"
            onClick={() => goTo((level - 1) as 0 | 1)}
          >
            ← Zoom out to {level === 1 ? "timeline" : chapter?.title}
          </button>
        )}
      </div>

      <div className="tl-stage" data-level={level}>
        <div className="tl-level tl-level-0">
          <div className="tl-axis-wrap">
            <div className="tl-axis-line" />
            <div className="tl-year-ticks">
              {years.map((y) => (
                <span className="tl-year-tick" style={posStyle(xPct(y))} key={y}>
                  {y === lastTickYear && isOngoing ? `${y} — now` : y}
                </span>
              ))}
            </div>
            <div className="tl-chapters-track">
              {chapters.map((ch, i) => {
                const pctX = xPct((ch.yearStart + ch.yearEnd) / 2);
                const pctY = evenPct(i, chapters.length);
                const above = i % 2 === 0;
                return (
                  <div className="tl-chapter-node" style={nodeStyle(pctX, pctY)} key={ch.id}>
                    <div className="tl-chapter-dot" />
                    <button
                      type="button"
                      className={`tl-chapter-card ${above ? "above" : "below"}`}
                      onClick={() => openChapter(ch.id)}
                    >
                      <span className="tl-connector" />
                      <span className="tl-period">{ch.period} · {ch.org}</span>
                      <h3>{ch.title}</h3>
                      <p>{ch.summary}</p>
                      <span className="tl-zoom-hint">Zoom in →</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="tl-level tl-level-1">
          {chapter && (
            <div className="tl-chapter-view">
              <div className="tl-chapter-view-head">
                <span className="tl-period">{chapter.period} · {chapter.org}</span>
                <h2>{chapter.title}</h2>
                <p>{chapter.summary}</p>
              </div>
              <div className="tl-sub-axis-wrap">
                <div className="tl-sub-axis-line" />
                <div className="tl-sub-events-track">
                  {chapter.events.map((ev, i, arr) => {
                    const pct = evenPct(i, arr.length);
                    return (
                      <div className="tl-event-node" style={nodeStyle(pct, pct)} key={ev.id}>
                        <div className="tl-event-dot" />
                        <button type="button" className="tl-event-card" onClick={() => openEvent(ev.id)}>
                          <span className="tl-connector" />
                          <span className="tl-eb">{ev.period}</span>
                          <h4>{ev.title}</h4>
                          {ev.kind === "link" && <span className="tl-role">{ev.role}</span>}
                          <p>{ev.summary}</p>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="tl-level tl-level-2">
          {chapter && event && (
            <div className="tl-event-detail">
              <div className="tl-event-detail-head">
                <span className="tl-eb">{event.period} · {chapter.title}</span>
                <h2>{event.title}</h2>
                {event.kind === "link" && <span className="tl-role">{event.role}</span>}
                <p className="tl-lede-p">{event.summary}</p>
                {event.kind === "case-study" && (
                  <div className="tl-stack-pills">
                    {event.stack.map((s) => (
                      <span className="pill" key={s}>{s}</span>
                    ))}
                  </div>
                )}
                {event.kind === "link" &&
                  (event.external ? (
                    <a className="tl-inline-link" href={event.href} target="_blank" rel="noreferrer">
                      Visit the project →
                    </a>
                  ) : (
                    <Link className="tl-inline-link" href={event.href}>
                      Read the full story →
                    </Link>
                  ))}
              </div>

              {event.kind === "case-study" && (
                <>
                  <div className="tl-detail-sections">
                    <div className="tl-detail-section full">
                      <span className="label">The reality</span>
                      <p>{event.sections.reality}</p>
                    </div>
                    <div className="tl-detail-section">
                      <span className="label">My role</span>
                      <p>{event.sections.role}</p>
                    </div>
                    <div className="tl-detail-section">
                      <span className="label">The hard decision</span>
                      <p>{event.sections.hardDecision}</p>
                    </div>
                    <div className="tl-detail-section full">
                      <span className="label">Outcome</span>
                      <p>{event.sections.outcome}</p>
                    </div>
                  </div>
                  <Link className="tl-inline-link tl-case-study-link" href={`/work/${event.slug}`}>
                    Read the full case study →
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
