/**
 * 文件职责：定义可审计、可重复构建的 Corpus Manifest 及其内容 hash。
 * 所属层：Knowledge Management / Domain。
 * 关键边界：同一 source + policy 必须生成稳定排序与稳定 hash，避免知识边界漂移不可追踪。
 */

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
    // Git 枚举顺序不应该影响知识身份；先稳定排序，才能得到可重复的 manifest/hash。
    const entries = decisions.map(({ filePath, decision }) => ({ filePath, ...decision }))
      .sort((a, b) => a.filePath < b.filePath ? -1 : a.filePath > b.filePath ? 1 : 0);
    if (new Set(entries.map(entry => entry.filePath)).size !== entries.length) {
      throw new Error('CORPUS_MANIFEST_DUPLICATE_PATH');
    }
    // hash 同时绑定 source、policy 和逐文件决策：任何一项变化都必须显式产生新的知识边界身份。
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
