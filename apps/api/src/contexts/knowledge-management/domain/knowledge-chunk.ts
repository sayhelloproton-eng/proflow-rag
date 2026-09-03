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
