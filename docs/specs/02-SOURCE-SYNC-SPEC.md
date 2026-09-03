# Source Sync Spec

Status: FROZEN_V0_2026-09-03

## Authority
- Only the public ProFlow GitHub repository `main` branch is indexed.
- Feature branches, worktrees and pull-request branches are excluded.
- Every rebuild records the resolved `commit_sha` used as its immutable source snapshot.

## Sync Model
- The RAG host periodically checks the remote `main` SHA.
- If SHA equals the active indexed SHA, the run exits without work.
- If SHA differs, the host fetches/checks out that exact SHA and starts a full rebuild.
- Sync cadence is not frozen until real rebuild duration is measured.
- Only one rebuild may run at a time.

## Corpus Policy
Include useful public project facts: documentation/specs, real source code and tests. Exclude secrets, env files, generated output, caches, dependency directories, coverage, logs and irrelevant machine-specific artifacts.

## Failure Rule
A failed fetch, parse or rebuild must never change the active index.
