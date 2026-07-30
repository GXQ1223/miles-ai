import Link from "next/link";
import { ImageCard } from "@/components/image-card";

export default function ArchitectureMemoPage() {
  return (
    <div>
      <div className="headCentered">
        <Link className="back" href="/work">← All work</Link>
        <span className="eyebrow">Personal memoir</span>
        <h1>Three years at Kohn Pedersen Fox.</h1>
        <p className="lede">
          Before I wrote production code, I designed buildings — chasing whether an idea could
          hold up all the way from a compelling section drawing down to the mechanical run
          behind a wall. This page is about that training: a couple of projects I still think
          about, a decision that stuck, and what it left behind once I started building systems
          instead of buildings.
        </p>
      </div>

      <div className="heroimg-wrap">
        <ImageCard imageKey="architecture" width={1800} height={1100} className="heroimg" />
      </div>

      <div className="block">
        <div className="col">
          <span className="label">A project you&rsquo;re proud of</span>
          <p>
            The one I still go back to is an Auto Industry Community Center, designed as an
            exploded section: the building&rsquo;s fluid exterior form pulled apart from the
            interior mechanical systems it has to contain, so both are visible making their case
            at once. Most studio work asks you to resolve the skin first and hide the systems
            behind it. This one only worked if the mechanical layers and the exterior form
            negotiated with each other in the same drawing. It&rsquo;s the first project where I
            stopped treating structure and services as something to conceal after the form was
            decided.
          </p>
        </div>
      </div>

      <div className="block">
        <div className="col">
          <span className="label">A decision that shaped how you think</span>
          <p>
            A speculative Future Airport study — a logistics problem disguised as a building —
            is where a habit stuck. Instead of starting from the terminal&rsquo;s public face, I
            built the design from a single section perspective cut through the whole structure,
            so the internal logistics system and the micro-surfaces around it had to be resolved
            before I let myself decide what the exterior looked like. It was slower, and you
            can&rsquo;t fake a section that has to actually work. It&rsquo;s the same instinct I
            use now: look at how a system behaves end to end before trusting what it looks like
            from the outside.
          </p>
        </div>
      </div>

      <div className="midimg-wrap">
        <ImageCard imageKey="architectureBreak" width={1800} height={1000} className="midimg" />
      </div>

      <div className="block">
        <div className="col">
          <span className="label">Something you&rsquo;d do differently</span>
          <p>
            I&rsquo;d be more skeptical of concept-first narratives. A casino competition entry
            for Longbay, Cambodia was built around connecting the seven chakras to Khmer culture
            — a genuinely interesting idea, and one a jury could follow. But I leaned on the
            narrative to justify formal moves that needed a harder, more technical defense. I&rsquo;d
            still start from a strong idea. I just wouldn&rsquo;t let it stand in for the systems
            thinking a design actually needs to hold up.
          </p>
        </div>
      </div>

      <div className="quote">
        <p>
          &ldquo;I call architecture frozen music&rdquo; — Goethe, a line from my old portfolio
          that still holds: the point was never the surface, it was the logic frozen inside it.
        </p>
      </div>

      <div className="block">
        <div className="col">
          <span className="label">Architect turned AI engineer</span>
          <p>
            Three years of that training taught me to hold a system in my head before I could
            see all of it — to trust a section or a diagram as much as the finished rendering.
            That transferred almost directly into software: a safe AI agent or a legacy
            integration also has to be designed in section, tracing how each part touches the
            ones around it before you trust what the interface shows the user. What I left behind
            was the slowness — architecture measures progress in months per building; software
            lets me test an idea in an afternoon. That trade is most of why I made the move.
          </p>
        </div>
      </div>

      <div className="cross">
        <span className="eyebrow">Continue reading</span>
        <h2>Nearby in the archive</h2>
        <div className="cross-grid">
          <Link href="/about">
            <ImageCard imageKey="about" width={800} height={600} />
            <span className="eyebrow">About</span>
            <h4>Architect turned AI engineer.</h4>
          </Link>
          <Link href="/work">
            <ImageCard imageKey="workBreak" width={800} height={600} />
            <span className="eyebrow">Workshop</span>
            <h4>Systems built in messy reality.</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}
