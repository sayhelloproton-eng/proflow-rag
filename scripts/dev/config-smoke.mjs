/**
 * 文件职责：验证运行时配置的默认值、自定义值与非法输入 fail-fast 行为。
 * 所属层：Development Smoke Verification。
 * 关键边界：验证真实构建产物的配置行为，不以 TypeScript 编译通过替代运行验证。
 */

import { loadRuntimeConfig } from '../../apps/api/dist/infrastructure/config/runtime-config.js';

const defaults = loadRuntimeConfig({});
if (defaults.host !== '127.0.0.1' || defaults.port !== 3100) {
  throw new Error(`unexpected defaults: ${JSON.stringify(defaults)}`);
}

const custom = loadRuntimeConfig({
  PROFLOW_RAG_API_HOST: '0.0.0.0',
  PROFLOW_RAG_API_PORT: '4321',
});
if (custom.host !== '0.0.0.0' || custom.port !== 4321) {
  throw new Error(`unexpected custom config: ${JSON.stringify(custom)}`);
}

let rejected = false;
try {
  loadRuntimeConfig({ PROFLOW_RAG_API_PORT: 'invalid' });
} catch {
  rejected = true;
}
if (!rejected) throw new Error('invalid port must fail fast');

console.log('CONFIG_SMOKE=PASS');
