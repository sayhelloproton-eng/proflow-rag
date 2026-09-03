export interface ResolveSourceRefRequest {
  repositoryUrl: string;
  ref: string;
}

export interface ListRepositoryFilesRequest {
  repositoryUrl: string;
  commitSha: string;
}

export interface SourceRepositoryPort {
  resolveCommit(request: ResolveSourceRefRequest): Promise<string>;
  listFilesAtCommit(request: ListRepositoryFilesRequest): Promise<string[]>;
}
