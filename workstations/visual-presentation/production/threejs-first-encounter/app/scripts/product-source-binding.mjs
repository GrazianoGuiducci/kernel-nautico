/** Build-time projection of the exact KN source owner, never a remote synchronizer. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const git = (root, ...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const APP = 'workstations/visual-presentation/production/threejs-first-encounter/app';
export const SOURCE_PATHS = Object.freeze([
  'KERNEL.md',
  'COMPETENCE_FIELD.md',
  'docs/SEMANTIC_OPERATING_RELATION.md',
  'docs/NAUTICAL_OPERATIONAL_SPATIAL_SURFACE_0_1.md',
  'docs/NAUTICAL_DESIGN_PROPOSAL_CONTINUITY_0_1.md',
  APP + '/src/data/story.js',
  APP + '/src/focus/field.js',
  APP + '/public/product/stern-plan.svg',
]);

export async function createSourceBinding(appRoot) {
  const root = git(appRoot, 'rev-parse', '--show-toplevel');
  const head = git(root, 'rev-parse', 'HEAD');
  // A receipt-only commit must not pretend that unchanged source content has
  // become a different design context. The runtime HEAD is recorded separately.
  const revision = git(root, 'log', '-1', '--format=%H', head, '--', ...SOURCE_PATHS);
  const branch = git(root, 'branch', '--show-current') || process.env.GITHUB_REF_NAME || 'detached';
  if (!/^[0-9a-f]{40}$/.test(revision)) throw new Error('Source owner revision is unavailable.');
  let available = true;
  const sources = [];
  for (const path of SOURCE_PATHS) {
    const bytes = await readFile(resolve(root, path));
    const blob = git(root, 'hash-object', '--no-filters', path);
    // A working-tree preview may be built, but it cannot claim those bytes were
    // read at the bound revision before they are committed.
    try { if (git(root, 'rev-parse', revision + ':' + path) !== blob) available = false; }
    catch { available = false; }
    sources.push({ path, blob, sha256: hash(bytes), revision, scope: 'owner_source_snapshot' });
  }
  const sourceRevision = sources.find(s => s.path.endsWith('/stern-plan.svg')).sha256;
  return {
    schema: 'kn.source-binding.v0.1', repository: 'GrazianoGuiducci/kernel-nautico',
    branch, revision, sourceId: 'kn:source:stern-plan:v1', sourceRevision,
    viewId: 'kn:view:stern-plan:v1', assetPath: 'product/stern-plan.svg', sources,
    contextDigest: hash(JSON.stringify(sources.map(({ path, blob, sha256 }) => ({ path, blob, sha256 })))),
    observation: 'local_build_snapshot', freshness: 'pinned_not_continuous_remote',
    availability: available ? 'available' : 'unavailable',
  };
}

export async function writeSourceBinding(appRoot, out) {
  const binding = await createSourceBinding(appRoot);
  await mkdir(resolve(out, 'product'), { recursive: true });
  await writeFile(resolve(out, 'product/source-binding.json'), JSON.stringify(binding, null, 2) + '\n');
  console.log(`Product source snapshot ${binding.revision}: ${binding.availability}; ${binding.sources.length} exact source bindings.`);
  return binding;
}
