import Link from "next/link";
import { featuredSystems, otherProjects } from "@/lib/content/sample";

export default function WorkPage() {
  return (
    <div className="page">
      <span className="eyebrow">WORKSHOP</span>
      <h1>Systems built in messy reality.</h1>
      <p className="lede">
        Each case study begins with the operating problem, follows the decisions,
        exposes failure modes, and states clearly what I owned.
      </p>
      <section className="section grid">
        {featuredSystems.map((item) => (
          <Link href={`/work/${item.slug}`} className="card" key={item.slug}>
            <small>CASE STUDY</small>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
          </Link>
        ))}
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2>Other projects</h2>
        </div>
        <div className="grid">
          {otherProjects.map((item) => {
            const content = (
              <>
                <small>{item.year.toUpperCase()} · {item.role.toUpperCase()}</small>
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
      </section>
    </div>
  );
}
