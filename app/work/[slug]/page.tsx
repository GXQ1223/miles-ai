import { notFound } from "next/navigation";
import { featuredSystems } from "@/lib/content/sample";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return featuredSystems.map((system) => ({ slug: system.slug }));
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const system = featuredSystems.find((item) => item.slug === slug);
  if (!system) notFound();

  const { sections } = system;

  return (
    <div className="page">
      <span className="eyebrow">CASE STUDY</span>
      <h1>{system.title}</h1>
      <p className="lede">{system.summary}</p>
      <section className="section grid">
        <article className="card wide"><small>01</small><h2>The messy reality</h2><p>{sections.reality}</p></article>
        <article className="card"><small>02</small><h2>My role</h2><p>{sections.role}</p></article>
        <article className="card full"><small>03</small><h2>System map</h2><p>{sections.systemMap}</p></article>
        <article className="card"><small>04</small><h2>Hard decision</h2><p>{sections.hardDecision}</p></article>
        <article className="card"><small>05</small><h2>Failure modes</h2><p>{sections.failureModes}</p></article>
        <article className="card"><small>06</small><h2>Outcome</h2><p>{sections.outcome}</p></article>
        <article className="card full"><small>07</small><h2>At 100× scale</h2><p>{sections.atScale}</p></article>
      </section>
    </div>
  );
}
