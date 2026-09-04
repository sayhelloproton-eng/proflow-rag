/**
 * 文件职责：把固定 RepositorySnapshot 的 Git tree 转换成版本化 Corpus Manifest。
 * 所属层：Knowledge Management / Application。
 * 关键边界：只编排 source port 与 corpus policy，不直接实现 Git 访问或路径规则。
 */

import type { SourceRepositoryPort } from '../contracts/source-repository.port.js';
import { CorpusManifest } from '../domain/corpus-manifest.js';
import { classifyCorpusEntry, CORPUS_POLICY_VERSION } from '../domain/corpus-policy.js';
import type { RepositorySnapshot } from '../domain/repository-snapshot.js';

export class BuildCorpusManifest {
  constructor(private readonly sourceRepository: SourceRepositoryPort) {}

  async execute(snapshot: RepositorySnapshot): Promise<CorpusManifest> {
    // 这里读取 Git tree entry，而不只读路径名：Corpus Policy 需要 entry kind 才能识别 symlink 等别名。
    const entries = await this.sourceRepository.listEntriesAtCommit({
      repositoryUrl: snapshot.repositoryUrl,
      commitSha: snapshot.commitSha,
    });
    const decisions = entries.map(entry => ({
      filePath: entry.filePath,
      decision: classifyCorpusEntry(entry),
    }));
    return CorpusManifest.create(snapshot, CORPUS_POLICY_VERSION, decisions);
  }
}
