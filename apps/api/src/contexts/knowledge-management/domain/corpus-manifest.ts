import { createHash } from 'node:crypto';
import type { RepositorySnapshot } from './repository-snapshot.js';
import type { CorpusClass, CorpusExcludeReason, CorpusPathDecision } from './corpus-policy.js';

export interface CorpusManifestEntry {
  filePath: string;
  status: 'accepted' | 'excluded';
  corpusClass?: CorpusClass;
  reason?: CorpusExcludeReason;
}

export class CorpusManifest {
  readonly policyVersion: string;
  readonly repositoryUrl: string;
  readonly sourceCommitSha: string;
  readonly entries: readonly CorpusManifestEntry[];
  readonly manifestHash: string;

  private constructor(
    snapshot: RepositorySnapshot,
    policyVersion: string,
    entries: CorpusManifestEntry[],
    manifestHash: string,
  ) {
    this.policyVersion = policyVersion;
    this.repositoryUrl = snapshot.repositoryUrl;
    this.sourceCommitSha = snapshot.commitSha;
    this.entries = entries;
    this.manifestHash = manifestHash;
  }

  static create(
    snapshot: RepositorySnapshot,
    policyVersion: string,
    decisions: Array<{ filePath: string; decision: CorpusPathDecision }>,
  ): CorpusManifest {
    const entries = decisions.map(({ filePath, decision }) => ({ filePath, ...decision }))
      .sort((a, b) => a.filePath < b.filePath ? -1 : a.filePath > b.filePath ? 1 : 0);
    if (new Set(entries.map(entry => entry.filePath)).size !== entries.length) {
      throw new Error('CORPUS_MANIFEST_DUPLICATE_PATH');
    }
    const canonical = JSON.stringify({
      policyVersion,
      repositoryUrl: snapshot.repositoryUrl,
      sourceCommitSha: snapshot.commitSha,
      entries,
    });
    const manifestHash = createHash('sha256').update(canonical).digest('hex');
    return new CorpusManifest(snapshot, policyVersion, entries, manifestHash);
  }

  get acceptedEntries(): readonly CorpusManifestEntry[] {
    return this.entries.filter(entry => entry.status === 'accepted');
  }

  get excludedEntries(): readonly CorpusManifestEntry[] {
    return this.entries.filter(entry => entry.status === 'excluded');
  }
}
