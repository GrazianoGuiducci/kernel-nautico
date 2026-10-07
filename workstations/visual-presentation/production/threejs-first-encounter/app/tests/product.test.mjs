import test from 'node:test';
import assert from 'node:assert/strict';
import { createFocusController, addressFor, ANCHOR_ID } from '../src/focus/field.js';
import { SCHEMAS, VIEW_ID, plainData, checkSourceBinding, currentContext,
  checkContribution, checkVariant, checkProjectState } from '../src/product/contract.js';
import { createProductStore, STORAGE_KEY } from '../src/product/store.js';

// These are explicit contract fixtures, not evidence of remote source loading or a real coder.
const revision = 'a'.repeat(40), assetDigest = 'b'.repeat(64);
const binding = () => ({ schema: SCHEMAS.binding, repository: 'GrazianoGuiducci/kernel-nautico',
  branch: 'test/synthetic-product', revision,
  sourceId: 'kn:source:stern-plan:v1', sourceRevision: assetDigest, viewId: VIEW_ID,
  assetPath: 'product/stern-plan.svg', contextDigest: 'c'.repeat(64),
  observation: 'local_build_snapshot', freshness: 'pinned_not_continuous_remote', availability: 'available',
  sources: [{ path: 'workstations/visual-presentation/production/threejs-first-encounter/app/public/product/stern-plan.svg',
    blob: 'd'.repeat(40), sha256: assetDigest, revision, scope: 'owner_source_snapshot' },
    { path: 'KERNEL.md', blob: 'e'.repeat(40), sha256: 'f'.repeat(64), revision, scope: 'owner_source_snapshot' }] });
const copy = x => JSON.parse(JSON.stringify(x));
const NOW = '2026-10-04T15:00:00.000Z';
const capture = () => ({ note: 'Conservare il passaggio centrale e distinguere le due aree.',
  strokes: [[[.2,.4],[.3,.5],[.45,.55]]],
  view: { id: VIEW_ID, width: 640, height: 360, coordinateSpace: 'normalized-captured-view' } });
function memory(initial = null) {
  let raw = initial, writes = 0;
  return { getItem: () => raw, setItem: (_k, value) => { raw = value; writes++; },
    raw: () => raw, writes: () => writes, otherWriter(value) { raw = value; } };
}
let fixtureSerial = 0;
function fixture({ storage = null, select = true } = {}) {
  let scene = { act: 'FORM', fallback: false }, source = binding(), serial = 0;
  const fixtureId = ++fixtureSerial;
  const focus = createFocusController(() => scene);
  if (select) focus.select(addressFor(ANCHOR_ID), 'pointer');
  const store = createProductStore({ getFocus: () => focus.snapshot(),
    getSourceBinding: () => source, selectFocus: target => focus.select(addressFor(target), 'api'),
    storage, now: () => NOW, id: () => `fixture_${fixtureId}_${++serial}` });
  return { store, focus, setSource(value) { source = value; },
    setScene(value) { scene = value; focus.sync(); },
    begin() { store.capture(capture()); return store.prepareRequest('Proponi una variante locale leggibile del passaggio.'); } };
}
function variant(request, id = 'coder_fixture_1') {
  return { schema: SCHEMAS.variant, id, request_id: request.id, contribution_id: request.contribution_id,
    semantic_id: request.semantic_id, sourceBinding: copy(request.sourceBinding), context: copy(request.context),
    receiver: 'unit_fixture_not_actual_inference', created_at: NOW,
    summary: 'Ipotesi di percorso centrale; nessuna geometria ingegneristica modificata.',
    unknowns: ['Mancano dimensioni reali e verifica navale.'],
    sources: request.sourceBinding.sources.map(s => ({ path: s.path, blob: s.blob, sha256: s.sha256,
      revision: s.revision, read_state: 'read_by_receiver', used_for: 'Fixture del contratto.', observed_at: NOW })),
    preview: { viewId: VIEW_ID, coordinateSpace: 'normalized-captured-view',
      primitives: [{ kind: 'polyline', points: [[.2,.4],[.7,.4]], tone: 'proposal' },
        { kind: 'circle', cx: .5, cy: .6, r: .1, tone: 'attention' },
        { kind: 'label', x: .2, y: .3, text: 'Percorso proposto', tone: 'proposal' }] },
    focus_target: ANCHOR_ID, focus_reason: 'Torna alla regione originale.', effect_class: 'proposal_only' };
}

