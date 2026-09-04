/**
 * 文件职责：机械检查被冻结的仓库结构、Context ownership 与跨域依赖承重墙。
 * 所属层：Development Verification。
 * 关键边界：只守架构不变量，不把普通内部重构锁死成“架构违规”。
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const contextsRoot = path.join(root, 'apps/api/src/contexts');
const contractRoot = path.join(root, 'packages/site-api-contract/src');
const problems = [];

async function directoryNames(directory) {
  return (await readdir(directory, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

function expectNames(label, actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) {
    problems.push(`${label}: expected ${expected.join(', ')}, got ${actual.join(', ')}`);
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.name.endsWith('.ts')) files.push(absolute);
  }
  return files;
}

for (const file of await walk(contextsRoot)) {
  const owner = path.relative(contextsRoot, file).split(path.sep)[0];
  const text = await readFile(file, 'utf8');
  for (const match of text.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    if (!match[1].startsWith('.')) continue;
    const target = path.resolve(path.dirname(file), match[1]);
    const relative = path.relative(contextsRoot, target);
    if (relative.startsWith('..')) continue;
    const targetOwner = relative.split(path.sep)[0];
    // Context 只能通过公开 contracts 协作；深 import 对方内部实现会破坏 ownership 与后续独立演进。
    if (targetOwner !== owner && !relative.includes(`${path.sep}contracts${path.sep}`)) {
      problems.push(`${path.relative(root, file)} deep-imports context ${targetOwner}`);
    }
  }
}

expectNames('apps', await directoryNames(path.join(root, 'apps')), ['api', 'site']);
expectNames('packages', await directoryNames(path.join(root, 'packages')), ['site-api-contract']);
expectNames('contexts', await directoryNames(contextsRoot), [
  'grounded-answering',
  'knowledge-management',
  'quality-evaluation',
]);
expectNames('database ownership', await directoryNames(path.join(root, 'database')), [
  'answering', 'knowledge', 'migrations', 'quality', 'system',
]);

const forbiddenContractNames = ['KnowledgeSnapshot', 'EvidenceSet', 'RagTrace'];
for (const file of await walk(contractRoot)) {
  const text = await readFile(file, 'utf8');
  for (const name of forbiddenContractNames) {
    if (text.includes(name)) problems.push(`${path.relative(root, file)} leaks domain type ${name}`);
  }
  if (/apps\/api|contexts\//.test(text)) {
    problems.push(`${path.relative(root, file)} imports API/domain internals`);
  }
}

if (problems.length) {
  console.error('ARCHITECTURE_GATE=FAIL');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}
console.log('ARCHITECTURE_GATE=PASS');
