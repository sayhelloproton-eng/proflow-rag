/**
 * 文件职责：启动真实构建后的 API 进程并验证 /health 可用，再清理子进程。
 * 所属层：Development Smoke Verification。
 * 关键边界：证明“真实进程能启动/监听/响应”，不是只验证函数或类型。
 */

import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const entry = path.join(root, 'apps/api/dist/main.js');

// 使用临时空闲端口，避免本地固定端口占用把 smoke 误判成应用失败。
const port = await new Promise((resolve, reject) => {
  const server = net.createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    const value = typeof address === 'object' && address ? address.port : null;
    server.close(() => value ? resolve(value) : reject(new Error('No free port')));
  });
});

const child = spawn(process.execPath, [entry], {
  cwd: root,
  env: { ...process.env, PROFLOW_RAG_API_HOST: '127.0.0.1', PROFLOW_RAG_API_PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let logs = '';
child.stdout.on('data', chunk => { logs += chunk; });
child.stderr.on('data', chunk => { logs += chunk; });

try {
  let response;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) break;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!response?.ok) throw new Error(`health endpoint unavailable\n${logs}`);
  const body = await response.json();
  if (body.status !== 'ok' || body.service !== 'proflow-rag-api') {
    throw new Error(`unexpected health payload: ${JSON.stringify(body)}`);
  }
  console.log(`HEALTH_SMOKE=PASS port=${port}`);
} finally {
  // smoke 无论成功失败都必须回收真实 API 子进程，避免测试污染后续 runtime。
  child.kill('SIGTERM');
}
