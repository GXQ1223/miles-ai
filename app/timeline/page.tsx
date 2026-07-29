import { ImageCard } from "@/components/image-card";
import { TimelineZoomMap, type TimelineChapter } from "@/components/timeline-zoom-map";
import { featuredSystems, otherProjects } from "@/lib/content/sample";

const kpfProject = otherProjects.find((p) => p.title.startsWith("Generative design tooling"))!;
const newbeeProject = otherProjects.find((p) => p.title === "NewBee Running Club")!;
const intdesignProject = otherProjects.find((p) => p.title === "intdesign.ai")!;

const eventPeriodBySlug: Record<string, string> = {
  "safe-ai-actions": "2025",
  "hostile-integrations": "2025",
  "multi-tenant-ai": "2025 – present",
};

const chapters: TimelineChapter[] = [
  {
    id: "architecture",
    period: "2021 – 2024",
    org: "KPF",
    title: "Architecture",
    yearStart: 2021,
    yearEnd: 2024,
    summary:
      "Computational design and visualization tooling for large-scale projects. Spatial thinking, constraints, and the discipline of making ideas concrete.",
    events: [
      {
        kind: "link",
        id: "kpf-generative-design",
        period: kpfProject.year,
        title: kpfProject.title,
        role: kpfProject.role,
        summary: kpfProject.summary,
        href: kpfProject.href!,
        external: false,
      },
    ],
  },
  {
    id: "cs",
    period: "2024 – 2026",
    org: "PENN",
    title: "Computer science",
    yearStart: 2024,
    yearEnd: 2026,
    summary:
      "A deliberate bet: a CS-focused master’s at the University of Pennsylvania, rebuilding professional identity through practice rather than credential alone.",
    events: [
      {
        kind: "link",
        id: "newbee",
        period: newbeeProject.year,
        title: newbeeProject.title,
        role: newbeeProject.role,
        summary: newbeeProject.summary,
        href: newbeeProject.href!,
        external: true,
      },
      {
        kind: "link",
        id: "intdesign",
        period: intdesignProject.year,
        title: intdesignProject.title,
        role: intdesignProject.role,
        summary: intdesignProject.summary,
        href: intdesignProject.href!,
        external: true,
      },
    ],
  },
  {
    id: "backops",
    period: "2025 – present",
    org: "BACKOPS AI",
    title: "Forward-deployed AI",
    yearStart: 2025,
    yearEnd: 2026.5,
    summary:
      "Learning customers deeply and making unreliable systems useful and safe in production, from seed through Series A.",
    events: featuredSystems.map((system) => ({
      kind: "case-study" as const,
      id: system.slug,
      period: eventPeriodBySlug[system.slug],
      title: system.title,
      summary: system.summary,
      stack: system.stack,
      sections: {
        reality: system.sections.reality,
        role: system.sections.role,
        hardDecision: system.sections.hardDecision,
        outcome: system.sections.outcome,
      },
      slug: system.slug,
    })),
  },
];

export default function Page() {
  return (
    <div>
      <div className="headCentered">
        <span className="eyebrow">Timeline</span>
        <h1>One life, not separate résumés.</h1>
        <p className="lede">
          A nonlinear path from architecture into software and AI systems, with the beliefs and decisions that changed at each threshold.
        </p>
      </div>

      <div className="heroimg-wrap">
        <ImageCard imageKey="timeline" width={1800} height={1100} className="heroimg" />
      </div>

      <TimelineZoomMap chapters={chapters} />
    </div>
  );
}
