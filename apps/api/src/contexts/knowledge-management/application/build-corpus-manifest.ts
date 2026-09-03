import type { SourceRepositoryPort } from '../contracts/source-repository.port.js';
import { CorpusManifest } from '../domain/corpus-manifest.js';
import { classifyCorpusPath, CORPUS_POLICY_VERSION } from '../domain/corpus-policy.js';
import type { RepositorySnapshot } from '../domain/repository-snapshot.js';

export class BuildCorpusManifest {
  constructor(private readonly sourceRepository: SourceRepositoryPort) {}

  async execute(snapshot: RepositorySnapshot): Promise<CorpusManifest> {
    const filePaths = await this.sourceRepository.listFilesAtCommit({
      repositoryUrl: snapshot.repositoryUrl,
      commitSha: snapshot.commitSha,
    });
    const decisions = filePaths.map(filePath => ({
      filePath,
      decision: classifyCorpusPath(filePath),
    }));
    return CorpusManifest.create(snapshot, CORPUS_POLICY_VERSION, decisions);
  }
}
