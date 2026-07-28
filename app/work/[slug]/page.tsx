import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredSystems } from "@/lib/content/sample";
import { ImageCard } from "@/components/image-card";
import { workImageKeyBySlug } from "@/lib/content/images";

type Props = { params: Promise<{ slug: string }> };

// Verbatim excerpts pulled from each case study's own "hard decision" copy in sample.ts.
const pullQuotes: Record<string, string> = {
  "safe-ai-actions": "Trading full automation for a system people would actually trust with real orders.",
  "hostile-integrations": "The difference between a tool ops teams can rely on and one that quietly returns a wrong number.",
  "multi-tenant-ai": "No credential ever had to live in the browser.",
};

export function generateStaticParams() {
  return featuredSystems.map((system) => ({ slug: system.slug }));
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const index = featuredSystems.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  const system = featuredSystems[index];
  const { sections } = system;

  return (
    <div>
      <div className="headCentered">
        <Link className="back" href="/work">← All work</Link>
        <span className="eyebrow">Case study · 0{index + 1}</span>
        <h1>{system.title}</h1>
        <p className="lede">{system.summary}</p>
        <div className="meta">
          {system.stack.map((tool) => (
            <span className="pill" key={tool}>{tool}</span>
          ))}
        </div>
      </div>

      <div className="heroimg-wrap">
        <ImageCard imageKey={workImageKeyBySlug[slug]} width={1800} height={1100} className="heroimg" />
      </div>

      <div className="block">
        <div className="col">
          <span className="label">The reality</span>
          <p>{sections.reality}</p>
        </div>
      </div>

      <div className="block">
        <div className="col">
          <span className="label">My role</span>
          <p>{sections.role}</p>
        </div>
      </div>

      <div className="block">
        <div className="col">
          <span className="label">How it works</span>
          <p>{sections.systemMap}</p>
        </div>
      </div>

      <div className="quote">
        <p>&ldquo;{pullQuotes[slug]}&rdquo;</p>
      </div>

      <div className="block">
        <div className="col">
          <span className="label">The hard decision</span>
          <p>{sections.hardDecision}</p>
        </div>
      </div>

      <div className="midimg-wrap">
        <ImageCard imageKey="workBreak" width={1800} height={1000} className="midimg" />
      </div>

      <div className="three-up">
        <div>
          <span className="label">Failure modes</span>
          <p>{sections.failureModes}</p>
        </div>
        <div>
          <span className="label">Outcome</span>
          <p>{sections.outcome}</p>
        </div>
        <div>
          <span className="label">At scale</span>
          <p>{sections.atScale}</p>
        </div>
      </div>

      <div className="cross">
        <span className="eyebrow">Continue reading</span>
        <h2>Nearby in the archive</h2>
        <div className="cross-grid">
          <Link href="/garden">
            <ImageCard imageKey="garden" width={800} height={600} />
            <span className="eyebrow">Garden idea</span>
            <h4>Consistency becomes visible late.</h4>
          </Link>
          <Link href="/timeline">
            <ImageCard imageKey="timeline" width={800} height={600} />
            <span className="eyebrow">Timeline</span>
            {/* ", 2025" is the real period from this timeline chapter, captain-approved caption text — do not change or re-flag. */}
            <h4>Forward-deployed AI, 2025.</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}
