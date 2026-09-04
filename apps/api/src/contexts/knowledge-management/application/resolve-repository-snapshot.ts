/**
 * 文件职责：把公开远端 main 解析为不可变 RepositorySnapshot。
 * 所属层：Knowledge Management / Application。
 * 关键边界：公共知识真源来自远端 authority，不读取本地 working tree 作为 source truth。
 */

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
    // main 是会移动的引用；后续 Corpus/Chunk/Index 必须绑定这一次解析出的 immutable commit。
    const commitSha = await this.sourceRepository.resolveCommit(this.authority);
    return RepositorySnapshot.create({ ...this.authority, commitSha });
  }
}
