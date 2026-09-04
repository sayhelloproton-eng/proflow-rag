/**
 * 文件职责：按文档/代码/测试的语义结构把 CorpusDocument 切成可检索 KnowledgeChunk。
 * 所属层：Infrastructure / Parsing Adapter，实现 DocumentChunkerPort。
 * 关键边界：优先保留 Markdown heading、TypeScript symbol、test/setup 等语义边界；固定长度只用于过大结构的二次切分。
 */

import { parse } from '@babel/parser';
import * as t from '@babel/types';
import type { ChunkDocumentRequest, DocumentChunkerPort } from '../../contexts/knowledge-management/contracts/document-chunker.port.js';
import { KnowledgeChunk, type ChunkKind, type ChunkStructure, type ParserMode } from '../../contexts/knowledge-management/domain/knowledge-chunk.js';
import { SourceCoordinate } from '../../contexts/knowledge-management/domain/source-coordinate.js';

export interface StructureAwareChunkerOptions {
  maxChunkChars?: number;
  overlapLines?: number;
}

interface RawChunk {
  startLine: number;
  endLine: number;
  structure: ChunkStructure;
}

export class StructureAwareDocumentChunker implements DocumentChunkerPort {
  readonly profileVersion = 'structure-aware-v0.1';
  private readonly maxChunkChars: number;
  private readonly overlapLines: number;

  constructor(options: StructureAwareChunkerOptions = {}) {
    this.maxChunkChars = options.maxChunkChars ?? 6_000;
    this.overlapLines = options.overlapLines ?? 4;
  }

  chunkDocument(request: ChunkDocumentRequest): KnowledgeChunk[] {
    const lines = request.content.split(/\r?\n/);
    if (!request.content.trim()) return [];
    const raw = this.selectStrategy(request, lines);
    return raw.flatMap(chunk => this.splitIfOversized(chunk, lines))
      .filter(chunk => lines.slice(chunk.startLine - 1, chunk.endLine).some(line => line.trim()))
      .map(chunk => KnowledgeChunk.create({
        content: lines.slice(chunk.startLine - 1, chunk.endLine).join('\n'),
        source: SourceCoordinate.create({
          repositoryUrl: request.repositoryUrl,
          commitSha: request.commitSha,
          filePath: request.filePath,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
        }),
        structure: chunk.structure,
      }));
  }

  private selectStrategy(request: ChunkDocumentRequest, lines: string[]): RawChunk[] {
    const lower = request.filePath.toLowerCase();
    // 先按内容类型选择语义策略；只有解析失败或非结构文本才退化到安全文本切分。
    if (lower.endsWith('.md')) return this.chunkMarkdown(lines);
    if (lower.endsWith('.ts') || lower.endsWith('.tsx')) {
      const isTest = request.corpusClass === 'TEST' || request.corpusClass === 'LIVE_TEST';
      try {
        return isTest
          ? this.chunkTests(request.content, request.filePath)
          : this.chunkTypeScript(request.content, request.filePath);
      } catch {
        // 解析失败不能让整个 snapshot 构建崩溃；退化模式会被 parserMode 记录，后续 Eval 可发现并处理。
        return this.chunkText(lines, 'TYPESCRIPT_FALLBACK', isTest ? 'TEST_CASE' : 'CODE_BLOCK');
      }
    }
    return this.chunkText(lines, 'TEXT_FALLBACK', 'TEXT_BLOCK');
  }

  private chunkMarkdown(lines: string[]): RawChunk[] {
    const headings: Array<{ line: number; level: number; title: string }> = [];
    lines.forEach((line, index) => {
      const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
      if (match) headings.push({ line: index + 1, level: match[1].length, title: match[2].trim() });
    });
    if (!headings.length) return this.chunkText(lines, 'MARKDOWN_HEADING', 'DOCUMENT_SECTION');

    const chunks: RawChunk[] = [];
    if (headings[0].line > 1 && lines.slice(0, headings[0].line - 1).some(line => line.trim())) {
      chunks.push({
        startLine: 1,
        endLine: headings[0].line - 1,
        structure: { kind: 'DOCUMENT_SECTION', parserMode: 'MARKDOWN_HEADING', label: 'preamble' },
      });
    }
    const headingPath: string[] = [];
    headings.forEach((heading, index) => {
      headingPath.length = heading.level - 1;
      headingPath[heading.level - 1] = heading.title;
      chunks.push({
        startLine: heading.line,
        endLine: (headings[index + 1]?.line ?? lines.length + 1) - 1,
        structure: {
          kind: 'DOCUMENT_SECTION',
          parserMode: 'MARKDOWN_HEADING',
          label: heading.title,
          headingPath: [...headingPath].filter(Boolean),
        },
      });
    });
    return chunks;
  }

