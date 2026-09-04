/**
 * 文件职责：把已验收的 Corpus Manifest 转换为可检索的 KnowledgeChunk 集合。
 * 所属层：Knowledge Management / Application。
 * 关键边界：只消费固定 RepositorySnapshot 的文件；不决定语料准入规则，也不负责持久化或向量化。
 * 重要保证：每个 Chunk 都必须通过 SourceCoordinate 回读到原文件原行，避免后续 Citation 建立在虚构坐标上。
 */

import type { DocumentChunkerPort } from '../contracts/document-chunker.port.js';
import type { SourceRepositoryPort } from '../contracts/source-repository.port.js';
import type { CorpusManifest } from '../domain/corpus-manifest.js';
import type { CorpusClass } from '../domain/corpus-policy.js';
import type { KnowledgeChunk } from '../domain/knowledge-chunk.js';
import type { RepositorySnapshot } from '../domain/repository-snapshot.js';

export interface BuildCorpusChunksResult {
  chunkerProfileVersion: string;
  documentCount: number;
  chunks: readonly KnowledgeChunk[];
}

export class BuildCorpusChunks {
  constructor(
    private readonly sourceRepository: SourceRepositoryPort,
    private readonly chunker: DocumentChunkerPort,
  ) {}

  async execute(snapshot: RepositorySnapshot, manifest: CorpusManifest): Promise<BuildCorpusChunksResult> {
    if (manifest.sourceCommitSha !== snapshot.commitSha || manifest.repositoryUrl !== snapshot.repositoryUrl) {
      throw new Error('CORPUS_MANIFEST_SOURCE_MISMATCH');
    }
    const accepted = manifest.acceptedEntries;
    const corpusClassByPath = new Map(accepted.map(entry => [entry.filePath, entry.corpusClass as CorpusClass]));
    const files = await this.sourceRepository.readFilesAtCommit({
      repositoryUrl: snapshot.repositoryUrl,
      commitSha: snapshot.commitSha,
      filePaths: accepted.map(entry => entry.filePath),
    });
    if (files.length !== accepted.length) throw new Error('CORPUS_FILE_COUNT_MISMATCH');

    const chunks = files.flatMap(file => this.chunker.chunkDocument({
      repositoryUrl: snapshot.repositoryUrl,
      commitSha: snapshot.commitSha,
      filePath: file.filePath,
      corpusClass: corpusClassByPath.get(file.filePath)!,
      content: file.content,
    }));
    // Citation 的可信度从这里开始：Chunk 保存的行号必须能逐字回读出同一份原文。
    this.assertSourceRoundTrip(files, chunks);
    chunks.sort((a, b) => a.source.filePath.localeCompare(b.source.filePath)
      || a.source.startLine - b.source.startLine
      || a.source.endLine - b.source.endLine
      || a.structure.kind.localeCompare(b.structure.kind));
    return { chunkerProfileVersion: this.chunker.profileVersion, documentCount: files.length, chunks };
  }

  private assertSourceRoundTrip(
    files: Array<{ filePath: string; content: string }>,
    chunks: readonly KnowledgeChunk[],
  ): void {
    const contentByPath = new Map(files.map(file => [file.filePath, file.content]));
    for (const chunk of chunks) {
      const source = contentByPath.get(chunk.source.filePath);
      if (source === undefined) throw new Error('CHUNK_SOURCE_FILE_MISSING');
      const lines = source.split(/\r?\n/);
      const expected = lines.slice(chunk.source.startLine - 1, chunk.source.endLine).join('\n');
      if (expected !== chunk.content) throw new Error(`CHUNK_SOURCE_ROUNDTRIP_FAILED:${chunk.source.filePath}:${chunk.source.startLine}-${chunk.source.endLine}`);
    }
  }
}
