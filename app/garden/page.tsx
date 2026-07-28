import { ImageCard } from "@/components/image-card";

const ideas = [
  { k: "Seed", title: "AI should preserve provenance", d: "A summary should never replace the thing that was actually experienced or written." },
  { k: "Growing", title: "The FDE as translator", d: "The difficult work often happens before code: defining the real problem and constructing context." },
  { k: "Evergreen", title: "Consistency becomes visible late", d: "Running, learning, and career change share the same delayed feedback loop." }
];

export default function Page() {
  return (
    <div>
      <div className="headCentered">
        <span className="eyebrow">Library / Garden</span>
        <h1>Ideas that are allowed to grow.</h1>
        <p className="lede">
          Not every thought needs to pretend to be finished. Notes can mature from seeds into evergreen essays.
        </p>
      </div>

      <div className="heroimg-wrap">
        <ImageCard imageKey="garden" width={1800} height={1100} className="heroimg" />
      </div>

      <div className="block-section">
        <div className="grid">
          {ideas.map((idea) => (
            <article className="card" key={idea.k}>
              <small>{idea.k.toUpperCase()}</small>
              <div>
                <h2>{idea.title}</h2>
                <p>{idea.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
