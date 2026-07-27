import { ImageCard } from "@/components/image-card";

export default function Page() {
  return (
    <div>
      <div className="headCentered">
        <span className="eyebrow">About</span>
        <h1>Miles Guo</h1>
        <p className="lede">
          A forward-deployed AI engineer in New York, building customer-facing systems for
          logistics and fulfillment. Formerly an architect. Always a marathoner.
        </p>
      </div>

      <div className="heroimg-wrap">
        <ImageCard imageKey="about" width={1800} height={1100} className="heroimg" />
      </div>

      <div className="block">
        <div className="col">
          <span className="label">The path</span>
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
        </div>
      </div>

      <div className="three-up">
        <div>
          <span className="label">Work</span>
          <p>Forward-deployed AI systems — I translate operational ambiguity into systems that can act reliably in production.</p>
        </div>
        <div>
          <span className="label">Life</span>
          <p>Running and relationships — training cycles, marathons, and the NewBee Running Club community.</p>
        </div>
        <div>
          <span className="label">This site</span>
          <p>A continuously edited self-portrait — not a complete exposure of life, but a deliberate composition from a private archive.</p>
        </div>
      </div>
    </div>
  );
}
