const rows = [
  {
    k: "Building",
    title: "Reliable AI systems at BackOps",
    d: "Moving from feature delivery toward systems, platforms, and technical leadership."
  },
  {
    k: "Learning",
    title: "Finishing a CS master’s at Penn",
    d: "Infrastructure, distributed systems, evaluation, and the limits of agent autonomy."
  },
  {
    k: "Running",
    title: "The next cycle",
    d: "Training is a long conversation between ambition, recovery, and time."
  },
  {
    k: "Question",
    title: "What deserves attention?",
    d: "A living archive should make attention visible rather than merely storing volume."
  }
];

export default function Page() {
  return (
    <div>
      <div className="headCentered">
        <span className="eyebrow">Now</span>
        <h1>What is alive right now.</h1>
        <p className="lede">
          A short, honest entrance into the current chapter. Updated monthly rather than automatically.
        </p>
      </div>

      <div className="block-section">
        <div className="now-rows">
          {rows.map((row) => (
            <div className="now-row" key={row.k}>
              <div className="k">{row.k}</div>
              <div className="v">
                <strong>{row.title}</strong>
                <span className="d">{row.d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
