/**
 * 文件职责：把环境变量规范化为 API 启动所需的运行时配置。
 * 所属层：Infrastructure / Config。
 * 关键边界：配置在进程启动前完成校验，非法端口直接 fail fast，避免带病启动。
 */

export interface RuntimeConfig {
  host: string;
  port: number;
}

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3100;

export function loadRuntimeConfig(
  env: NodeJS.ProcessEnv = process.env,
): RuntimeConfig {
  const rawPort = env.PROFLOW_RAG_API_PORT;
  const port = rawPort === undefined ? DEFAULT_PORT : Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid PROFLOW_RAG_API_PORT: ${rawPort}`);
  }

  return {
    host: env.PROFLOW_RAG_API_HOST?.trim() || DEFAULT_HOST,
    port,
  };
}
