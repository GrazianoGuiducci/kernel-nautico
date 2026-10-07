import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createSourceBinding, SOURCE_PATHS } from '../scripts/product-source-binding.mjs';
import { createCompanySourceBinding, COMPANY_SOURCE_PATHS } from '../scripts/company-source-binding.mjs';

for (const [name, createBinding, sourcePaths] of [
  ['design', createSourceBinding, SOURCE_PATHS],
  ['company', createCompanySourceBinding, COMPANY_SOURCE_PATHS],
]) test(`${name} source binding joins committed bytes and owner revision without receipt-only false drift`, async () => {
  const root = await mkdtemp(resolve(tmpdir(), 'kn-source-proof-'));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
  const commit = message => git('-c','user.name=Source Proof','-c','user.email=source-proof@example.invalid','commit','-m',message);
  try {
    git('init','-b','work/source-proof');
    for (const path of sourcePaths) {
      await mkdir(dirname(resolve(root, path)), { recursive: true });
      await writeFile(resolve(root, path), `Fixture for ${path}\n`);
    }
    git('add','.'); commit('Known source set');
    const sourceCommit = git('rev-parse','HEAD');
    const initial = await createBinding(root);
    assert.equal(initial.availability, 'available');
    assert.equal(initial.revision, sourceCommit);
    for (const source of initial.sources) {
      assert.equal(source.blob, git('rev-parse', `${sourceCommit}:${source.path}`));
      assert.equal(source.sha256, createHash('sha256').update(await readFile(resolve(root, source.path))).digest('hex'));
    }
    await writeFile(resolve(root,'RECEIPT.md'), 'A later proof record, without source changes.\n');
    git('add','RECEIPT.md'); commit('Record observation');
    assert.notEqual(git('rev-parse','HEAD'), sourceCommit);
    assert.deepEqual(await createBinding(root), initial);

    await writeFile(resolve(root,'KERNEL.md'), 'Changed owner context, not yet committed.\n');
    const dirty = await createBinding(root);
    assert.equal(dirty.availability, 'unavailable');
    assert.equal(dirty.revision, sourceCommit);
    assert.notEqual(dirty.contextDigest, initial.contextDigest);

    git('add','KERNEL.md'); commit('Record changed owner source');
    const changed = await createBinding(root);
    assert.equal(changed.availability, 'available');
    assert.equal(changed.revision, git('rev-parse','HEAD'));
    assert.notEqual(changed.revision, sourceCommit);
    assert.notEqual(changed.contextDigest, initial.contextDigest);
  } finally { await rm(root, { recursive: true, force: true }); }
});
