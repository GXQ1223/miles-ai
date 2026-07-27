-- miles.ai conceptual PostgreSQL schema
-- Originals are immutable; publications are revisions derived from sources.

create extension if not exists pgcrypto;

create type visibility as enum (
  'PRIVATE',
  'FUTURE_SELF',
  'CLOSE_CIRCLE',
  'UNLISTED',
  'PUBLIC_EXCERPT',
  'PUBLIC'
);

create type asset_kind as enum (
  'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'JOURNAL', 'ROUTE', 'OTHER'
);

create type publication_state as enum (
  'DRAFT', 'IN_REVIEW', 'READY', 'PUBLISHED', 'RETIRED'
);

create type provenance_kind as enum (
  'HUMAN_ORIGINAL',
  'HUMAN_EDITED',
  'AI_ASSISTED',
  'AI_GENERATED_REVIEWED',
  'AUTOMATIC_DERIVATIVE'
);

create table storage_objects (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  bucket text not null,
  object_key text not null,
  version_id text,
  checksum_sha256 text not null,
  byte_size bigint not null check (byte_size >= 0),
  mime_type text not null,
  created_at timestamptz not null default now(),
  unique (provider, bucket, object_key, coalesce(version_id, ''))
);

create table assets (
  id uuid primary key default gen_random_uuid(),
  storage_object_id uuid references storage_objects(id),
  kind asset_kind not null,
  title text,
  description text,
  captured_at timestamptz,
  ingested_at timestamptz not null default now(),
  visibility visibility not null default 'PRIVATE',
  source_system text,
  source_external_id text,
  original_filename text,
  metadata jsonb not null default '{}'::jsonb,
  deleted_at timestamptz
);

create table asset_derivatives (
  id uuid primary key default gen_random_uuid(),
  source_asset_id uuid not null references assets(id),
  storage_object_id uuid references storage_objects(id),
  derivative_kind text not null,
  metadata jsonb not null default '{}'::jsonb,
  provenance provenance_kind not null default 'AUTOMATIC_DERIVATIVE',
  created_at timestamptz not null default now()
);

create table people (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  private_notes text,
  public_slug text unique,
  created_at timestamptz not null default now()
);

create table places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  latitude numeric,
  longitude numeric,
  private_precision text,
  public_precision text,
  created_at timestamptz not null default now()
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null
);

create table collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  visibility visibility not null default 'PRIVATE',
  collection_type text not null,
  created_at timestamptz not null default now()
);

-- Generic graph: one artifact can participate in many views without duplication.
create table relationships (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null,
  subject_id uuid not null,
  predicate text not null,
  object_type text not null,
  object_id uuid not null,
  metadata jsonb not null default '{}'::jsonb,
  visibility visibility not null default 'PRIVATE',
  created_at timestamptz not null default now()
);

create table publications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  dek text,
  state publication_state not null default 'DRAFT',
  visibility visibility not null default 'PRIVATE',
  current_revision_id uuid,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table publication_revisions (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid not null references publications(id),
  body_markdown text not null,
  provenance provenance_kind not null,
  ai_session_id uuid,
  created_at timestamptz not null default now()
);

alter table publications
  add constraint publications_current_revision_fk
  foreign key (current_revision_id) references publication_revisions(id);

create table publication_sources (
  publication_revision_id uuid not null references publication_revisions(id),
  asset_id uuid not null references assets(id),
  usage_note text,
  primary key (publication_revision_id, asset_id)
);

create table ai_sessions (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  model text,
  purpose text not null,
  status text not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  input_metadata jsonb not null default '{}'::jsonb,
  output_metadata jsonb not null default '{}'::jsonb
);

create table ai_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references ai_sessions(id),
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table consent_records (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references people(id),
  scope text not null,
  status text not null,
  note text,
  recorded_at timestamptz not null default now()
);

create index assets_captured_at_idx on assets(captured_at desc);
create index assets_visibility_idx on assets(visibility);
create index relationships_subject_idx on relationships(subject_type, subject_id);
create index relationships_object_idx on relationships(object_type, object_id);
create index publications_state_idx on publications(state, published_at desc);
