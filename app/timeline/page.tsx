import { ImageCard } from "@/components/image-card";
import { TimelineAxon, type TimelineAxonChapter } from "@/components/timeline-axon";
import { featuredSystems, otherProjects } from "@/lib/content/sample";

const kpfProject = otherProjects.find((p) => p.title.startsWith("Generative design tooling"))!;
const newbeeProject = otherProjects.find((p) => p.title === "NewBee Running Club")!;
const intdesignProject = otherProjects.find((p) => p.title === "intdesign.ai")!;

// Oldest first (back of the stack) -> most recent last (front of the stack). Tag bullets
// are the real project/case-study titles from lib/content/sample.ts, not a second copy.
const chapters: TimelineAxonChapter[] = [
  {
    id: "architecture",
    period: "2021 – 2024",
    org: "KPF",
    title: "Architecture",
    summary:
      "Computational design and visualization tooling for large-scale projects. Spatial thinking, constraints, and the discipline of making ideas concrete.",
    tags: [kpfProject.title],
  },
  {
    id: "cs",
    period: "2024 – 2026",
    org: "PENN",
    title: "Computer science",
    summary:
      "A deliberate bet: a CS-focused master’s at the University of Pennsylvania, rebuilding professional identity through practice rather than credential alone.",
    tags: [newbeeProject.title, intdesignProject.title],
  },
  {
    id: "backops",
    period: "2025 – present",
    org: "BACKOPS AI",
    title: "Forward-deployed AI engineer",
    summary:
      "Learning customers deeply and making unreliable systems useful and safe in production, from seed through Series A.",
    tags: featuredSystems.map((system) => system.title),
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

      <TimelineAxon chapters={chapters} />
    </div>
  );
}
