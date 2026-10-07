/** Synthetic contract tests. No receiver inference, company data or external effect is exercised. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SCHEMAS, LIMITS, digest, checkRequest, checkReturn, checkCase, checkCompanySourceBinding,
  plainData } from '../src/company/contract.js';
import { createCompanyStore, STORAGE_KEY } from '../src/company/store.js';

const TIME = '2026-10-04T21:30:00.000Z';
const clone = value => JSON.parse(JSON.stringify(value));
const binding = (version = 'a') => ({
  schema: SCHEMAS.binding, repository: 'GrazianoGuiducci/kernel-nautico', branch: 'work/synthetic-case-test',
  revision: version.repeat(40), sourceId: 'kn:source:company-case:v1', sourceRevision: version.repeat(64),
  viewId: 'kn:view:company-field:v1', assetPath: null,
  sources: [{ path: 'KERNEL.md', blob: version.repeat(40), sha256: version.repeat(64),
    revision: version.repeat(40), scope: 'owner_source_snapshot' }],
  contextDigest: version.repeat(64), observation: 'local_build_snapshot',
  freshness: 'pinned_not_continuous_remote', availability: 'available',
});
const METHOD = { id: 'test-method', purpose: 'Verificare il contratto, non una capacità AI.',
  instructions: ['Leggere il contributo e distinguere osservazioni e proposte.', 'Conservare i ritorni come suggerimenti, non come owner già aggiornati.'] };
const draft = extra => ({ label: 'Caso sintetico', company: '', project: '', object: '', contextId: 'studio',
  originalContribution: 'Vorrei rendere comprensibile il prossimo cambiamento del prodotto.',
  definitions: [], sourceRefs: [], questions: [], linkedDesign: null, ...extra });
const definition = (text = 'Specificare insieme una misura utile.') => ({ id: 'definition:1', kind: 'proposed', text,
  sourceRef: null, reason: 'La prima idea non contiene ancora le misure.', actor: 'Operatore del test, non utente reale' });
function memory(initial = {}) {
  const data = new Map(Object.entries(initial)); const writes = [];
  return { data, writes, getItem: key => data.get(key) ?? null,
    setItem(key, value) { writes.push({ key, value }); data.set(key, value); } };
}
async function makeStore({ storage = null, current = binding(), prefix = 'test' } = {}) {
  let serial = 0, observed = current;
  const store = await createCompanyStore({ getSourceBinding: () => observed, storage,
    now: () => TIME, id: () => `${prefix}:${++serial}` });
  return { store, setBinding(value) { observed = value; } };
}
function resultFor(request, extra = {}) {
  const source = request.payload.sourceInventory[0];
  return { schema: SCHEMAS.result, id: 'return:test:1', requestId: request.id, requestDigest: request.digest,
    caseId: request.caseId, revisionId: request.revisionId, created_at: TIME,
    receiver: { name: 'Synthetic contract fixture — no AI inference', runId: 'fixture-run', attribution: 'self_reported' },
    summary: 'Restituzione sintetica per verificare identità e separazione degli effetti.',
    observations: [{ text: 'L’intento è espresso nel contributo.', sourceIds: [source.sourceId], reason: 'Origine della richiesta di prova.' }],
    proposals: [{ text: 'Chiarire insieme il prodotto specifico.', reason: 'Una proposta può formarsi prima di tutte le specifiche.' }],
    questions: ['Quale parte del prodotto è pertinente?'],
    sourceReads: [{ sourceId: source.sourceId, reference: source.reference, revision: source.revision, sha256: source.sha256,
      readState: 'read_by_receiver', observedAt: TIME, usedFor: 'Lettura dichiarata dalla fixture, non prova di un ricevente AI.' }],
    returnPaths: [{ owner: 'Kernel Nautico / enterprise incarnation', kind: 'state', reason: 'Conservare la domanda del caso.',
      nextUse: 'Rientrare dalla domanda conservata.', applicationState: 'proposed_not_applied' }],
    effectClass: 'analysis_proposal_only', ...extra };
}
async function prepared(options) {
  const setup = await makeStore(options); setup.store.capture(draft());
  return { ...setup, request: await setup.store.prepareRequest(METHOD) };
}

test('an empty store neither seeds company observations nor writes any cache', async () => {
  const storage = memory({ 'kn:integrated-product:0.1': 'existing-design-cache' });
  const { store } = await makeStore({ storage });
  assert.equal(store.snapshot().case, null); assert.equal(store.snapshot().sourceStatus.state, 'empty');
  assert.equal(storage.writes.length, 0); assert.equal(storage.getItem('kn:integrated-product:0.1'), 'existing-design-cache');
  assert.throws(() => store.exportState(), /Conserva prima/);
});

test('a case can begin with intent and an open context without invented company specifications', async () => {
  const { store } = await makeStore(); const snapshot = store.capture(draft());
  assert.equal(snapshot.case.schema, SCHEMAS.case); assert.equal(snapshot.case.scope, 'local_working_case');
  assert.equal(snapshot.revision.company, ''); assert.deepEqual(snapshot.revision.definitions, []);
  assert.equal(snapshot.case.originalContribution.actor, 'local_operator_unverified');
  assert.deepEqual(snapshot.case.events.map(event => event.kind), ['case_created']);
  assert.equal(snapshot.sourceStatus.state, 'current');
  await checkCase(store.exportState());
});

test('request includes exact context, source distinctions, self-contained method and return contract', async () => {
  const { store, request } = await prepared();
  assert.equal(await digest(request.payload), request.digest);
  assert.deepEqual(request.payload.method, METHOD);
  assert.equal(request.payload.originalContribution.text, draft().originalContribution);
  assert.equal(request.payload.transport, 'manual_file_handoff_not_sent');
  assert.equal(request.payload.effectCeiling, 'local_analysis_proposal_only');
  assert.equal(request.payload.sourceInventory[0].status, 'included_in_request');
  assert.equal(request.payload.sourceInventory.find(source => source.sourceId === 'owner:KERNEL.md').status, 'bound_snapshot_not_read');
  assert.equal(request.payload.returnContract.template.effectClass, 'analysis_proposal_only');
  assert.equal(store.snapshot().request.id, request.id);
  await checkRequest(request);
});

test('re-exporting unchanged input keeps the exact request even after a received return', async () => {
  const { store, request } = await prepared();
  assert.deepEqual(await store.prepareRequest(clone(METHOD)), request);
  assert.equal(store.snapshot().case.requests.length, 1);
  await store.importReturn(resultFor(request));
  assert.deepEqual(await store.prepareRequest(METHOD), request);
  assert.equal(store.snapshot().case.requests.length, 1);
  assert.equal(store.snapshot().case.events.length, 3);
});

test('a real edit appends a revision and new request while preserving original and prior result', async () => {
  const { store, request } = await prepared(); const result = resultFor(request); await store.importReturn(result);
  store.revise(draft({ definitions: [definition()] }));
  const next = await store.prepareRequest(METHOD);
  assert.notEqual(next.id, request.id); assert.notEqual(next.digest, request.digest);
  assert.equal(store.snapshot().case.originalContribution.text, draft().originalContribution);
  assert.equal(store.snapshot().case.returns[0].id, result.id); assert.equal(store.snapshot().result, null);
  assert.equal(store.snapshot().case.revisions.length, 2);
  await assert.rejects(store.importReturn(result), /un’altra richiesta/);
  await checkCase(store.exportState());
});

test('an unchanged draft does not create a revision or churn request identity', async () => {
  const { store, request } = await prepared(); store.revise(draft());
  assert.equal(store.snapshot().case.revisions.length, 1);
  assert.deepEqual(await store.prepareRequest(METHOD), request);
});

test('an unchanged revision remains usable at capacity while further edits preserve full history', async () => {
  const { store } = await makeStore(); store.capture(draft());
  for (let index = 2; index <= 32; index++) store.revise(draft({ label: `Revision ${index}` }));
  const before = store.exportState(); store.revise(draft({ label: 'Revision 32' }));
  assert.equal(store.exportState(), before);
  assert.throws(() => store.revise(draft({ label: 'Revision 33' })), /Limite locale raggiunto/);
  assert.equal(store.exportState(), before);
});

test('editing the immutable original is refused and its history remains untouched', async () => {
  const { store } = await prepared(); const before = store.exportState();
  assert.throws(() => store.revise(draft({ originalContribution: 'A replacement original.' })), /immutabile/);
  assert.equal(store.exportState(), before);
});

test('changed method creates a distinguishable request and rejects the superseded return', async () => {
  const { store, request } = await prepared();
  const next = await store.prepareRequest({ ...METHOD, instructions: [...METHOD.instructions, 'Una relazione ulteriore.'] });
  assert.notEqual(next.digest, request.digest);
  await assert.rejects(store.importReturn(resultFor(request)), /un’altra richiesta/);
  assert.equal(store.snapshot().case.returns.length, 0);
});

test('tampered request content and authority fields fail before a receiver result can attach', async () => {
  const { request } = await prepared();
  const changed = clone(request); changed.payload.method.purpose = 'Altered purpose';
  await assert.rejects(checkRequest(changed), /digest/);
  const authority = clone(request); authority.payload.effectCeiling = 'execute_external';
  await assert.rejects(checkRequest(authority), /confine operativo/);
  const code = clone(request); code.payload.method = { purpose: 'x', instructions: [] };
  await assert.rejects(checkRequest(code), /Istruzioni operative/);
});

test('wrong return identity, digest or source attribution does not mutate stored work', async () => {
  const { store, request } = await prepared(); const before = store.exportState();
  for (const wrong of [
    resultFor(request, { requestId: 'wrong-request' }), resultFor(request, { requestDigest: 'f'.repeat(64) }),
    resultFor(request, { revisionId: 'wrong-revision' }), resultFor(request, { caseId: 'wrong-case' }),
  ]) await assert.rejects(store.importReturn(wrong), /un’altra richiesta/);
  const wrongSource = resultFor(request); wrongSource.sourceReads[0].revision = 'not-the-source';
  await assert.rejects(store.importReturn(wrongSource), /lettura dichiarata/);
  assert.equal(store.exportState(), before);
});

test('observations need declared source reads while unresolved questions can stand alone', async () => {
  const { request } = await prepared();
  await assert.rejects(checkReturn(request, resultFor(request, { sourceReads: [] })), /priva delle sue letture/);
  const questionsOnly = resultFor(request, { observations: [], proposals: [], sourceReads: [], returnPaths: [] });
  assert.deepEqual((await checkReturn(request, questionsOnly)).questions, questionsOnly.questions);
});

test('included revision and method can support a return without claiming original or full owner reads', async () => {
  const { store } = await makeStore(); store.capture(draft({ definitions: [definition()] }));
  const request = await store.prepareRequest(METHOD);
  const included = request.payload.sourceInventory.filter(source => ['case:revision', 'method:included'].includes(source.sourceId));
  assert.equal(included.length, 2); assert.ok(included.every(source => source.status === 'included_in_request'));
  const result = resultFor(request, {
    observations: [{ text: 'Una specifica è già proposta nella revisione, senza riscrivere l’intento originale.',
      sourceIds: ['case:revision'], reason: 'La nuova definizione partecipa alla domanda.' }],
    sourceReads: included.map(source => ({ sourceId: source.sourceId, reference: source.reference,
      revision: source.revision, sha256: source.sha256, readState: 'read_by_receiver', observedAt: TIME,
      usedFor: 'Lettura del solo testo incluso nella richiesta sintetica.' })),
  });
  await store.importReturn(result);
  assert.deepEqual(store.snapshot().result.sourceReads.map(source => source.sourceId), ['case:revision', 'method:included']);
  assert.equal(store.snapshot().result.sourceReads.some(source => source.sourceId.startsWith('owner:')), false);
});

test('supplied references remain distinct from actual reads and definitions require attributed provenance', async () => {
  const { store } = await makeStore();
  const source = { id: 'drawing', label: 'Disegno fornito', reference: 'local:declared-drawing', owner: '', revision: null, status: 'supplied_not_read' };
  store.capture(draft({ sourceRefs: [source], definitions: [{ ...definition(), sourceRef: source.id }] }));
  const request = await store.prepareRequest(METHOD);
  assert.equal(request.payload.sourceInventory.at(-1).status, 'supplied_not_read');
  const before = store.exportState();
  assert.throws(() => store.revise(draft({ sourceRefs: [source], definitions: [{ ...definition(), sourceRef: 'not-supplied' }] })), /riferimento dichiarato/);
  assert.equal(store.exportState(), before);
});

test('source changes invalidate pending work and restoring previous bytes cannot reactivate it', async () => {
  const { store, request, setBinding } = await prepared();
  setBinding(binding('b')); assert.equal(store.snapshot().sourceStatus.state, 'stale');
  assert.equal(store.snapshot().case.invalidations.length, 1);
  setBinding(binding('a')); assert.equal(store.snapshot().sourceStatus.state, 'stale');
  await assert.rejects(store.prepareRequest(METHOD), /non è più applicabile/);
  await assert.rejects(store.importReturn(resultFor(request)), /non è più applicabile/);
  store.revise(draft()); assert.equal(store.snapshot().sourceStatus.state, 'current');
  const next = await store.prepareRequest(METHOD); assert.notEqual(next.revisionId, request.revisionId);
  assert.equal(store.snapshot().case.invalidations.length, 1);
  await checkCase(store.exportState());
});

test('temporary source unavailability preserves the case without fabricating a changed source', async () => {
  const { store, setBinding } = await prepared(); setBinding(null);
  assert.equal(store.snapshot().sourceStatus.state, 'unavailable'); assert.equal(store.snapshot().case.invalidations.length, 0);
  await assert.rejects(store.prepareRequest(METHOD), /non è più applicabile/);
  setBinding(binding()); assert.equal(store.snapshot().sourceStatus.state, 'current');
});

test('return paths are suggestions and cannot claim owner assimilation or modify definitions', async () => {
  const { store, request } = await prepared(); const result = resultFor(request);
  result.returnPaths[0].kind = 'reusable-method';
  await store.importReturn(result);
  assert.deepEqual(store.snapshot().revision.definitions, []);
  assert.equal(store.snapshot().result.returnPaths[0].applicationState, 'proposed_not_applied');
  const applied = clone(result); applied.returnPaths[0].applicationState = 'assimilated';
  await assert.rejects(checkReturn(request, applied), /aggiornamento owner/);
});

test('same return import is idempotent but a different return cannot silently replace it', async () => {
  const { store, request } = await prepared(); const result = resultFor(request);
  await store.importReturn(result); const before = store.exportState();
  await store.importReturn(clone(result)); assert.equal(store.exportState(), before);
  await assert.rejects(store.importReturn({ ...result, summary: 'Different return' }), /restituzione diversa/);
  assert.equal(store.exportState(), before);
});

test('portable import in a fresh store preserves records and validates their digests', async () => {
  const { store, request } = await prepared(); await store.importReturn(resultFor(request));
  const exported = store.exportState(), receiver = await makeStore({ prefix: 'receiver' });
  await receiver.store.importState(exported);
  assert.deepEqual(receiver.store.snapshot().case, JSON.parse(exported));
  const changed = JSON.parse(exported); changed.requests[0].payload.method.instructions.push('Tamper');
  await assert.rejects(receiver.store.importState(changed), /digest/);
});

test('a near-limit exported archive roundtrips even when indentation would exceed the import byte limit', async () => {
  const { store } = await makeStore();
  const definitions = Array.from({ length: 24 }, (_, index) => ({ ...definition('x'.repeat(1200)), id: `definition:${index}` }));
  const bytes = text => new TextEncoder().encode(text).byteLength;
  let crossedIndentationLimit = false;
  for (let index = 1; index <= 32; index++) {
    const input = draft({ label: `Large revision ${index}`, definitions });
    if (index === 1) store.capture(input); else store.revise(input);
    await store.prepareRequest(METHOD);
    if (bytes(JSON.stringify(store.snapshot().case, null, 2)) > LIMITS.fileBytes) { crossedIndentationLimit = true; break; }
  }
  assert.equal(crossedIndentationLimit, true, 'The test must reach the actual pretty-print overflow boundary.');
  const exported = store.exportState();
  assert.ok(bytes(exported) <= LIMITS.fileBytes);
  await checkCase(exported);
  const { store: receiving } = await makeStore({ prefix: 'large-receiver' });
  await receiving.importState(exported);
  assert.equal(receiving.exportState(), exported);
});

test('known historical prefix rejects rollback, rewrite and reordered same-revision requests', async () => {
  const { store, request } = await prepared(); const beforeSecondRequest = store.exportState();
  await store.prepareRequest({ ...METHOD, instructions: [...METHOD.instructions, 'Second request instruction'] });
  const current = store.exportState();
  await assert.rejects(store.importState(beforeSecondRequest), /storia già osservata/);
  const reordered = JSON.parse(current); reordered.requests.reverse();
  [reordered.events[1].recordId, reordered.events[2].recordId] = [reordered.events[2].recordId, reordered.events[1].recordId];
  await checkCase(reordered); // Structurally plausible elsewhere; incompatible with this observed order.
  await assert.rejects(store.importState(reordered), /storia già osservata/);
  assert.equal(store.exportState(), current); assert.equal(store.snapshot().case.requests[0].id, request.id);
});

test('imported chronology cannot claim a late return after its request was superseded', async () => {
  const { store, request } = await prepared();
  await store.prepareRequest({ ...METHOD, instructions: [...METHOD.instructions, 'Second request'] });
  const archive = JSON.parse(store.exportState()), result = resultFor(request);
  archive.returns.push(result); archive.events.push({ id: 'event:forged-late-return', sequence: archive.events.length + 1,
    kind: 'return_received', recordId: result.id, revisionId: result.revisionId, created_at: TIME });
  await assert.rejects(checkCase(archive), /senza richiesta corrente applicabile/);
});

test('imported chronology cannot prepare work from an already invalidated revision', async () => {
  const { store, request, setBinding } = await prepared(); setBinding(binding('b')); store.refresh();
  const archive = JSON.parse(store.exportState()), invalidRequest = { ...request, id: 'request:after-invalidation' };
  archive.requests.push(invalidRequest); archive.events.push({ id: 'event:forged-request', sequence: archive.events.length + 1,
    kind: 'request_prepared', recordId: invalidRequest.id, revisionId: invalidRequest.revisionId, created_at: TIME });
  await assert.rejects(checkCase(archive), /dopo l’invalidazione/);
});

test('an archive cannot drop an observed invalidation or rewrite the original contribution', async () => {
  const { store, setBinding } = await prepared(); const old = store.exportState();
  setBinding(binding('b')); store.refresh(); setBinding(binding('a'));
  await assert.rejects(store.importState(old), /storia già osservata/);
  const changed = JSON.parse(store.exportState()); changed.originalContribution.text = 'Edited origin';
  changed.requests[0].payload.originalContribution.text = changed.originalContribution.text;
  changed.requests[0].digest = await digest(changed.requests[0].payload);
  await assert.rejects(store.importState(changed), /originale.*modificato/);
});

test('future or malformed imported schemas preserve the current case and cache', async () => {
  const storage = memory(); const { store } = await prepared({ storage }); const before = store.exportState(), cached = storage.getItem(STORAGE_KEY);
  await assert.rejects(store.importState('{malformed'), /JSON non leggibile/);
  const future = JSON.parse(before); future.schema = 'kn.company-case.v99';
  await assert.rejects(store.importState(future), /futuro o non riconosciuto/);
  assert.equal(store.exportState(), before); assert.equal(storage.getItem(STORAGE_KEY), cached);
});

test('unknown startup cache is not replaced when new in-memory work is captured', async () => {
  const original = '{"schema":"kn.company-case.v99","important":"preserve me"}';
  const storage = memory({ [STORAGE_KEY]: original }); const { store } = await makeStore({ storage });
  assert.equal(store.snapshot().persistence.state, 'blocked'); store.capture(draft());
  assert.equal(storage.getItem(STORAGE_KEY), original); assert.equal(storage.writes.length, 0);
  assert.ok(JSON.parse(store.exportState()).originalContribution.text);
});

test('storage read, write and readback failures never claim a saved case', async () => {
  const badRead = await makeStore({ storage: { getItem() { throw new Error('read failed'); }, setItem() { throw new Error('should not write'); } } });
  badRead.store.capture(draft()); assert.equal(badRead.store.snapshot().persistence.state, 'blocked');
  const badWrite = await makeStore({ storage: { getItem() { return null; }, setItem() { throw new Error('quota'); } } });
  badWrite.store.capture(draft()); assert.equal(badWrite.store.snapshot().persistence.state, 'error');
  assert.equal(JSON.parse(badWrite.store.exportState()).revisions.length, 1);
  const badReadback = await makeStore({ storage: { getItem() { return null; }, setItem() {} } });
  badReadback.store.capture(draft()); assert.equal(badReadback.store.snapshot().persistence.state, 'error');
});

test('concurrent browser history is preserved and cannot be erased by explicit stale import', async () => {
  const storage = memory(); const first = await prepared({ storage, prefix: 'first' });
  const second = await makeStore({ storage, prefix: 'second' });
  first.store.revise(draft({ label: 'Changed in first window' })); const other = storage.getItem(STORAGE_KEY);
  second.store.revise(draft({ label: 'Changed in second window' }));
  assert.equal(second.store.snapshot().persistence.state, 'blocked'); assert.equal(storage.getItem(STORAGE_KEY), other);
  await assert.rejects(second.store.importState(second.store.exportState()), /storia già osservata/);
  assert.equal(storage.getItem(STORAGE_KEY), other);
});

test('reloading recognized cache does not write it and preserves request reuse', async () => {
  const storage = memory(); const { store, request } = await prepared({ storage });
  const count = storage.writes.length, loaded = await makeStore({ storage, prefix: 'loaded' });
  assert.equal(loaded.store.snapshot().persistence.state, 'loaded'); assert.equal(storage.writes.length, count);
  assert.deepEqual(await loaded.store.prepareRequest(METHOD), request); assert.equal(storage.writes.length, count);
  assert.equal(loaded.store.exportState(), store.exportState());
});

test('case changes during asynchronous request formation cannot attach a stale request', async () => {
  const { store } = await makeStore(); store.capture(draft());
  const pending = store.prepareRequest(METHOD); store.revise(draft({ label: 'New revision while digest is pending' }));
  await assert.rejects(pending, /cambiato durante la preparazione/);
  assert.equal(store.snapshot().case.requests.length, 0);
});

test('company source validation cannot confuse the design source or accept traversal paths', async () => {
  const wrong = binding(); wrong.sourceId = 'kn:source:stern-plan:v1';
  assert.throws(() => checkCompanySourceBinding(wrong), /Sorgente del caso/);
  const traversal = binding(); traversal.sources[0].path = '../outside';
  assert.throws(() => checkCompanySourceBinding(traversal), /Identità delle fonti/);
});

test('untrusted data is bounded and never invokes getters or imports executable fields', async () => {
  let invoked = false; const malicious = {};
  Object.defineProperty(malicious, 'purpose', { enumerable: true, get() { invoked = true; return 'Bad'; } });
  assert.throws(() => plainData(malicious), /accessore/); assert.equal(invoked, false);
  const { store } = await makeStore(); assert.throws(() => store.capture(draft({ execute: 'external command' })), /Bozza non riconosciuta/);
  await assert.rejects(store.importState('x'.repeat(2 * 1024 * 1024 + 1)), /troppo grande/);
});
