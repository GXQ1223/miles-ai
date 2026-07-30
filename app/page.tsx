import Link from "next/link";
import { currentChapter, featuredSystems } from "@/lib/content/sample";
import { ImageCard } from "@/components/image-card";
import { workImageKeyBySlug } from "@/lib/content/images";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <span className="eyebrow">Systems · distance · people · becoming</span>
        <h1>A living map of the life I am building.</h1>
        <p className="lede">
          Architect turned AI engineer. Forward deployed in New York.
          Marathoner, writer, friend, and lifelong work in progress.
        </p>
        <div className={styles.cta}>
          <Link className={styles.primary} href="/work">See the work</Link>
        </div>
      </section>

      <div className={styles.heroImgWrap}>
        <ImageCard imageKey="heroHome" width={1800} height={1100} className={styles.heroImg} />
      </div>

      <div className={styles.blockSection}>
        <div className={styles.sectionHead}>
          <span className="eyebrow">Current chapter</span>
          <h2>What&rsquo;s true right now.</h2>
        </div>
        <div className={styles.nowRows}>
          {Object.entries(currentChapter).map(([key, value]) => (
            <div className={styles.nowRow} key={key}>
              <div className={styles.k}>{key}</div>
              <div className={styles.v}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.blockSection}>
        <div className={styles.sectionHead}>
          <span className="eyebrow">Selected work</span>
          <h2>Three systems, three hard decisions.</h2>
        </div>
        {featuredSystems.map((item, index) => (
          <Link
            href={`/work/${item.slug}`}
            className={`${styles.workRow}${index % 2 ? ` ${styles.workRowRev}` : ""}`}
            key={item.slug}
          >
            <ImageCard
              imageKey={workImageKeyBySlug[item.slug]}
              width={1200}
              height={900}
              className={styles.workImg}
            />
            <div className={styles.worktxt}>
              <div className={styles.numRow}>
                <span className={styles.badge}>{`0${index + 1}`}</span>
                <span className={styles.num}>CASE STUDY 0{index + 1}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <span className={styles.link}>Read the case study →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.blockSection}>
        <div className={styles.sectionHead}>
          <span className="eyebrow">Elsewhere on the site</span>
          <h2>Everything else, all connected.</h2>
        </div>
        <div className={styles.gallery}>
          <Link href="/timeline" className={styles.galleryCard}>
            <ImageCard imageKey="timeline" width={700} height={700} className={styles.galleryImg} />
            <span className="eyebrow">Timeline</span>
            <h4>Architecture → software → AI systems.</h4>
          </Link>
          <Link href="/about" className={styles.galleryCard}>
            <ImageCard imageKey="about" width={700} height={700} className={styles.galleryImg} />
            <span className="eyebrow">About</span>
            <h4>Architect turned AI engineer.</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}
