export type Visibility =
  | "PRIVATE"
  | "FUTURE_SELF"
  | "CLOSE_CIRCLE"
  | "UNLISTED"
  | "PUBLIC_EXCERPT"
  | "PUBLIC";

export type AssetKind =
  | "IMAGE"
  | "VIDEO"
  | "AUDIO"
  | "DOCUMENT"
  | "JOURNAL"
  | "ROUTE"
  | "OTHER";

export type AssetState =
  | "INGESTED"
  | "ENRICHING"
  | "ENRICHED"
  | "DRAFT_SOURCE"
  | "ARCHIVED";

export type PublicationState =
  | "DRAFT"
  | "IN_REVIEW"
  | "READY"
  | "PUBLISHED"
  | "RETIRED";

export type ProvenanceKind =
  | "HUMAN_ORIGINAL"
  | "HUMAN_EDITED"
  | "AI_ASSISTED"
  | "AI_GENERATED_REVIEWED"
  | "AUTOMATIC_DERIVATIVE";

export interface VaultAsset {
  id: string;
  storageKey: string;
  checksum: string;
  kind: AssetKind;
  mimeType: string;
  byteSize: number;
  capturedAt?: string;
  ingestedAt: string;
  visibility: Visibility;
  state: AssetState;
  sourceSystem?: string;
  sourceExternalId?: string;
}

export interface Publication {
  id: string;
  slug: string;
  title: string;
  state: PublicationState;
  visibility: Visibility;
  publishedAt?: string;
  sourceAssetIds: string[];
  currentRevisionId: string;
}

export interface Revision {
  id: string;
  publicationId: string;
  body: string;
  createdAt: string;
  provenance: ProvenanceKind;
  sourceAssetIds: string[];
  aiSessionId?: string;
}
