import Link from "next/link";
import { featuredSystems, otherProjects } from "@/lib/content/sample";
import { ImageCard } from "@/components/image-card";
import { workImageKeyBySlug } from "@/lib/content/images";

export default function WorkPage() {
  return (
    <div>
      <div className="headCentered">
        <span className="eyebrow">Workshop</span>
        <h1>Websites and systems I&rsquo;ve built.</h1>
        <p className="lede">
          Live projects first — the things you can actually open. Below that, three
          confidential case studies from client work: the operating problem, the decisions,
          the failure modes, and what I owned.
        </p>
      </div>

      <div className="block-section">
        <div className="section-head">
          <span className="eyebrow">Live projects</span>
          <h2>Built, shipped, and online.</h2>
        </div>
        <div className="grid">
          {otherProjects.map((item) => {
            const content = (
              <>
                <small>{`${item.year} · ${item.role}`.toUpperCase()}</small>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                </div>
              </>
            );
            return item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer" className="card" key={item.title}>
                {content}
              </a>
            ) : (
              <article className="card" key={item.title}>{content}</article>
            );
          })}
        </div>
      </div>

      <div className="block-section">
        <div className="section-head">
          <span className="eyebrow">Case studies</span>
          <h2>Confidential systems, told in writing.</h2>
        </div>
        {featuredSystems.map((item, index) => (
          <Link
            href={`/work/${item.slug}`}
            className={`work-row${index % 2 ? " rev" : ""}`}
            key={item.slug}
          >
            <ImageCard imageKey={workImageKeyBySlug[item.slug]} width={1200} height={900} />
            <div className="worktxt">
              <span className="num">CASE STUDY 0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <span className="link">Read the case study →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
