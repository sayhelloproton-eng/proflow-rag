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
