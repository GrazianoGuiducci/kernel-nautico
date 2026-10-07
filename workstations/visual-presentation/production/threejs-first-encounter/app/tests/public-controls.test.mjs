import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLIC_VIEWS, publicCommand } from '../src/public-controls.js';

test('public commands select only the existing presentation views', () => {
  for (const target of Object.keys(PUBLIC_VIEWS)) {
    assert.equal(publicCommand({ schema: 'kn.public-view-command.v2', session: 'test-session', requestId: 'test-request', target }).target, target);
  }
});
test('public commands cannot carry case writes, code, URLs or inherited targets', () => {
  for (const target of ['constructor', '__proto__', 'https://example.com', 'company-save', '../case', 'javascript:alert(1)']) {
    assert.equal(publicCommand({ schema: 'kn.public-view-command.v2', session: 'test-session', requestId: 'test-request', target }), null);
  }
  assert.equal(publicCommand({ schema: 'kn.public-view-command.v2', session: 'test-session', requestId: 'test-request', target: 'nautico-cantiere', payload: { save: true } }), null);
  assert.equal(publicCommand({ schema: 'kn.case-write.v1', target: 'nautico-cantiere' }), null);
  assert.equal(publicCommand(null), null);
  assert.equal(publicCommand({ schema: 'kn.public-view-command.v2', session: 'test-session', requestId: 'test-request', target: { toString: 'invalid' } }), null);
});

test('commands require bounded session and correlation and reject the previous protocol', () => {
  const command = { schema: 'kn.public-view-command.v2', session: 's', requestId: 'r', target: 'nautico-cantiere' };
  for (const mutation of [{session:''}, {requestId:null}, {requestId:'x'.repeat(81)}, {schema:'kn.public-view-command.v1'}]) {
    assert.equal(publicCommand({...command, ...mutation}), null);
  }
});
