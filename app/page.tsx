import Link from "next/link";
import { currentChapter, featuredSystems } from "@/lib/content/sample";
import { ImageCard } from "@/components/image-card";
import { workImageKeyBySlug } from "@/lib/content/images";

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <span className="eyebrow">Systems · distance · people · becoming</span>
        <h1>A living map of the life I am building.</h1>
        <p className="lede">
          Architect turned AI engineer. Forward deployed in New York.
          Marathoner, writer, friend, and lifelong work in progress.
        </p>
        <div className="cta">
          <Link className="primary" href="/work">See the work</Link>
          <Link className="secondary" href="/now">Read /now</Link>
        </div>
      </section>

      <div className="heroimg-wrap">
        <ImageCard imageKey="heroHome" width={1800} height={1100} className="heroimg" />
      </div>

      <div className="block-section">
        <div className="section-head">
          <span className="eyebrow">Current chapter</span>
          <h2>What&rsquo;s true right now.</h2>
        </div>
        <div className="now-rows">
          {Object.entries(currentChapter).map(([key, value]) => (
            <div className="now-row" key={key}>
              <div className="k">{key}</div>
              <div className="v">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="block-section">
        <div className="section-head">
          <span className="eyebrow">Selected work</span>
          <h2>Three systems, three hard decisions.</h2>
        </div>
        {featuredSystems.map((item, index) => (
          <Link
            href={`/work/${item.slug}`}
            className={`work-row${index % 2 ? " rev" : ""}`}
            key={item.slug}
          >
            <ImageCard
              imageKey={workImageKeyBySlug[item.slug]}
              width={1200}
              height={900}
            />
            <div className="worktxt">
              <span className="num">CASE STUDY 0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <span className="link">Read the case study →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="block-section">
        <div className="section-head">
          <span className="eyebrow">Elsewhere in the archive</span>
          <h2>Everything else, all connected.</h2>
        </div>
        <div className="gallery">
          <Link href="/garden">
            <ImageCard imageKey="garden" width={700} height={700} />
            <span className="eyebrow">Garden</span>
            <h4>Ideas grow through revision and connection.</h4>
          </Link>
          <Link href="/miles">
            <ImageCard imageKey="miles" width={700} height={700} />
            <span className="eyebrow">Miles</span>
            <h4>Running as a record of time.</h4>
          </Link>
          <Link href="/timeline">
            <ImageCard imageKey="timeline" width={700} height={700} />
            <span className="eyebrow">Timeline</span>
            <h4>Architecture → software → AI systems.</h4>
          </Link>
          <Link href="/archive/2026">
            <ImageCard imageKey="archive" width={700} height={700} />
            <span className="eyebrow">Archive</span>
            <h4>Enter through a year.</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}
