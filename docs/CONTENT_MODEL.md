# Content Model

## Why the atomic unit is not a blog post

A photograph can belong to a person, place, race, year, idea, project, and essay.
Store it once, then connect it.

## Main entities

- Asset: immutable source artifact.
- Derivative: thumbnail, transcript, OCR, embedding, compressed video, TTS audio.
- Publication: public-facing container.
- Revision: a version of a publication.
- Collection: a deliberately curated set.
- Relationship: graph edge connecting any two entities.
- Person: private identity record with an optional public representation.
- Place: precise private location with a separately controlled public precision.
- AI session: complete provenance for machine-assisted transformations.

## Example

```text
Asset: marathon_finish.jpg
  captured_at: 2024-11-03
  visibility: PRIVATE
  relationships:
    ├── occurred_at → New York
    ├── depicts → Miles
    ├── belongs_to → NYC Marathon 2024 collection
    ├── related_to → consistency idea
    └── source_for → "Consistency becomes visible late" essay
```

## Publication lifecycle

```text
DRAFT → IN_REVIEW → READY → PUBLISHED → RETIRED
```

Publishing creates a public representation. It does not change the privacy of the original.
