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
          [Write your own framing/thesis statement here — why this chapter is worth a page,
          and what you want a reader to take away from your time as an architect, 2021–2024.]
        </p>
      </div>

      <div className="heroimg-wrap">
        <ImageCard imageKey="architecture" width={1800} height={1100} className="heroimg" />
      </div>

      <div className="block">
        <div className="col">
          <span className="label">A project you&rsquo;re proud of</span>
          <p>
            [Describe a project you&rsquo;re proud of and why. What was the problem, what did you
            build or contribute, and what made it meaningful to you at the time?]
          </p>
        </div>
      </div>

      <div className="block">
        <div className="col">
          <span className="label">A decision that shaped how you think</span>
          <p>
            [What&rsquo;s a decision or constraint that shaped how you think about design? A tradeoff
            you had to make, a limitation you had to design around, a moment that changed your
            approach.]
          </p>
        </div>
      </div>

      <div className="block">
        <div className="col">
          <span className="label">Something you&rsquo;d do differently</span>
          <p>
            [Optional — is there a project, decision, or approach from this chapter you&rsquo;d
            handle differently now? What did it teach you?]
          </p>
        </div>
      </div>

      <div className="quote">
        <p>[Pull a line from one of the sections above once written — a sentence worth surfacing on its own.]</p>
      </div>

      <div className="block">
        <div className="col">
          <span className="label">Architect turned AI engineer</span>
          <p>
            [How did this chapter shape who you are as an engineer now? Connect the architecture
            years to the systems work you do today — what carried over, what you left behind, and
            what surprised you about the transition.]
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
