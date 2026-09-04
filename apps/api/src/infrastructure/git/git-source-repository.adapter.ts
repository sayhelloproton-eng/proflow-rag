/**
 * 文件职责：用 Git CLI 实现 SourceRepositoryPort，为 Knowledge Management 提供远端源码读取能力。
 * 所属层：Infrastructure / Git Adapter。
 * 关键边界：只读取明确的远端仓库与 immutable commit；Git 命令和临时目录细节不得泄漏到 Domain/Application。
 */

import { execFile } from 'node:child_process';
import { lstat, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import type {
  ListRepositoryEntriesRequest,
  ReadRepositoryFilesRequest,
  RepositoryFileContent,
  RepositoryTreeEntry,
  ResolveSourceRefRequest,
  SourceRepositoryPort,
} from '../../contexts/knowledge-management/contracts/source-repository.port.js';

const execFileAsync = promisify(execFile);

export class GitSourceRepositoryAdapter implements SourceRepositoryPort {
  constructor(private readonly timeoutMs = 30_000) {}

  async resolveCommit(request: ResolveSourceRefRequest): Promise<string> {
    // 直接询问远端 authority，避免本地 clone/cache 的 main 落后却被误当成公共知识真源。
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

  async listEntriesAtCommit(request: ListRepositoryEntriesRequest): Promise<RepositoryTreeEntry[]> {
    const repositoryDir = await mkdtemp(path.join(tmpdir(), 'proflow-rag-source-'));
    try {
      await this.runGit(['init', '--bare', '--quiet'], repositoryDir);
      // P1-B 只需要 tree metadata；blob:none 避免为了枚举文件提前下载全部文件内容。
      await this.runGit([
        'fetch', '--quiet', '--no-tags', '--filter=blob:none', '--depth=1',
        request.repositoryUrl, request.commitSha,
      ], repositoryDir);
      const { stdout } = await this.runGit(
        ['ls-tree', '-rz', 'FETCH_HEAD'],
        repositoryDir,
        8 * 1024 * 1024,
      );
      // 使用 Git mode 识别普通文件和 symlink，不能只靠路径名猜 entry 类型。
      return stdout.split('\0').filter(Boolean).map(row => {
        const tab = row.indexOf('\t');
        if (tab < 0) throw new Error('SOURCE_TREE_ENTRY_INVALID');
        const metadata = row.slice(0, tab).split(/\s+/);
        const filePath = row.slice(tab + 1);
        const mode = metadata[0];
        const kind = mode === '120000' ? 'SYMLINK' : mode === '100644' || mode === '100755' ? 'FILE' : 'OTHER';
        return { filePath, kind } satisfies RepositoryTreeEntry;
      }).sort((a, b) => a.filePath.localeCompare(b.filePath));
    } finally {
      await rm(repositoryDir, { recursive: true, force: true });
    }
  }

  async readFilesAtCommit(request: ReadRepositoryFilesRequest): Promise<RepositoryFileContent[]> {
    // 到 P1-C 才真正读取 blob；此时输入已经被 Corpus Manifest 收敛为允许进入知识库的文件。
    const repositoryDir = await mkdtemp(path.join(tmpdir(), 'proflow-rag-content-'));
    try {
      await this.runGit(['init', '--quiet'], repositoryDir);
      await this.runGit([
        'fetch', '--quiet', '--no-tags', '--depth=1', request.repositoryUrl, request.commitSha,
      ], repositoryDir, 32 * 1024 * 1024);
      await this.runGit(['checkout', '--quiet', '--detach', 'FETCH_HEAD'], repositoryDir, 32 * 1024 * 1024);
      const files: RepositoryFileContent[] = [];
      for (const filePath of request.filePaths) {
        if (!filePath || filePath.startsWith('/') || filePath.includes('../')) throw new Error('SOURCE_FILE_PATH_INVALID');
        const absolute = path.join(repositoryDir, ...filePath.split('/'));
        const stat = await lstat(absolute);
        // 即使上游 policy 已排除 symlink，这里仍拒绝跟随链接，保持基础设施层的防御性边界。
        if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`SOURCE_FILE_NOT_REGULAR:${filePath}`);
        files.push({ filePath, content: await readFile(absolute, 'utf8') });
      }
      return files;
    } finally {
      await rm(repositoryDir, { recursive: true, force: true });
    }
  }

  private async runGit(args: string[], cwd?: string, maxBuffer = 1024 * 1024) {
    return execFileAsync('git', args, { cwd, timeout: this.timeoutMs, maxBuffer });
  }
}
