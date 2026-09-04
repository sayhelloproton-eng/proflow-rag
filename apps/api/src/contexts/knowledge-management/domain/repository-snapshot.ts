/**
 * 文件职责：定义 ProFlow 源码原料批次的不可变身份。
 * 所属层：Knowledge Management / Domain。
 * 关键边界：RepositorySnapshot 只表示 repository/ref/commit，不等同于已构建完成的 KnowledgeSnapshot。
 */

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
    // ref 只说明“为什么选到这个 commit”；真正的源码身份由 repository + immutable commit 决定。
    return this.repositoryUrl === other.repositoryUrl && this.commitSha === other.commitSha;
  }
}
