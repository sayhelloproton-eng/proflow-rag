export type CorpusClass =
  | 'ROOT_DOC'
  | 'SPEC'
  | 'PACKAGE_DOC'
  | 'SOURCE'
  | 'TEST'
  | 'LIVE_TEST'
  | 'DEPLOYMENT'
  | 'EXTENSION'
  | 'API_CONTRACT'
  | 'AGENT_KNOWLEDGE'
  | 'MODULE_METADATA';

export type CorpusExcludeReason =
  | 'SENSITIVE_PATH'
  | 'GENERATED_OR_RUNTIME'
  | 'UNSUPPORTED_BINARY'
  | 'OUTSIDE_V0_CORPUS';

export type CorpusPathDecision =
  | { status: 'accepted'; corpusClass: CorpusClass }
  | { status: 'excluded'; reason: CorpusExcludeReason };

export const CORPUS_POLICY_VERSION = 'proflow-public-v0.1';

const sensitiveExtensions = /\.(?:p12|pfx|pem|key)$/i;
const binaryExtensions = /\.(?:zip|png|jpe?g|gif|webp|pdf|bin)$/i;
const generatedSegments = new Set([
  'node_modules', 'dist', 'build', 'coverage', 'cache', 'caches', 'log', 'logs', 'tmp', 'temp',
]);
const sensitiveSegments = new Set(['secret', 'secrets', 'credential', 'credentials', '.ssh']);
const packageDocs = new Set(['README.md', 'DOCS.md', 'SETUP.md', 'SKILL.md']);
const moduleMetadata = new Set(['package.json', 'proflow.module.json', 'conformance.json', 'manifest.json']);

export function classifyCorpusPath(filePath: string): CorpusPathDecision {
  const parts = filePath.split('/');
  const base = parts.at(-1) ?? '';
  const lowerParts = parts.map(part => part.toLowerCase());
  if (base.toLowerCase().startsWith('.env') || sensitiveExtensions.test(base) || lowerParts.some(part => sensitiveSegments.has(part))) {
    return { status: 'excluded', reason: 'SENSITIVE_PATH' };
  }
  if (binaryExtensions.test(base)) return { status: 'excluded', reason: 'UNSUPPORTED_BINARY' };
  if (lowerParts.some(part => generatedSegments.has(part))) {
    return { status: 'excluded', reason: 'GENERATED_OR_RUNTIME' };
  }
  if (filePath === 'README.md') return { status: 'accepted', corpusClass: 'ROOT_DOC' };
  if (filePath.startsWith('spec/')) return { status: 'accepted', corpusClass: 'SPEC' };
  if (!filePath.startsWith('packages/')) return { status: 'excluded', reason: 'OUTSIDE_V0_CORPUS' };

  const relative = parts.slice(2).join('/');
  if (packageDocs.has(base)) return { status: 'accepted', corpusClass: 'PACKAGE_DOC' };
  if (relative.startsWith('src/')) return { status: 'accepted', corpusClass: 'SOURCE' };
  if (relative.startsWith('tests/')) return { status: 'accepted', corpusClass: 'TEST' };
  if (relative.startsWith('live-tests/')) return { status: 'accepted', corpusClass: 'LIVE_TEST' };
  if (relative.startsWith('deployment/')) return { status: 'accepted', corpusClass: 'DEPLOYMENT' };
  if (relative.startsWith('extension/')) return { status: 'accepted', corpusClass: 'EXTENSION' };
  if (relative.startsWith('actions/') || base.endsWith('.openapi.yaml')) {
    return { status: 'accepted', corpusClass: 'API_CONTRACT' };
  }
  if (/^(context|memory|knowledge)\//.test(relative)) {
    return { status: 'accepted', corpusClass: 'AGENT_KNOWLEDGE' };
  }
  if (moduleMetadata.has(base)) return { status: 'accepted', corpusClass: 'MODULE_METADATA' };
  return { status: 'excluded', reason: 'OUTSIDE_V0_CORPUS' };
}
