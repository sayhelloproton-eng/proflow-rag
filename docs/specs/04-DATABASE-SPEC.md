# Database Spec

Status: DRAFT_FOR_FREEZE

## Engine
Use native PostgreSQL on the Mac with the pgvector extension. NestJS connects directly through `pg`; no ORM layer is allowed.

## Database / Namespaces
Database: `proflow_rag`.
- `rag`: documents, chunks, embeddings and retrieval data.
- `ingestion`: snapshots, runs and rebuild state.
- `app`: visitors, conversations, messages, feedback and request traces.
- `system`: settings and migration bookkeeping.

## Snapshot Rule
All indexed records are linked to an immutable snapshot and source commit SHA. Queries only read the active snapshot.

## Activation
A candidate snapshot is built without deleting the active snapshot. After validation passes, active snapshot selection changes atomically. Keep the immediately previous successful snapshot for rollback.

## Repository Ownership
Git stores migrations, schema SQL, index definitions and setup scripts. PostgreSQL data files, vectors and runtime records stay local and are never committed.
