/**
 * 文件职责：声明 Knowledge Management 读取远端源码真源所需的最小仓库能力。
 * 所属层：Knowledge Management / Contract Port。
 * 关键边界：上层只表达“解析 commit、枚举 Git tree、读取固定 commit 文件”，不感知 Git CLI 实现细节。
 */

export interface ResolveSourceRefRequest {
  repositoryUrl: string;
  ref: string;
}

export interface ListRepositoryEntriesRequest {
  repositoryUrl: string;
  commitSha: string;
}

export type RepositoryEntryKind = 'FILE' | 'SYMLINK' | 'OTHER';

export interface RepositoryTreeEntry {
  filePath: string;
  kind: RepositoryEntryKind;
}

export interface ReadRepositoryFilesRequest {
  repositoryUrl: string;
  commitSha: string;
  filePaths: string[];
}

export interface RepositoryFileContent {
  filePath: string;
  content: string;
}

export interface SourceRepositoryPort {
  resolveCommit(request: ResolveSourceRefRequest): Promise<string>;
  listEntriesAtCommit(request: ListRepositoryEntriesRequest): Promise<RepositoryTreeEntry[]>;
  readFilesAtCommit(request: ReadRepositoryFilesRequest): Promise<RepositoryFileContent[]>;
}
