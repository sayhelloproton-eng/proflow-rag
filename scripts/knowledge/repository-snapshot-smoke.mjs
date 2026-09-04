/**
 * 文件职责：真实访问公开 ProFlow remote main，验证其可解析为不可变 RepositorySnapshot。
 * 所属层：Knowledge Management Verification。
 * 关键边界：只证明测试窗口内远端 authority 能稳定解析，不假设 main 永远不移动。
 */

import assert from 'node:assert/strict';
import { ResolveRepositorySnapshot } from '../../apps/api/dist/contexts/knowledge-management/application/resolve-repository-snapshot.js';
import { GitSourceRepositoryAdapter } from '../../apps/api/dist/infrastructure/git/git-source-repository.adapter.js';

const authority = {
  repositoryUrl: 'https://github.com/sayhelloproton-eng/proflow.git',
  ref: 'main',
};
const useCase = new ResolveRepositorySnapshot(new GitSourceRepositoryAdapter(), authority);
// 连续解析两次只验证测试窗口内的确定性；不是声称 main 永远不变化。
const first = await useCase.execute();
const second = await useCase.execute();

assert.equal(first.repositoryUrl, authority.repositoryUrl);
assert.equal(first.ref, 'main');
assert.match(first.commitSha, /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/);
assert.equal(second.commitSha, first.commitSha, 'remote main moved during deterministic smoke');
assert.equal(first.sameSourceIdentity(second), true);

console.log(`REPOSITORY_SNAPSHOT_SMOKE=PASS sha=${first.commitSha}`);
