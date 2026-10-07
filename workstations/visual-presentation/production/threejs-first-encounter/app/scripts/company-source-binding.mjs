/** Exact owner sources for situated company work; separate from the stern view. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const git = (root, ...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const APP = 'workstations/visual-presentation/production/threejs-first-encounter/app';
export const COMPANY_SOURCE_PATHS = Object.freeze([
  'KERNEL.md',
  'COMPETENCE_FIELD.md',
  'docs/SEMANTIC_OPERATING_RELATION.md',
  'docs/ENTERPRISE_BOOTSTRAP_AND_KERNEL_TOPOLOGY_0_1.md',
  'docs/NAUTICAL_REFERENCE_OPERATING_MODEL_0_1.md',
  'docs/NAUTICAL_DESIGN_PROPOSAL_CONTINUITY_0_1.md',
  APP + '/src/company/field.js',
  APP + '/src/company/method.js',
  APP + '/src/company/contract.js',
]);

export async function createCompanySourceBinding(appRoot) {
  const root = git(appRoot, 'rev-parse', '--show-toplevel');
  const head = git(root, 'rev-parse', 'HEAD');
  const revision = git(root, 'log', '-1', '--format=%H', head, '--', ...COMPANY_SOURCE_PATHS);
  const branch = git(root, 'branch', '--show-current') || process.env.GITHUB_REF_NAME || 'detached';
  if (!/^[0-9a-f]{40}$/.test(revision)) throw new Error('Company source owner revision is unavailable.');
  let available = true;
  const sources = [];
  for (const path of COMPANY_SOURCE_PATHS) {
    const bytes = await readFile(resolve(root, path));
    const blob = git(root, 'hash-object', '--no-filters', path);
    try { if (git(root, 'rev-parse', revision + ':' + path) !== blob) available = false; }
    catch { available = false; }
    sources.push({ path, blob, sha256: hash(bytes), revision, scope: 'owner_source_snapshot' });
  }
  const contextDigest = hash(JSON.stringify(sources.map(({ path, blob, sha256 }) => ({ path, blob, sha256 }))));
  return {
    schema: 'kn.company-source-binding.v0.1', repository: 'GrazianoGuiducci/kernel-nautico',
    branch, revision, sourceId: 'kn:source:company-case:v1', sourceRevision: contextDigest,
    viewId: 'kn:view:company-field:v1', assetPath: null, sources, contextDigest,
    observation: 'local_build_snapshot', freshness: 'pinned_not_continuous_remote',
    availability: available ? 'available' : 'unavailable',
  };
}

export async function writeCompanySourceBinding(appRoot, out) {
  const binding = await createCompanySourceBinding(appRoot);
  await mkdir(resolve(out, 'company'), { recursive: true });
  await writeFile(resolve(out, 'company/source-binding.json'), JSON.stringify(binding, null, 2) + '\n');
  console.log(`Company source snapshot ${binding.revision}: ${binding.availability}; ${binding.sources.length} exact source bindings.`);
  return binding;
}
