import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { RETURN_RELATION, RETURN_PROJECTION, RETURN_CONTEXT } from '../src/data/semantic.js';
import { RETURN_EXAMPLE } from '../src/data/story.js';

test('the illustrative event cannot acquire the knowledge exercise state', () => {
  assert.equal(RETURN_RELATION.knowledge.state, 'exercised');
  assert.equal(RETURN_RELATION.knowledge.scope, 'owner_native_repository_and_reentry');
  assert.equal(RETURN_PROJECTION.example, RETURN_EXAMPLE);
  assert.equal(RETURN_PROJECTION.example.status, 'illustrative_not_observed');
  assert.equal(RETURN_PROJECTION.semanticId, RETURN_RELATION.semanticId);
  assert.equal(RETURN_PROJECTION.example.automaticApplication, false);
  assert.notEqual(RETURN_PROJECTION.example.id, RETURN_RELATION.semanticId);
});

test('the public projection exposes comprehension and explicit source access only', () => {
  assert.deepEqual(RETURN_PROJECTION.capabilities, ['inspect', 'deepen', 'open_source']);
  assert.equal(RETURN_PROJECTION.mode, 'public_presentation');
  assert.deepEqual(RETURN_CONTEXT.depths.map(d => d.id), ['meaning', 'mechanism', 'source']);
  assert.ok(Object.isFrozen(RETURN_RELATION.knowledge.sources));
  assert.ok(Object.isFrozen(RETURN_PROJECTION.capabilities));
  assert.ok(Object.isFrozen(RETURN_CONTEXT.depths[0].paragraphs));
});

test('source links identify existing owner-native evidence at the closed base', async () => {
  const base = 'e35403bcc9213a6805a03c77ca9889adbef4ecc4';
  for (const source of RETURN_RELATION.knowledge.sources) {
    const url = new URL(source.url);
    assert.equal(url.origin, 'https://github.com');
    assert.equal(url.pathname, `/GrazianoGuiducci/kernel-nautico/blob/${base}/${source.path}`);
    assert.equal(url.search, '');
    const body = await readFile(new URL('../../../../../../' + source.path, import.meta.url), 'utf8');
    assert.match(body, /Lifecycle Return Qualification v0\.2/);
    assert.match(body, /Wheelyboat/i);
  }
});
