import type { SourceRepositoryPort } from '../contracts/source-repository.port.js';
import { RepositorySnapshot } from '../domain/repository-snapshot.js';

export interface SourceAuthority {
  repositoryUrl: string;
  ref: 'main';
}

export class ResolveRepositorySnapshot {
  constructor(
    private readonly sourceRepository: SourceRepositoryPort,
    private readonly authority: SourceAuthority,
  ) {}

  async execute(): Promise<RepositorySnapshot> {
    const commitSha = await this.sourceRepository.resolveCommit(this.authority);
    return RepositorySnapshot.create({ ...this.authority, commitSha });
  }
}
