import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import type {
  ListRepositoryFilesRequest,
  ResolveSourceRefRequest,
  SourceRepositoryPort,
} from '../../contexts/knowledge-management/contracts/source-repository.port.js';

const execFileAsync = promisify(execFile);

export class GitSourceRepositoryAdapter implements SourceRepositoryPort {
  constructor(private readonly timeoutMs = 30_000) {}

  async resolveCommit(request: ResolveSourceRefRequest): Promise<string> {
    const fullRef = `refs/heads/${request.ref}`;
    const { stdout } = await this.runGit(
      ['ls-remote', '--exit-code', request.repositoryUrl, fullRef],
    );
    const rows = stdout.trim().split(/\r?\n/).filter(Boolean);
    const match = rows.find(row => row.trim().endsWith(`	${fullRef}`));
    if (!match) throw new Error('SOURCE_REF_NOT_FOUND');
    const [commitSha] = match.trim().split(/\s+/);
    if (!commitSha) throw new Error('SOURCE_COMMIT_MISSING');
    return commitSha;
  }

  async listFilesAtCommit(request: ListRepositoryFilesRequest): Promise<string[]> {
    const repositoryDir = await mkdtemp(path.join(tmpdir(), 'proflow-rag-source-'));
    try {
      await this.runGit(['init', '--bare', '--quiet'], repositoryDir);
      await this.runGit([
        'fetch', '--quiet', '--no-tags', '--filter=blob:none', '--depth=1',
        request.repositoryUrl, request.commitSha,
      ], repositoryDir);
      const { stdout } = await this.runGit(
        ['ls-tree', '-rz', '--name-only', 'FETCH_HEAD'],
        repositoryDir,
        8 * 1024 * 1024,
      );
      return stdout.split('\0').filter(Boolean).sort();
    } finally {
      await rm(repositoryDir, { recursive: true, force: true });
    }
  }

  private async runGit(args: string[], cwd?: string, maxBuffer = 1024 * 1024) {
    return execFileAsync('git', args, { cwd, timeout: this.timeoutMs, maxBuffer });
  }
}
