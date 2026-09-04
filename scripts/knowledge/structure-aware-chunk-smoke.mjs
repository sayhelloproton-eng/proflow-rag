/**
 * 文件职责：在固定的真实 ProFlow commit 上全量验证 P1-C 结构感知切块，而不是只验证人造 fixture。
 * 所属层：Verification / Knowledge smoke。
 * 关键证据：文档数量、Chunk 分布、parser fallback、SourceCoordinate 可回读性与稳定 chunk-set hash。
 */

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { BuildCorpusChunks } from '../../apps/api/dist/contexts/knowledge-management/application/build-corpus-chunks.js';
import { BuildCorpusManifest } from '../../apps/api/dist/contexts/knowledge-management/application/build-corpus-manifest.js';
import { RepositorySnapshot } from '../../apps/api/dist/contexts/knowledge-management/domain/repository-snapshot.js';
import { GitSourceRepositoryAdapter } from '../../apps/api/dist/infrastructure/git/git-source-repository.adapter.js';
import { StructureAwareDocumentChunker } from '../../apps/api/dist/infrastructure/parsing/structure-aware-document-chunker.js';

// 固定 immutable commit，保证每次机械验证面对的是同一批真实知识原料。
const snapshot = RepositorySnapshot.create({
  repositoryUrl: 'https://github.com/sayhelloproton-eng/proflow.git',
  ref: 'main',
  commitSha: 'c85e986b56eca8be3e5c016a14bc1470ee656d87',
});
const repository = new GitSourceRepositoryAdapter(90_000);
const manifest = await new BuildCorpusManifest(repository).execute(snapshot);
assert.equal(manifest.acceptedEntries.length, 806);
assert.equal(manifest.manifestHash, '66e5c6adee6ffd7cfb8f8c3fb6070e75fe2f7e30d03c42e361c12b094077e7b2');

const result = await new BuildCorpusChunks(repository, new StructureAwareDocumentChunker()).execute(snapshot, manifest);
assert.equal(result.documentCount, 806);
assert.ok(result.chunks.length > result.documentCount, 'structure-aware chunking should split at least some documents');

const countBy = (values) => Object.fromEntries([...values.reduce((map, value) => map.set(value, (map.get(value) ?? 0) + 1), new Map()).entries()].sort());
const parserCounts = countBy(result.chunks.map(chunk => chunk.structure.parserMode));
const kindCounts = countBy(result.chunks.map(chunk => chunk.structure.kind));
const fallbackPaths = [...new Set(result.chunks.filter(chunk => chunk.structure.parserMode === 'TYPESCRIPT_FALLBACK').map(chunk => chunk.source.filePath))].sort();

const sortedSizes = result.chunks.map(chunk => chunk.content.length).sort((a, b) => a - b);
const percentile = (p) => sortedSizes[Math.min(sortedSizes.length - 1, Math.floor((sortedSizes.length - 1) * p))];
const maxSize = sortedSizes.at(-1) ?? 0;

const readmeRelease = result.chunks.find(chunk => chunk.source.filePath === 'README.md' && chunk.structure.label === 'Package release workflow');
assert.ok(readmeRelease, 'README release heading should become an addressable document chunk');
const lifecycleCase = result.chunks.find(chunk => chunk.source.filePath === 'packages/platform-cli/tests/lifecycle.test.ts' && chunk.structure.kind === 'TEST_CASE');
assert.ok(lifecycleCase?.structure.label, 'lifecycle test should expose testcase label');
const cliSymbol = result.chunks.find(chunk => chunk.source.filePath === 'packages/platform-cli/src/cli.ts' && chunk.structure.kind === 'CODE_SYMBOL');
assert.ok(cliSymbol?.structure.label, 'platform-cli source should expose code symbol label');

// 对完整 Chunk 集合计算稳定 hash，用于发现切块逻辑或顺序发生的非预期漂移。
const canonical = result.chunks.map(chunk => ({
  filePath: chunk.source.filePath,
  startLine: chunk.source.startLine,
  endLine: chunk.source.endLine,
  kind: chunk.structure.kind,
  parserMode: chunk.structure.parserMode,
  label: chunk.structure.label ?? null,
  parentLabel: chunk.structure.parentLabel ?? null,
  headingPath: chunk.structure.headingPath ?? null,
  part: chunk.structure.part ?? null,
  content: chunk.content,
}));
const chunkSetHash = createHash('sha256').update(JSON.stringify(canonical)).digest('hex');

console.log(`STRUCTURE_CHUNK_SMOKE=PASS documents=${result.documentCount} chunks=${result.chunks.length}`);
console.log(`CHUNK_SET_HASH=${chunkSetHash}`);
console.log(`PARSER_COUNTS=${JSON.stringify(parserCounts)}`);
console.log(`KIND_COUNTS=${JSON.stringify(kindCounts)}`);
console.log(`CHUNK_SIZE_CHARS=p50:${percentile(0.5)} p95:${percentile(0.95)} max:${maxSize}`);
console.log(`TYPESCRIPT_FALLBACK_FILES=${fallbackPaths.length}`);
if (fallbackPaths.length) console.log(`TYPESCRIPT_FALLBACK_PATHS=${JSON.stringify(fallbackPaths.slice(0, 30))}`);
console.log(`SAMPLE_MARKDOWN=${readmeRelease.source.startLine}-${readmeRelease.source.endLine}:${readmeRelease.structure.label}`);
console.log(`SAMPLE_CODE=${cliSymbol.source.startLine}-${cliSymbol.source.endLine}:${cliSymbol.structure.label}`);
console.log(`SAMPLE_TEST=${lifecycleCase.source.startLine}-${lifecycleCase.source.endLine}:${lifecycleCase.structure.label}`);
