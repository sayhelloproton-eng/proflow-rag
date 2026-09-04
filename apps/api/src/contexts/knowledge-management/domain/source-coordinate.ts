/**
 * 文件职责：定义一个知识片段在不可变源码中的真实位置。
 * 所属层：Knowledge Management / Domain Value Object。
 * 关键边界：repository + commitSha + filePath + lines 共同构成可复现来源；不能用会移动的 main 代替 commit。
 */

export interface SourceCoordinateProps {
  repositoryUrl: string;
  commitSha: string;
  filePath: string;
  startLine: number;
  endLine: number;
}

export class SourceCoordinate {
  readonly repositoryUrl: string;
  readonly commitSha: string;
  readonly filePath: string;
  readonly startLine: number;
  readonly endLine: number;

  private constructor(props: SourceCoordinateProps) {
    this.repositoryUrl = props.repositoryUrl;
    this.commitSha = props.commitSha;
    this.filePath = props.filePath;
    this.startLine = props.startLine;
    this.endLine = props.endLine;
  }

  static create(props: SourceCoordinateProps): SourceCoordinate {
    const repositoryUrl = props.repositoryUrl.trim();
    const commitSha = props.commitSha.trim().toLowerCase();
    const filePath = props.filePath.trim();
    if (!repositoryUrl) throw new Error('SOURCE_COORDINATE_REPOSITORY_REQUIRED');
    if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(commitSha)) throw new Error('SOURCE_COORDINATE_COMMIT_INVALID');
    if (!filePath || filePath.startsWith('/') || filePath.includes('../')) throw new Error('SOURCE_COORDINATE_PATH_INVALID');
    if (!Number.isInteger(props.startLine) || props.startLine < 1) throw new Error('SOURCE_COORDINATE_START_LINE_INVALID');
    if (!Number.isInteger(props.endLine) || props.endLine < props.startLine) throw new Error('SOURCE_COORDINATE_END_LINE_INVALID');
    return new SourceCoordinate({ repositoryUrl, commitSha, filePath, startLine: props.startLine, endLine: props.endLine });
  }
}
