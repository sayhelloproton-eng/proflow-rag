import type { CorpusClass } from '../domain/corpus-policy.js';
import type { KnowledgeChunk } from '../domain/knowledge-chunk.js';

export interface ChunkDocumentRequest {
  repositoryUrl: string;
  commitSha: string;
  filePath: string;
  corpusClass: CorpusClass;
  content: string;
}

export interface DocumentChunkerPort {
  readonly profileVersion: string;
  chunkDocument(request: ChunkDocumentRequest): KnowledgeChunk[];
}
