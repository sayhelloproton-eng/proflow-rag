/**
 * 文件职责：定义 RAG 检索的最小知识单元 KnowledgeChunk 及其结构元数据。
 * 所属层：Knowledge Management / Domain。
 * 关键边界：Chunk 同时保存内容、真实来源坐标和结构语义；不包含检索 score、Evidence 或回答状态。
 */

import { SourceCoordinate } from './source-coordinate.js';

export type ChunkKind =
  | 'DOCUMENT_SECTION'
  | 'CODE_SYMBOL'
  | 'CODE_BLOCK'
  | 'TEST_CASE'
  | 'TEST_SETUP'
  | 'TEXT_BLOCK';

export type ParserMode = 'MARKDOWN_HEADING' | 'TYPESCRIPT_AST' | 'TEST_AST' | 'TYPESCRIPT_FALLBACK' | 'TEXT_FALLBACK';

export interface ChunkStructure {
  kind: ChunkKind;
  parserMode: ParserMode;
  label?: string;
  parentLabel?: string;
  headingPath?: readonly string[];
  part?: number;
}

export interface KnowledgeChunkProps {
  content: string;
  source: SourceCoordinate;
  structure: ChunkStructure;
}

export class KnowledgeChunk {
  readonly content: string;
  readonly source: SourceCoordinate;
  readonly structure: ChunkStructure;

  private constructor(props: KnowledgeChunkProps) {
    this.content = props.content;
    this.source = props.source;
    this.structure = props.structure;
  }

  static create(props: KnowledgeChunkProps): KnowledgeChunk {
    if (!props.content.trim()) throw new Error('CHUNK_CONTENT_EMPTY');
    return new KnowledgeChunk(props);
  }
}
