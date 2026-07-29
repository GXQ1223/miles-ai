"use client";

import { Fragment, useState } from "react";
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

const YEAR_MIN = 2021;
const YEAR_MAX = 2026.5;

function xPct(year: number) {
  return ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;
}

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

export function TimelineZoomMap({ chapters }: { chapters: TimelineChapter[] }) {
  const [level, setLevel] = useState<0 | 1 | 2>(0);
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

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

      <div className="tl-stage" data-level={level}>
        <div className="tl-level tl-level-0">
          <div className="tl-axis-wrap">
            <div className="tl-axis-line" />
            <div className="tl-year-ticks">
              {YEARS.map((y) => (
                <span className="tl-year-tick" style={{ left: xPct(y) + "%" }} key={y}>
                  {y === 2026 ? "2026 — now" : y}
                </span>
              ))}
            </div>
            <div className="tl-chapters-track">
              {chapters.map((ch, i) => {
                const pct = xPct((ch.yearStart + ch.yearEnd) / 2);
                const above = i % 2 === 0;
                return (
                  <div className="tl-chapter-node" style={{ left: pct + "%" }} key={ch.id}>
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
              <button type="button" className="tl-back-fab" onClick={() => goTo(0)}>
                ← Zoom out to timeline
              </button>
              <div className="tl-chapter-view-head">
                <span className="tl-period">{chapter.period} · {chapter.org}</span>
                <h2>{chapter.title}</h2>
                <p>{chapter.summary}</p>
              </div>
              <div className="tl-sub-axis-wrap">
                <div className="tl-sub-axis-line" />
                <div className="tl-sub-events-track">
                  {chapter.events.map((ev, i, arr) => {
                    const pct = arr.length === 1 ? 50 : (i / (arr.length - 1)) * 84 + 8;
                    return (
                      <div className="tl-event-node" style={{ left: pct + "%" }} key={ev.id}>
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
              <button type="button" className="tl-back-fab" onClick={() => goTo(1)}>
                ← Zoom out to {chapter.title}
              </button>
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
