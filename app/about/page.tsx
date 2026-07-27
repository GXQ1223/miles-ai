export default function Page() {
  return (
    <div className="page">
      <span className="eyebrow">ABOUT</span>
      <h1>Miles Guo</h1>
      <p className="lede">
        A forward-deployed AI engineer in New York, building customer-facing systems for
        logistics and fulfillment. Formerly an architect. Always a marathoner.
      </p>

      <section className="section">
        <div className="sectionHeader"><h2>The path</h2></div>
        <p>
          I started as an architectural designer at Kohn Pedersen Fox, building computational
          design and visualization tools for large-scale projects. Two things pulled me toward
          software. Architecture had a ceiling on the kind of growth I wanted. And using AI
          tools every day in my own work — for renderings, schemes, and presentations —
          convinced me it wasn&rsquo;t a passing trend. It was already reshaping how things get built.
        </p>
        <p>
          So I made a deliberate bet: enrolling in a computer-science-focused master&rsquo;s at the
          University of Pennsylvania, and building real systems while still finishing the degree.
          Now at BackOps AI, the work I&rsquo;m best at sits where code meets customers and
          ambiguity — turning a vague operational need into a safe, working system.
        </p>
      </section>

      <section className="section grid">
        <article className="card">
          <small>WORK</small>
          <h2>Forward-deployed AI systems</h2>
          <p>I translate operational ambiguity into systems that can act reliably in production.</p>
        </article>
        <article className="card">
          <small>LIFE</small>
          <h2>Running and relationships</h2>
          <p>A life is shaped through repeated effort and shared experience — training cycles, marathons, and the NewBee Running Club community.</p>
        </article>
        <article className="card">
          <small>THIS SITE</small>
          <h2>A continuously edited self-portrait</h2>
          <p>Not a complete exposure of life, but a deliberate composition from a private archive.</p>
        </article>
      </section>
    </div>
  );
}