  private parseTypeScript(content: string, filePath: string): t.File {
    return parse(content, {
      sourceType: 'unambiguous',
      sourceFilename: filePath,
      plugins: filePath.toLowerCase().endsWith('.tsx') ? ['typescript', 'jsx'] : ['typescript'],
    });
  }

  private chunkTypeScript(content: string, filePath: string): RawChunk[] {
    const ast = this.parseTypeScript(content, filePath);
    const chunks: RawChunk[] = [];
    const buffered: t.Statement[] = [];
    const flushBuffered = () => {
      if (!buffered.length) return;
      chunks.push(this.nodeRange(buffered[0], buffered.at(-1)!, 'CODE_BLOCK', 'TYPESCRIPT_AST', 'module statements'));
      buffered.length = 0;
    };

    for (const statement of ast.program.body) {
      if (!t.isStatement(statement)) continue;
      const descriptor = this.symbolDescriptor(statement);
      if (!descriptor) {
        buffered.push(statement);
        continue;
      }
      flushBuffered();
      if (t.isClassDeclaration(statement) && this.nodeTextLength(statement) > this.maxChunkChars && statement.body.body.length) {
        const parent = statement.id?.name ?? 'anonymous class';
        for (const member of statement.body.body) {
          const label = this.classMemberLabel(member) ?? parent;
          chunks.push(this.nodeRange(member, member, 'CODE_SYMBOL', 'TYPESCRIPT_AST', label, parent));
        }
      } else {
        chunks.push(this.nodeRange(statement, statement, 'CODE_SYMBOL', 'TYPESCRIPT_AST', descriptor));
      }
    }
    flushBuffered();
    return chunks.length ? chunks : [{ startLine: 1, endLine: content.split(/\r?\n/).length, structure: { kind: 'CODE_BLOCK', parserMode: 'TYPESCRIPT_AST', label: 'file' } }];
  }

  private chunkTests(content: string, filePath: string): RawChunk[] {
    const ast = this.parseTypeScript(content, filePath);
    const chunks: RawChunk[] = [];
    const occupiedTopLevel = new Set<t.Statement>();

    for (const statement of ast.program.body) {
      if (!t.isStatement(statement)) continue;
      this.visitTestNode(statement, [], statement, chunks, occupiedTopLevel);
    }

    for (const statement of ast.program.body) {
      if (!t.isStatement(statement) || occupiedTopLevel.has(statement) || t.isImportDeclaration(statement)) continue;
      const descriptor = this.symbolDescriptor(statement);
      if (descriptor) chunks.push(this.nodeRange(statement, statement, 'TEST_SETUP', 'TEST_AST', descriptor));
    }

    return chunks.length
      ? chunks.sort((a, b) => a.startLine - b.startLine || a.endLine - b.endLine)
      : this.chunkTypeScript(content, filePath).map(chunk => ({
        ...chunk,
        structure: { ...chunk.structure, parserMode: 'TEST_AST' },
      }));
  }

  private visitTestNode(
    node: t.Node,
    suites: string[],
    topLevel: t.Statement,
    chunks: RawChunk[],
    occupiedTopLevel: Set<t.Statement>,
  ): void {
    if (t.isCallExpression(node)) {
      const call = this.callName(node.callee);
      const title = this.stringArgument(node.arguments[0]);
      if ((call === 'describe' || call === 'context') && title) {
        this.visitChildren(node, [...suites, title], topLevel, chunks, occupiedTopLevel);
        return;
      }
      if ((call === 'test' || call === 'it') && title) {
        chunks.push(this.nodeRange(node, node, 'TEST_CASE', 'TEST_AST', [...suites, title].join(' > ')));
        occupiedTopLevel.add(topLevel);
        return;
      }
      if (['before', 'beforeEach', 'after', 'afterEach'].includes(call ?? '')) {
        chunks.push(this.nodeRange(node, node, 'TEST_SETUP', 'TEST_AST', [...suites, call!].join(' > ')));
        occupiedTopLevel.add(topLevel);
        return;
      }
    }
    this.visitChildren(node, suites, topLevel, chunks, occupiedTopLevel);
  }