test('original note and normalized sketch remain independent immutable source records', () => {
  const f = fixture(), input = capture(), saved = f.store.capture(input);
  input.note = 'changed'; saved.note = 'changed again';
  assert.equal(f.store.snapshot().contribution.note, capture().note);
  assert.deepEqual(f.store.snapshot().contribution.capture.contributions[1].points, capture().strokes[0]);
  assert.throws(() => { f.store.snapshot().contribution.strokes[0][0][0] = .9; });
  const request = f.store.prepareRequest('Rileggi la nota senza riscriverla.');
  assert.equal(request.original.note, capture().note);
  assert.notEqual(request.instruction, request.original.note);
});
test('pointer and text share the same semantic address and durable context despite different counters', () => {
  const f = fixture(); const pointer = currentContext(f.focus.snapshot());
  f.focus.select(addressFor(ANCHOR_ID), 'text');
  assert.equal(f.focus.snapshot().revision, 2);
  assert.deepEqual(currentContext(f.focus.snapshot()), pointer);
});
test('real persistent request reenters at a different focus counter without injecting a snapshot', () => {
  const f = fixture(), request = f.begin(); f.focus.select(addressFor(ANCHOR_ID), 'keyboard');
  const exported = f.store.exportState(), receiver = fixture();
  receiver.store.importState(exported);
  assert.notEqual(receiver.focus.snapshot().revision, f.focus.snapshot().revision);
  assert.equal(receiver.store.snapshot().bindingStatus.state, 'current');
  receiver.store.importResult(variant(request));
  assert.equal(receiver.store.snapshot().variant.request_id, request.id);
});
test('phase changes stale the result and preserve the original', () => {
  const f = fixture(), r = f.begin(); f.setScene({ act: 'LIVE', fallback: false });
  assert.throws(() => f.store.importResult(variant(r)), /non applicabile/);
  assert.equal(f.store.snapshot().variants.length, 0);
  assert.equal(f.store.snapshot().contributions.length, 1);
  assert.equal(f.store.snapshot().quarantine.length, 1);
});
test('focus navigation back to the same fixed observation restores contextual applicability', () => {
  const f = fixture(), r = f.begin(); f.focus.select(addressFor('kn:phase:FORM'), 'keyboard');
  assert.equal(f.store.snapshot().bindingStatus.state, 'stale');
  f.focus.select(addressFor(ANCHOR_ID), 'text');
  f.store.importResult(variant(r));
  assert.equal(f.store.snapshot().bindingStatus.state, 'current');
});
test('source drift and then restored old bytes never silently reactivate an observed invalidated result', () => {
  const f = fixture(), r = f.begin(); f.store.importResult(variant(r)); f.store.decide('accept', 'Esplorazione locale utile.');
  const changed = binding(); changed.contextDigest = '0'.repeat(64); f.setSource(changed);
  assert.equal(f.store.snapshot().activeVariantId, null);
  assert.equal(f.store.snapshot().invalidations.length, 1);
  f.setSource(binding());
  assert.equal(f.store.snapshot().bindingStatus.state, 'stale');
  assert.equal(f.store.snapshot().activeVariantId, null);
  const reload = fixture(); reload.store.importState(f.store.exportState());
  assert.equal(reload.store.snapshot().activeVariantId, null);
  assert.throws(() => reload.store.decide('accept', 'Tentativo su storico.'), /source_was_invalidated/);
});
test('a new source-bound contribution can continue after the prior one was invalidated', () => {
  const f = fixture(); f.begin(); const changed = binding(); changed.contextDigest = '0'.repeat(64); f.setSource(changed);
  f.store.snapshot(); f.store.capture(capture());
  assert.equal(f.store.snapshot().bindingStatus.state, 'current');
  assert.equal(f.store.snapshot().contributions.length, 2);
  assert.equal(f.store.snapshot().invalidations.length, 1);
});
test('same ephemeral counter cannot substitute a different source binding', () => {
  const f = fixture(), r = f.begin(), revisionBefore = f.focus.snapshot().revision;
  const changed = binding(); changed.sources[1].sha256 = '0'.repeat(64); f.setSource(changed);
  assert.equal(f.focus.snapshot().revision, revisionBefore);
  assert.throws(() => f.store.importResult(variant(r)), /source_binding_changed/);
});
test('unavailable source blocks capture, result and decisions without erasing pending state', () => {
  const f = fixture(), r = f.begin(); f.setSource(null);
  assert.throws(() => f.store.capture(capture()), /SourceBinding/);
  assert.throws(() => f.store.importResult(variant(r)), /non applicabile/);
  assert.equal(f.store.snapshot().request.id, r.id);
  assert.equal(f.store.snapshot().bindingStatus.state, 'unavailable');
  f.setSource(binding()); assert.equal(f.store.snapshot().bindingStatus.state, 'current');
});
test('wrong request, contribution, target and source context are rejected separately', () => {
  const f = fixture(), r = f.begin();
  for (const change of [v => { v.request_id = 'other'; }, v => { v.contribution_id = 'other'; },
    v => { v.semantic_id = 'kn:phase:FORM'; }, v => { v.sourceBinding.sourceRevision = '0'.repeat(64); },
    v => { v.context.field.state.current_resultant = 'different source text'; }]) {
    const v = variant(r); change(v); assert.throws(() => checkVariant(r, v), /altra richiesta/);
  }
});
test('new request supersedes old return even with the same object and context', () => {
  const f = fixture(), old = f.begin(), newer = f.store.prepareRequest('Un’altra lettura dello stesso originale.');
  assert.throws(() => f.store.importResult(variant(old)), /altra richiesta/);
  assert.equal(f.store.snapshot().request.id, newer.id);
  assert.equal(f.store.snapshot().requests.length, 2);
  f.store.importResult(variant(newer));
});
test('a returned result stays a proposal until explicit disposition with reason', () => {
  const f = fixture(), r = f.begin(); f.store.importResult(variant(r));
  assert.equal(f.store.snapshot().activeVariantId, null);
  assert.throws(() => f.store.decide('accept', ''), /Ragione/);
  f.store.decide({ disposition: 'accept', reason: 'Utile come ipotesi da confrontare.' });
  assert.equal(f.store.snapshot().activeVariantId, 'coder_fixture_1');
  for (const disposition of ['defer','rework','reject']) {
    f.store.decide(disposition, 'Ragione esplicita della scelta.');
    assert.equal(f.store.snapshot().activeVariantId, null);
  }
  assert.equal(f.store.snapshot().decisions.length, 4);
  assert.ok(f.store.snapshot().receipts.every(e => e.scope === 'project_local_only' && e.external_mutation === false));
});
test('accepted candidate and human reason survive export/import and browser interruption', () => {
  const cache = memory(), f = fixture({ storage: cache }), r = f.begin();
  f.store.importResult(variant(r)); f.store.decide('accept', 'Continua nel progetto come variante illustrativa.');
  assert.equal(f.store.snapshot().persistence.state, 'saved');
  const reentry = fixture({ storage: cache });
  assert.equal(reentry.store.snapshot().persistence.state, 'loaded');
  assert.equal(reentry.store.snapshot().activeVariantId, 'coder_fixture_1');
  assert.match(reentry.store.snapshot().decision.reason, /variante illustrativa/);
});
test('source-stale archives remain history on reentry and do not apply their accepted candidate', () => {
  const f = fixture(), r = f.begin(); f.store.importResult(variant(r)); f.store.decide('accept', 'Scelta locale.');
  const reentry = fixture(), changed = binding(); changed.contextDigest = '0'.repeat(64); reentry.setSource(changed);
  reentry.store.importState(f.store.exportState());
  assert.equal(reentry.store.snapshot().contribution.id, r.contribution_id);
  assert.equal(reentry.store.snapshot().decisions.length, 1);
  assert.equal(reentry.store.snapshot().activeVariantId, null);
  assert.equal(reentry.store.snapshot().invalidations.length, 1);
});
test('unknown result schema quarantines original bytes without replacing a candidate', () => {
  const f = fixture(), r = f.begin(), v = variant(r); v.schema = 'kn.product-variant.v9';
  const raw = JSON.stringify(v); assert.throws(() => f.store.importResult(raw), /non riconosciuto/);
  assert.equal(f.store.snapshot().quarantine[0].raw, raw);
  assert.equal(f.store.snapshot().variant, null);
});
test('commands, effect escalation, URLs and executable markup do not cross the structured envelope', () => {
  const f = fixture(), r = f.begin();
  for (const change of [v => { v.commands = ['fetch("https://example.invalid")']; },
    v => { v.effect_class = 'execute'; }, v => { v.preview.primitives = [{ kind: 'svg', markup: '<script>alert(1)</script>' }]; },
    v => { v.preview.primitives[0].url = 'https://example.invalid'; }, v => { v.capabilities = { execute: true }; }]) {
    const v = variant(r); change(v); assert.throws(() => checkVariant(r, v));
  }
  const safe = variant(r); safe.summary = '<img src=x onerror=alert(1)> is only inert prose.';
  assert.equal(checkVariant(r, safe).summary, safe.summary); // Rendering owner uses textContent.
});
test('variant source claims must match exact packet source hashes; claims do not authenticate actors', () => {
  const f = fixture(), r = f.begin(), v = variant(r); v.sources[0].sha256 = '0'.repeat(64);
  assert.throws(() => checkVariant(r, v), /lettura dichiarata/);
  const good = checkVariant(r, variant(r));
  assert.equal(good.receiver, 'unit_fixture_not_actual_inference');
  assert.equal(good.authenticated, undefined);
});
test('variant preview cannot leave the original view or use unbounded coordinates', () => {
  const f = fixture(), r = f.begin();
  for (const change of [v => { v.preview.viewId = 'another-view'; }, v => { v.preview.primitives[0].points[0][0] = 2; },
    v => { v.preview.primitives[1].r = .9; }, v => { v.preview.primitives[0].points[0][0] = Infinity; }]) {
    const v = variant(r); change(v); assert.throws(() => checkVariant(r, v));
  }
});
test('same semantic name does not remap a captured stroke to another view or source', () => {
  const f = fixture(), c = f.store.capture(capture()); c.view.id = 'different-view';
  assert.throws(() => checkContribution(c), /vista originale/);
  const b = binding(); b.sourceRevision = '0'.repeat(64);
  assert.throws(() => checkSourceBinding(b), /sorgente verificata/);
});
test('unknown future browser state remains untouched even when new local work is produced', () => {
  const future = '{"schema":"kn.product-state.v9","future":{"preserve":"me"}}';
  const cache = memory(future), f = fixture({ storage: cache });
  assert.equal(cache.writes(), 0); f.store.capture(capture());
  assert.equal(cache.raw(), future); assert.equal(cache.writes(), 0);
  assert.equal(f.store.snapshot().persistence.state, 'blocked');
  assert.equal(f.store.snapshot().quarantine[0].raw, future);
  assert.equal(JSON.parse(f.store.exportState()).contributions.length, 1);
});
test('failed storage writes preserve exportable in-memory work and never claim saved', () => {
  const cache = { getItem: () => null, setItem() { throw new Error('quota'); } }, f = fixture({ storage: cache });
  f.store.capture(capture());
  assert.equal(f.store.snapshot().persistence.state, 'error');
  assert.equal(JSON.parse(f.store.exportState()).contributions.length, 1);
});
test('failed load does not automatically overwrite unreadable storage', () => {
  let writes = 0; const cache = { getItem() { throw new Error('denied'); }, setItem() { writes++; } };
  const f = fixture({ storage: cache }); f.store.capture(capture());
  assert.equal(writes, 0); assert.equal(f.store.snapshot().persistence.state, 'blocked');
});
test('a concurrently changed cache is preserved and surfaced instead of silently replaced', () => {
  const cache = memory(), f = fixture({ storage: cache }); f.store.capture(capture());
  const external = '{"schema":"another-writer"}'; cache.otherWriter(external);
  f.store.prepareRequest('Continua in memoria senza cancellare l’altra copia.');
  assert.equal(cache.raw(), external);
  assert.equal(f.store.snapshot().persistence.state, 'blocked');
  assert.equal(f.store.snapshot().requests.length, 1);
});
test('failed state import keeps current originals and never loads an empty replacement', () => {
  const f = fixture(); f.begin(); const original = f.store.snapshot().contribution;
  assert.throws(() => f.store.importState('{bad json'), /JSON non leggibile/);
  assert.deepEqual(f.store.snapshot().contribution, original);
  assert.equal(f.store.snapshot().quarantine[0].raw, '{bad json');
});
test('archive pointer rollback cannot revive a superseded request or a rejected disposition', () => {
  const f = fixture(), r = f.begin(); f.store.importResult(variant(r)); f.store.decide('accept', 'Prima scelta.');
  const acceptedDecision = f.store.snapshot().decision.id;
  f.store.decide('reject', 'Nuova osservazione: respinta.');
  const changed = JSON.parse(f.store.exportState()); changed.selection.decisionId = acceptedDecision;
  changed.selection.activeVariantId = changed.selection.variantId;
  assert.throws(() => checkProjectState(changed), /selezione superata/);
});
test('importing a pre-invalidation archive cannot erase a known source invalidation', () => {
  const f = fixture(), r = f.begin(); f.store.importResult(variant(r)); f.store.decide('accept', 'Ipotesi iniziale.');
  const beforeDrift = f.store.exportState(), changed = binding(); changed.contextDigest = '0'.repeat(64);
  f.setSource(changed); f.store.snapshot(); f.setSource(binding());
  assert.throws(() => f.store.importState(beforeDrift), /storia già osservata/);
  assert.equal(f.store.snapshot().invalidations.length, 1);
  assert.equal(f.store.snapshot().activeVariantId, null);
});
test('importing a pre-reject archive cannot revive a previously accepted candidate', () => {
  const f = fixture(), r = f.begin(); f.store.importResult(variant(r)); f.store.decide('accept', 'Ipotesi iniziale.');
  const beforeRejection = f.store.exportState(); f.store.decide('reject', 'Conseguenza successiva: respinta.');
  assert.throws(() => f.store.importState(beforeRejection), /storia già osservata/);
  assert.equal(f.store.snapshot().decision.disposition, 'reject');
  assert.equal(f.store.snapshot().activeVariantId, null);
});
test('importing an old pending request cannot undo its supersession', () => {
  const f = fixture(), first = f.begin(), beforeSupersession = f.store.exportState();
  const later = f.store.prepareRequest('Nuova richiesta dopo l’osservazione.');
  assert.throws(() => f.store.importState(beforeSupersession), /storia già osservata/);
  assert.equal(f.store.snapshot().request.id, later.id);
  assert.throws(() => f.store.importResult(variant(first)), /altra richiesta/);
});
test('same original ID with rewritten source wording is a conflict, not a newer archive', () => {
  const f = fixture(); f.store.capture(capture()); const edited = JSON.parse(f.store.exportState());
  edited.contributions[0].note = 'Nuovo testo sostituito';
  edited.contributions[0].capture.contributions[0].text = 'Nuovo testo sostituito';
  assert.throws(() => f.store.importState(edited), /storia già osservata/);
  assert.equal(f.store.snapshot().contribution.note, capture().note);
});
test('equivalent archive reimport is allowed despite later transport receipts', () => {
  const f = fixture(); f.begin(); const same = f.store.exportState();
  f.store.importState(same); f.store.importState(same);
  assert.equal(f.store.snapshot().requests.length, 1);
});
test('reordering the same decision records cannot turn an old acceptance into the latest choice', () => {
  const f = fixture(), r = f.begin(); f.store.importResult(variant(r));
  f.store.decide('accept', 'Prima scelta.'); const oldAccept = f.store.snapshot().decision.id;
  f.store.decide('reject', 'Scelta successiva: respinta.');
  const reordered = JSON.parse(f.store.exportState()); reordered.decisions.reverse();
  reordered.selection.decisionId = oldAccept;
  reordered.selection.activeVariantId = reordered.selection.variantId;
  assert.doesNotThrow(() => checkProjectState(reordered)); // Locally unknown archive order is not authenticated.
  assert.throws(() => f.store.importState(reordered), /riordinati/);
  assert.equal(f.store.snapshot().decision.disposition, 'reject');
  assert.equal(f.store.snapshot().activeVariantId, null);
});
test('reordering the same request records cannot revive a superseded pending request', () => {
  const f = fixture(), earlier = f.begin(), later = f.store.prepareRequest('Seconda richiesta.');
  const reordered = JSON.parse(f.store.exportState()); reordered.requests.reverse();
  reordered.selection.requestId = earlier.id;
  assert.doesNotThrow(() => checkProjectState(reordered));
  assert.throws(() => f.store.importState(reordered), /riordinati/);
  assert.equal(f.store.snapshot().request.id, later.id);
});
test('a local effect receipt must reference the actual record of that effect', () => {
  const f = fixture(); f.begin(); const exported = JSON.parse(f.store.exportState());
  exported.receipts.push({ id: 'orphan_receipt', created_at: NOW, kind: 'decision_recorded',
    record_id: 'never_existed', scope: 'project_local_only', external_mutation: false });
  assert.throws(() => checkProjectState(exported), /Ricevuta senza/);
});
test('explicit AI return focus uses the existing semantic target without external mutation', () => {
  const f = fixture(), r = f.begin(), v = variant(r); v.focus_target = 'kn:phase:FORM';
  f.store.importResult(v); assert.equal(f.focus.snapshot().field.address.semantic_id, ANCHOR_ID);
  f.store.showTarget(); assert.equal(f.focus.snapshot().field.address.semantic_id, 'kn:phase:FORM');
  assert.equal(f.store.snapshot().activeVariantId, null);
});
test('file transport rejects oversized, deeply nested and prototype-bearing data', () => {
  assert.throws(() => plainData(' '.repeat(2 * 1024 * 1024 + 1)), /troppo grande/);
  assert.throws(() => plainData('{"__proto__":{"polluted":true}}'), /non ammesso/);
  assert.equal({}.polluted, undefined);
  let nested = null; for (let i = 0; i < 40; i++) nested = { nested };
  assert.throws(() => plainData(nested), /complessa/);
  let invoked = false; const data = {}; Object.defineProperty(data, 'x', { enumerable: true, get() { invoked = true; } });
  assert.throws(() => plainData(data), /accessore/); assert.equal(invoked, false);
});
