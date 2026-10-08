import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PUBLIC_VIEWS, publicCommand } from '../src/public-controls.js';
import { DESK_TARGETS, DESK_PREFERENCES_SCHEMA, PRESENTATION_TARGET,
  isDeskTarget, labelFor, familyFor, deskWeight, normalizeDeskOrder,
  reorderDesk, autoDeskOrder, normalizeDeskPreferences, positionNearEdge
} from '../src/entity-desk-model.mjs';

test('ten desk entities reuse ten and only ten owner-native public targets', () => {
  assert.equal(DESK_TARGETS.length, 10);
  assert.deepEqual(DESK_TARGETS, Object.keys(PUBLIC_VIEWS));
  assert.equal(PRESENTATION_TARGET, 'nautico-presentazione');
  for (const target of DESK_TARGETS) {
    assert.ok(isDeskTarget(target));
    assert.equal(labelFor(target), PUBLIC_VIEWS[target].label);
    assert.equal(familyFor(target), PUBLIC_VIEWS[target].family);
    assert.ok(['hero', 'large', 'medium', 'small'].includes(deskWeight(target)));
    assert.equal(publicCommand({
      schema: 'kn.public-view-command.v2',
      requestId: 'request', session: 'test', target,
    })?.target, target);
  }
});

test('manual order is visual-only, deduplicates input and keeps known entries', () => {
  const order = normalizeDeskOrder(['nautico-studio', 'nautico-studio', 'invalid']);
  assert.equal(order[0], 'nautico-studio');
  assert.equal(order.length, 10);
  const changed = reorderDesk(order, 'nautico-progetto', 'nautico-studio');
  assert.equal(changed[0], 'nautico-progetto');
  assert.equal(changed[1], 'nautico-studio');
  assert.deepEqual(new Set(changed), new Set(DESK_TARGETS));
  assert.deepEqual(reorderDesk(order, 'unknown', 'nautico-studio'), order);
});

test('opt-in usage sorting is stable and accepts only bounded local counts', () => {
  const initial = [...DESK_TARGETS];
  const sorted = autoDeskOrder(initial, {
    'nautico-assistenza': 7, 'nautico-bordo': 7, 'nautico-progetto': 1,
  });
  assert.equal(sorted[0], 'nautico-bordo');
  assert.equal(sorted[1], 'nautico-assistenza');
  assert.deepEqual(new Set(sorted), new Set(initial));
  assert.deepEqual(autoDeskOrder(initial, {}), initial);
});

test('saved appearance cannot add source targets or domain effects', () => {
  const normalized = normalizeDeskPreferences({
    schema: 'foreign', order: ['nautico-cantiere', 'domain-delete'],
    usage: { 'nautico-cantiere': 3, 'nautico-bordo': Infinity },
    placement: 'execute',
    source: { approve: true },
  });
  assert.equal(normalized.schema, DESK_PREFERENCES_SCHEMA);
  assert.equal(normalized.order.length, 10);
  assert.equal(normalized.order[0], 'nautico-cantiere');
  assert.equal(normalized.usage['nautico-bordo'], 0);
  assert.equal(normalized.placement, 'floating');
  assert.equal(Object.hasOwn(normalized, 'source'), false);
});

test('magnetic docking is a visual behavior and degrades to floating on compact view', () => {
  assert.equal(positionNearEdge(40, 1440), 'dock-left');
  assert.equal(positionNearEdge(1410, 1440), 'dock-right');
  assert.equal(positionNearEdge(720, 1440), 'floating');
  assert.equal(positionNearEdge(2, 390), 'floating');
  assert.equal(positionNearEdge(NaN, 1440), 'floating');
});
