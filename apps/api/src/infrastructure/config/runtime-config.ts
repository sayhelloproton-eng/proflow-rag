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
