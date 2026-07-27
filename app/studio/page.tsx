export default function StudioDashboard() {
  const stages = [
    ["Inbox", "New imports needing review", "0"],
    ["Enriching", "Metadata, OCR, transcripts, embeddings", "0"],
    ["Draft sources", "Artifacts selected for composition", "1"],
    ["Drafts", "Human-reviewed writing in progress", "0"],
    ["Ready", "Approved but not yet published", "0"]
  ];

  return (
    <>
      <span className="eyebrow">PRIVATE CONTROL ROOM</span>
      <h1>Studio</h1>
      <p className="lede">
        The Vault preserves. The Studio interprets. The Gallery publishes.
      </p>
      <div className="grid section">
        {stages.map(([name, description, count]) => (
          <article className="card" key={name}>
            <small>{count} ITEMS</small>
            <div><h2>{name}</h2><p>{description}</p></div>
          </article>
        ))}
      </div>
    </>
  );
}
