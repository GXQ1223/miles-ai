import { ImageCard } from "@/components/image-card";

const chapters = [
  { period: "2021 – 2024 · KPF", title: "Architecture", d: "Computational design and visualization tooling for large-scale projects. Spatial thinking, constraints, and the discipline of making ideas concrete." },
  { period: "2024 – 2026 · PENN", title: "Computer science", d: "A deliberate bet: a CS-focused master’s at the University of Pennsylvania, rebuilding professional identity through practice rather than credential alone." },
  { period: "2025 – PRESENT · BACKOPS AI", title: "Forward-deployed AI", d: "Learning customers deeply and making unreliable systems useful and safe in production, from seed through Series A." }
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

      {chapters.map((chapter) => (
        <div className="block" key={chapter.title}>
          <div className="col">
            <span className="label">{chapter.period}</span>
            <h3>{chapter.title}</h3>
            <p>{chapter.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
