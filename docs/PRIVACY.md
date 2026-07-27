# Privacy Model

## Defaults

- Every new asset: `PRIVATE`
- Every new relationship: `PRIVATE`
- Every AI session: `PRIVATE`
- Every new publication: `DRAFT` + `PRIVATE`

## Visibility levels

- PRIVATE: only the owner.
- FUTURE_SELF: private, but eligible for resurfacing prompts.
- CLOSE_CIRCLE: authenticated approved users.
- UNLISTED: possession of a link is required; not indexed.
- PUBLIC_EXCERPT: selected material only.
- PUBLIC: searchable public content.

## Required controls before production

- Strong authentication and MFA for Studio.
- Authorization check inside every Studio route and mutation.
- Separate public and private media delivery.
- Signed URLs with short expiration.
- Audit trail for privacy changes and publication actions.
- Export of all metadata and originals.
- Provider API keys stored only server-side.
- People and conversation material reviewed for consent and redaction.
- Precise locations transformed or withheld before publication.
