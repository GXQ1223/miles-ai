import { ImageCard } from "@/components/image-card";

const entries = [
  { k: "Race", title: "NYC Marathon 2024", d: "2:46:06 — one visible result built from thousands of quiet decisions." },
  { k: "Cycle", title: "The next marathon", d: "A future training cycle will combine workouts, images, voice notes, and later reflection." },
  { k: "Community", title: "NewBee Running Club", d: "I built the full frontend and backend for this NYC running community’s platform — the miles matter more when they’re shared." },
  { k: "Route", title: "New York", d: "Places become meaningful through repetition, weather, effort, and people." }
];

export default function Page() {
  return (
    <div>
      <div className="headCentered">
        <span className="eyebrow">Running Trail</span>
        <h1>Distance as memory.</h1>
        <p className="lede">
          Races, training cycles, routes, photographs, people, and what the miles changed.
        </p>
      </div>

      <div className="heroimg-wrap">
        <ImageCard imageKey="miles" width={1800} height={1100} className="heroimg" />
      </div>

      <div className="block-section">
        <div className="grid">
          {entries.map((entry) => (
            <article className="card" key={entry.k}>
              <small>{entry.k.toUpperCase()}</small>
              <div>
                <h2>{entry.title}</h2>
                <p>{entry.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
