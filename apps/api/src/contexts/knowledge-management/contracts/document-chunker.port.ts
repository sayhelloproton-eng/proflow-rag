/**
 * 文件职责：声明 Knowledge Management 对“文档如何切成 Chunk”的能力契约。
 * 所属层：Knowledge Management / Contract Port。
 * 关键边界：Domain/Application 只依赖这个抽象，不依赖 Babel、Markdown parser 等具体实现。
 */

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
