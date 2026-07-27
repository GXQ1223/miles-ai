import { sampleVaultAssets } from "@/lib/content/sample";

export default function VaultPage() {
  return (
    <>
      <span className="eyebrow">SOURCE OF TRUTH</span>
      <h1>Vault</h1>
      <p className="lede">
        Originals remain private and immutable. Essays, thumbnails, transcripts,
        summaries, and voice recordings are derivatives linked back to them.
      </p>
      <table className="table section">
        <thead>
          <tr>
            <th>Captured</th><th>Artifact</th><th>Kind</th><th>Status</th><th>Visibility</th><th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {sampleVaultAssets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.capturedAt}</td>
              <td><strong>{asset.title}</strong><br/><small>{asset.id}</small></td>
              <td>{asset.kind}</td>
              <td>{asset.status}</td>
              <td>{asset.visibility}</td>
              <td>{asset.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
