import { ImageCard } from "@/components/image-card";

type Props = { params: Promise<{ year: string }> };

export default async function ArchiveYearPage({ params }: Props) {
  const { year } = await params;
  return (
    <div>
      <div className="headCentered">
        <span className="eyebrow">Year Archive</span>
        <h1>{year}</h1>
        <p className="lede">
          A composed view of the year: selected work, people, places, running,
          photographs, questions, and revisions. The raw archive remains private.
        </p>
      </div>

      <div className="heroimg-wrap">
        <ImageCard imageKey="archive" width={1800} height={1100} className="heroimg" />
      </div>

      <div className="block-section">
        <div className="grid">
          {["Winter", "Spring", "Summer", "Autumn"].map((season) => (
            <article className="card" key={season}>
              <small>{season.toUpperCase()}</small>
              <h2>Moments will appear here.</h2>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
