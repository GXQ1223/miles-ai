# miles.ai — Life Archive Skeleton

A private-first personal archive with a curated public publishing layer.

## Core rule

**Everything can enter the Vault. Nothing becomes public without an explicit publication record.**

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open:

- Public home: `http://localhost:3000`
- Private studio skeleton: `http://localhost:3000/studio`
- Vault: `http://localhost:3000/studio/vault`
- Composer: `http://localhost:3000/studio/compose`

Authentication is intentionally not implemented yet. Do not deploy the `/studio`
routes publicly before adding authentication and authorization.

## What works now

- Public information architecture
- Private Studio and Vault screens
- Storage abstraction
- Local upload target and local upload endpoint
- S3-compatible presigned upload support
- Draft-composition workflow contract
- Mock AI composer
- PostgreSQL schema design
- Privacy and provenance model
- Roadmap

## Recommended next implementation order

1. Authentication for `/studio`
2. PostgreSQL repository layer
3. Asset ingestion and metadata extraction
4. Google Photos/Drive import connector
5. Real AI provider adapters
6. Draft editor and revision history
7. Explicit publishing workflow
8. Search, relationships, maps and timelines
9. TTS derivatives
10. Background jobs and media processing
