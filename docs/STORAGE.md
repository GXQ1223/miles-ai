# Storage Strategy

## Two distinct needs

### Human library
Use Google Photos/Drive for:
- iPhone backup
- familiar browsing
- albums
- resurfacing old memories
- manual organization and sharing

### Application object store
Use S3-compatible object storage for:
- API-controlled upload and retrieval
- immutable originals
- checksums and metadata
- lifecycle policies
- signed URLs
- derivatives
- integration with the website

The application uses a `StorageProvider` interface so it can move among AWS S3,
Cloudflare R2, Backblaze B2, or another compatible provider.

## Recommended initial policy

```text
Google Photos / Drive
  └── personal browsing copy

Object storage bucket
  ├── vault/originals/YYYY/MM/<uuid>.<ext>
  ├── vault/derivatives/thumbnails/<uuid>.webp
  ├── vault/derivatives/transcripts/<uuid>.json
  ├── vault/derivatives/audio/<uuid>.mp3
  └── gallery/public/<publication-id>/<asset-id>.<ext>
```

## Storage classes

Start with normal hot storage. Add lifecycle rules only after real access data exists.

Potential lifecycle later:
- Originals accessed frequently: hot object storage.
- Old originals with a second accessible copy: infrequent-access tier.
- Disaster-recovery copy: archive tier.
- Public derivatives: hot storage behind CDN.

Do not put the only copy of a meaningful memory into an archive class with slow,
expensive restoration.
