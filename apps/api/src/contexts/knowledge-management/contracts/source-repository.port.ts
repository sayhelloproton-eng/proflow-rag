export interface ResolveSourceRefRequest {
  repositoryUrl: string;
  ref: string;
}

export interface SourceRepositoryPort {
  resolveCommit(request: ResolveSourceRefRequest): Promise<string>;
}
