import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const entry = path.join(root, 'apps/api/dist/main.js');

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
  child.kill('SIGTERM');
}
