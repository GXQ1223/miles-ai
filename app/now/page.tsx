export default function Page() {
  return (
    <div className="page">
      <span className="eyebrow">NOW</span>
      <h1>What is alive right now.</h1>
      <p className="lede">A short, honest entrance into the current chapter. Updated monthly rather than automatically.</p>
      <section className="section grid">
        <article className="card"><small>BUILDING</small><h2>Reliable AI systems at BackOps</h2><p>Moving from feature delivery toward systems, platforms, and technical leadership.</p></article>
<article className="card"><small>LEARNING</small><h2>Finishing a CS master&rsquo;s at Penn</h2><p>Infrastructure, distributed systems, evaluation, and the limits of agent autonomy.</p></article>
<article className="card"><small>RUNNING</small><h2>The next cycle</h2><p>Training is a long conversation between ambition, recovery, and time.</p></article>
<article className="card"><small>QUESTION</small><h2>What deserves attention?</h2><p>A living archive should make attention visible rather than merely storing volume.</p></article>
      </section>
    </div>
  );
}
