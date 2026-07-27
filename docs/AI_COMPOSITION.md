# AI-Assisted Composition

## Goal

Turn selected source artifacts plus Miles's present-day memory into a readable
draft through dialogue, while preserving source provenance.

## Session flow

```text
select sources
  → generate temporary signed URLs
  → add present memory and reader intent
  → provider analyzes selected context
  → assistant proposes questions
  → dialogue
  → draft revision
  → human edit
  → provenance review
  → explicit publish
```

## Provider abstraction

`AICompositionProvider` receives:
- selected assets
- extracted text / captions / transcripts
- temporary media URLs
- present-day memory
- intended reader outcome
- prior dialogue

It returns:
- title
- summary
- Markdown body
- source asset IDs
- provenance marker

## Safety

- Never send the entire Vault to a model.
- Send only explicitly selected context.
- Use temporary signed URLs.
- Do not send private third-party conversations without review.
- Store the model/provider/version and prompt metadata.
- Keep the final human edit distinct from the AI-generated revision.