  private visitChildren(
    node: t.Node,
    suites: string[],
    topLevel: t.Statement,
    chunks: RawChunk[],
    occupiedTopLevel: Set<t.Statement>,
  ): void {
    for (const key of t.VISITOR_KEYS[node.type] ?? []) {
      const child = (node as unknown as Record<string, unknown>)[key];
      if (Array.isArray(child)) {
        for (const item of child) if (item && typeof item === 'object' && 'type' in item) {
          this.visitTestNode(item as t.Node, suites, topLevel, chunks, occupiedTopLevel);
        }
      } else if (child && typeof child === 'object' && 'type' in child) {
        this.visitTestNode(child as t.Node, suites, topLevel, chunks, occupiedTopLevel);
      }
    }
  }

  private chunkText(lines: string[], parserMode: ParserMode, kind: ChunkKind): RawChunk[] {
    return [{ startLine: 1, endLine: lines.length, structure: { kind, parserMode, label: 'file' } }];
  }

  private splitIfOversized(raw: RawChunk, lines: string[]): RawChunk[] {
    const text = lines.slice(raw.startLine - 1, raw.endLine).join('\n');
    // 语义边界优先；只有单个语义单元过大时才做带 overlap 的二次切分，尽量避免先按长度撕裂语义。
    if (text.length <= this.maxChunkChars) return [raw];
    const result: RawChunk[] = [];
    let start = raw.startLine;
    let part = 1;
    while (start <= raw.endLine) {
      let nextLine = start;
      let chars = 0;
      while (nextLine <= raw.endLine) {
        const nextChars = lines[nextLine - 1].length + (nextLine > start ? 1 : 0);
        if (nextLine > start && chars + nextChars > this.maxChunkChars) break;
        chars += nextChars;
        nextLine += 1;
      }
      const end = Math.max(start, nextLine - 1);
      result.push({ startLine: start, endLine: end, structure: { ...raw.structure, part } });
      if (end >= raw.endLine) break;
      start = Math.max(start + 1, end - this.overlapLines + 1);
      part += 1;
    }
    return result;
  }

  private nodeRange(
    first: t.Node,
    last: t.Node,
    kind: ChunkKind,
    parserMode: ParserMode,
    label?: string,
    parentLabel?: string,
  ): RawChunk {
    if (!first.loc || !last.loc) throw new Error('AST_LOCATION_MISSING');
    return {
      startLine: first.loc.start.line,
      endLine: last.loc.end.line,
      structure: {
        kind,
        parserMode,
        ...(label ? { label } : {}),
        ...(parentLabel ? { parentLabel } : {}),
      },
    };
  }

  private symbolDescriptor(node: t.Statement): string | undefined {
    if (t.isFunctionDeclaration(node)) return node.id?.name ?? 'anonymous function';
    if (t.isClassDeclaration(node)) return node.id?.name ?? 'anonymous class';
    if (t.isTSInterfaceDeclaration(node) || t.isTSTypeAliasDeclaration(node) || t.isTSEnumDeclaration(node)) return node.id.name;
    if (t.isVariableDeclaration(node)) return node.declarations.map(decl => this.bindingName(decl.id)).filter(Boolean).join(', ');
    if (t.isExportNamedDeclaration(node) || t.isExportDefaultDeclaration(node)) {
      if (node.declaration && t.isStatement(node.declaration)) return this.symbolDescriptor(node.declaration) ?? 'export';
      return 'export';
    }
    return undefined;
  }

  private classMemberLabel(node: t.ClassBody['body'][number]): string | undefined {
    if ('key' in node && node.key) {
      if (t.isIdentifier(node.key)) return node.key.name;
      if (t.isStringLiteral(node.key) || t.isNumericLiteral(node.key)) return String(node.key.value);
    }
    return undefined;
  }

  private bindingName(node: t.VariableDeclarator['id']): string {
    if (t.isIdentifier(node)) return node.name;
    return 'binding';
  }

  private callName(callee: t.CallExpression['callee']): string | undefined {
    if (t.isIdentifier(callee)) return callee.name;
    if (t.isMemberExpression(callee) && !callee.computed && t.isIdentifier(callee.property)) return callee.property.name;
    return undefined;
  }

  private stringArgument(argument: t.CallExpression['arguments'][number] | undefined): string | undefined {
    if (!argument) return undefined;
    if (t.isStringLiteral(argument)) return argument.value;
    if (t.isTemplateLiteral(argument) && argument.expressions.length === 0) return argument.quasis.map(part => part.value.cooked ?? part.value.raw).join('');
    return undefined;
  }

  private nodeTextLength(node: t.Node): number {
    return Math.max(0, (node.end ?? 0) - (node.start ?? 0));
  }
}
