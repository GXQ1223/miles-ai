export default function ImportPage() {
  return (
    <>
      <span className="eyebrow">INGEST</span>
      <h1>Import</h1>
      <p className="lede">Bring material into the Vault without publishing it.</p>
      <section className="section grid">
        <article className="card">
          <small>DEVICE</small>
          <h2>Upload photos, videos, audio, or documents</h2>
          <p>Direct multipart upload into the selected object store.</p>
        </article>
        <article className="card">
          <small>GOOGLE</small>
          <h2>Import from Drive or Photos</h2>
          <p>Copy selected originals into the Vault while retaining Google source IDs.</p>
        </article>
        <article className="card">
          <small>TEXT</small>
          <h2>Journal and notes</h2>
          <p>Paste, upload, or later sync from a writing system.</p>
        </article>
      </section>
    </>
  );
}
