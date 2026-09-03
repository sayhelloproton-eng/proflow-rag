import assert from 'node:assert/strict';
import { ResolveRepositorySnapshot } from '../../apps/api/dist/contexts/knowledge-management/application/resolve-repository-snapshot.js';
import { GitSourceRepositoryAdapter } from '../../apps/api/dist/infrastructure/git/git-source-repository.adapter.js';

const authority = {
  repositoryUrl: 'https://github.com/sayhelloproton-eng/proflow.git',
  ref: 'main',
};
const useCase = new ResolveRepositorySnapshot(new GitSourceRepositoryAdapter(), authority);
const first = await useCase.execute();
const second = await useCase.execute();

assert.equal(first.repositoryUrl, authority.repositoryUrl);
assert.equal(first.ref, 'main');
assert.match(first.commitSha, /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/);
assert.equal(second.commitSha, first.commitSha, 'remote main moved during deterministic smoke');
assert.equal(first.sameSourceIdentity(second), true);

console.log(`REPOSITORY_SNAPSHOT_SMOKE=PASS sha=${first.commitSha}`);
