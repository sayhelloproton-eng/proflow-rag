import assert from 'node:assert/strict';
import { BuildCorpusManifest } from '../../apps/api/dist/contexts/knowledge-management/application/build-corpus-manifest.js';
import { classifyCorpusPath } from '../../apps/api/dist/contexts/knowledge-management/domain/corpus-policy.js';
import { RepositorySnapshot } from '../../apps/api/dist/contexts/knowledge-management/domain/repository-snapshot.js';
import { GitSourceRepositoryAdapter } from '../../apps/api/dist/infrastructure/git/git-source-repository.adapter.js';

const snapshot = RepositorySnapshot.create({
  repositoryUrl: 'https://github.com/sayhelloproton-eng/proflow.git',
  ref: 'main',
  commitSha: 'c85e986b56eca8be3e5c016a14bc1470ee656d87',
});
const useCase = new BuildCorpusManifest(new GitSourceRepositoryAdapter());
const first = await useCase.execute(snapshot);
const second = await useCase.execute(snapshot);

assert.equal(first.entries.length, 873);
assert.equal(second.manifestHash, first.manifestHash);
assert.deepEqual(second.entries, first.entries);
assert.equal(first.acceptedEntries.length, 806);
assert.equal(first.acceptedEntries.some(entry => entry.filePath.endsWith('.zip')), false);
assert.equal(first.acceptedEntries.some(entry => entry.filePath === 'spec/部署领域/03-流程与数据/04-部署状态-目录-Secret与安全.md'), true);
assert.deepEqual(
  first.excludedEntries.find(entry => entry.filePath === 'packages/agent-product/custom-gpt.openapi.yaml'),
  { filePath: 'packages/agent-product/custom-gpt.openapi.yaml', status: 'excluded', reason: 'SYMLINK_ALIAS' },
);
assert.deepEqual(classifyCorpusPath('.env.production'), { status: 'excluded', reason: 'SENSITIVE_PATH' });
assert.deepEqual(classifyCorpusPath('packages/demo/node_modules/x.ts'), { status: 'excluded', reason: 'GENERATED_OR_RUNTIME' });
assert.deepEqual(classifyCorpusPath('packages/demo/dist/x.js'), { status: 'excluded', reason: 'GENERATED_OR_RUNTIME' });
assert.deepEqual(classifyCorpusPath('packages/demo/knowledge/bundle.zip'), { status: 'excluded', reason: 'UNSUPPORTED_BINARY' });
assert.deepEqual(classifyCorpusPath('packages/demo/private.key'), { status: 'excluded', reason: 'SENSITIVE_PATH' });

const classCounts = Object.create(null);
const reasonCounts = Object.create(null);
for (const entry of first.entries) {
  if (entry.status === 'accepted') classCounts[entry.corpusClass] = (classCounts[entry.corpusClass] ?? 0) + 1;
  else reasonCounts[entry.reason] = (reasonCounts[entry.reason] ?? 0) + 1;
}
console.log(`CORPUS_MANIFEST_SMOKE=PASS total=${first.entries.length} accepted=${first.acceptedEntries.length} excluded=${first.excludedEntries.length}`);
console.log(`CORPUS_MANIFEST_HASH=${first.manifestHash}`);
console.log(`CORPUS_CLASS_COUNTS=${JSON.stringify(classCounts)}`);
console.log(`CORPUS_EXCLUDE_COUNTS=${JSON.stringify(reasonCounts)}`);
