type Props = { params: Promise<{ year: string }> };

export default async function ArchiveYearPage({ params }: Props) {
  const { year } = await params;
  return (
    <div className="page">
      <span className="eyebrow">YEAR ARCHIVE</span>
      <h1>{year}</h1>
      <p className="lede">
        A composed view of the year: selected work, people, places, running,
        photographs, questions, and revisions. The raw archive remains private.
      </p>
      <section className="section grid">
        {["Winter", "Spring", "Summer", "Autumn"].map((season) => (
          <article className="card" key={season}>
            <small>{season.toUpperCase()}</small>
            <h2>Moments will appear here.</h2>
          </article>
        ))}
      </section>
    </div>
  );
}
