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
