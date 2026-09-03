import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { ResolveSourceRefRequest, SourceRepositoryPort } from '../../contexts/knowledge-management/contracts/source-repository.port.js';

const execFileAsync = promisify(execFile);

export class GitSourceRepositoryAdapter implements SourceRepositoryPort {
  constructor(private readonly timeoutMs = 15_000) {}

  async resolveCommit(request: ResolveSourceRefRequest): Promise<string> {
    const fullRef = `refs/heads/${request.ref}`;
    const { stdout } = await execFileAsync(
      'git',
      ['ls-remote', '--exit-code', request.repositoryUrl, fullRef],
      { timeout: this.timeoutMs, maxBuffer: 1024 * 1024 },
    );
    const rows = stdout.trim().split(/\r?\n/).filter(Boolean);
    const match = rows.find(row => row.trim().endsWith(`\t${fullRef}`));
    if (!match) throw new Error('SOURCE_REF_NOT_FOUND');
    const [commitSha] = match.trim().split(/\s+/);
    if (!commitSha) throw new Error('SOURCE_COMMIT_MISSING');
    return commitSha;
  }
}
