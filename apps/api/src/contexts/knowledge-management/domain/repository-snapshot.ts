export interface RepositorySnapshotProps {
  repositoryUrl: string;
  ref: string;
  commitSha: string;
}

export class RepositorySnapshot {
  readonly repositoryUrl: string;
  readonly ref: string;
  readonly commitSha: string;

  private constructor(props: RepositorySnapshotProps) {
    this.repositoryUrl = props.repositoryUrl;
    this.ref = props.ref;
    this.commitSha = props.commitSha;
  }

  static create(props: RepositorySnapshotProps): RepositorySnapshot {
    const repositoryUrl = props.repositoryUrl.trim();
    const ref = props.ref.trim();
    const commitSha = props.commitSha.trim().toLowerCase();
    if (!repositoryUrl) throw new Error('SOURCE_REPOSITORY_URL_REQUIRED');
    if (!ref) throw new Error('SOURCE_REF_REQUIRED');
    if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(commitSha)) {
      throw new Error('SOURCE_COMMIT_SHA_INVALID');
    }
    return new RepositorySnapshot({ repositoryUrl, ref, commitSha });
  }

  sameSourceIdentity(other: RepositorySnapshot): boolean {
    return this.repositoryUrl === other.repositoryUrl && this.commitSha === other.commitSha;
  }
}
