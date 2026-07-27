export default function ComposePage() {
  return (
    <>
      <span className="eyebrow">VAULT → ARTICLE</span>
      <h1>Compose</h1>
      <p className="lede">
        Select source artifacts, add your present-day memory and intent, then use
        dialogue with an AI provider to shape a draft. Nothing publishes automatically.
      </p>
      <form className="section">
        <label className="field">
          <span>Source artifact IDs</span>
          <input placeholder="asset_001, asset_003" />
        </label>
        <label className="field">
          <span>What do you remember now?</span>
          <textarea rows={6} placeholder="Add details the image alone cannot contain..." />
        </label>
        <label className="field">
          <span>What should the reader understand?</span>
          <textarea rows={4} placeholder="The point, audience, tension, or question..." />
        </label>
        <label className="field">
          <span>AI provider</span>
          <select defaultValue="mock">
            <option value="mock">Mock provider</option>
            <option value="openai">OpenAI adapter — future</option>
            <option value="anthropic">Anthropic adapter — future</option>
          </select>
        </label>
        <button type="button">Start composition session</button>
      </form>
    </>
  );
}
