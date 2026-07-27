# Architecture

## Product model

```text
                 PRIVATE                                 PUBLIC
┌────────────────────────────┐    deliberate     ┌────────────────────────────┐
│ Vault                      │    composition    │ Gallery                    │
│ originals + source truth   │ ───────────────►  │ pages + essays + exhibits │
└─────────────┬──────────────┘                   └──────────────▲─────────────┘
              │                                                │
              ▼                                                │ publish
┌────────────────────────────┐      human review               │
│ Studio                     │ ─────────────────────────────────┘
│ enrichment, search, AI,    │
│ relationships, revisions   │
└────────────────────────────┘
```

## Non-negotiable boundaries

1. Uploads enter the Vault as `PRIVATE`.
2. Public routes never query raw private assets directly.
3. Every publication has one or more revisions.
4. Every revision records its source assets and provenance.
5. AI output is a derivative, never a replacement for an original.
6. Original object keys are never public URLs.
7. Public media is served through a separate derivative or signed delivery path.
8. Studio requires strong authentication before deployment.

## Suggested deployment

```text
Browser
  │
  ├── Public pages ───────────────► Next.js
  │                                  │
  │                                  ├── PostgreSQL catalog
  │                                  └── public media CDN
  │
  └── Private Studio ─────────────► authenticated Next.js routes
                                     │
                                     ├── presigned multipart upload
                                     ▼
                               object storage
                                     │
                                     ▼
                            background processing
                          thumbnails / OCR / transcript
                          metadata / embeddings / TTS
```

## Separation of concerns

- **Object storage**: original binary files and derivatives.
- **PostgreSQL**: meaning, metadata, relationships, privacy, revisions, provenance.
- **Search index**: later; derived from PostgreSQL plus extracted text.
- **AI providers**: stateless processors receiving temporary signed URLs and selected context.
- **Google Drive/Photos**: external source and human browsing layer, not the core application database.
