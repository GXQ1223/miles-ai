import Link from "next/link";
import { currentChapter, featuredSystems } from "@/lib/content/sample";

export default function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <span className="eyebrow">Systems · distance · people · becoming</span>
        <h1>A living map of the life I am building.</h1>
        <p className="lede">
          Architect turned AI engineer. Forward deployed in New York.
          Marathoner, writer, friend, and lifelong work in progress.
        </p>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2>Current chapter</h2>
          <Link href="/now">Open /now →</Link>
        </div>
        <div className="grid">
          {Object.entries(currentChapter).map(([key, value]) => (
            <article className="card" key={key}>
              <small>{key.toUpperCase()}</small>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2>Systems</h2>
          <Link href="/work">All work →</Link>
        </div>
        <div className="grid">
          {featuredSystems.map((item) => (
            <Link href={`/work/${item.slug}`} className="card" key={item.slug}>
              <small>CASE STUDY</small>
              <div>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="grid">
          <Link href="/garden" className="card wide">
            <small>GARDEN</small>
            <h2>Ideas grow through revision and connection.</h2>
          </Link>
          <Link href="/miles" className="card">
            <small>DISTANCE</small>
            <h2>Running as a record of time.</h2>
          </Link>
          <Link href="/archive/2026" className="card">
            <small>ARCHIVE</small>
            <h2>Enter through a year.</h2>
          </Link>
          <Link href="/timeline" className="card wide">
            <small>TIMELINE</small>
            <h2>Architecture → software → AI systems → whatever comes next.</h2>
          </Link>
        </div>
      </section>
    </div>
  );
}
