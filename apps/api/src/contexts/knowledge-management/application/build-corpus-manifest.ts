import type { SourceRepositoryPort } from '../contracts/source-repository.port.js';
import { CorpusManifest } from '../domain/corpus-manifest.js';
import { classifyCorpusEntry, CORPUS_POLICY_VERSION } from '../domain/corpus-policy.js';
import type { RepositorySnapshot } from '../domain/repository-snapshot.js';

export class BuildCorpusManifest {
  constructor(private readonly sourceRepository: SourceRepositoryPort) {}

  async execute(snapshot: RepositorySnapshot): Promise<CorpusManifest> {
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
