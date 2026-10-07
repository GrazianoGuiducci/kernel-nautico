import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareProjection, validateProjectionWork, canonical, caseView, caseFingerprint, digest } from '../src/encounter/model.js';
import { SCENES, TOTAL_SECONDS } from '../src/encounter/content.js';
const fixture = (caseId = 'private-case-A') => ({
  case: { id: caseId, originalContribution: { text: 'PRIVATE-CLIENT-ALPHA reports PRIVATE-SERIAL-001', actor: 'PRIVATE-PERSON' },
    revisions: [{ id: 'private-revision', notes: 'PRIVATE-PROCEDURE' }], returns: [{ id: 'private-return' }], events: [] },
  revision: { id: 'private-revision', number: 1, label: 'PRIVATE-PROJECT', definitions: [{ kind: 'observed', text: 'PRIVATE-EVENT' }], questions: ['PRIVATE-QUESTION'], sourceRefs: [{ reference: 'PRIVATE-DOCUMENT' }] },
  request: { id: 'private-request' }, result: { id: 'private-return', summary: 'PRIVATE-CONCLUSION', returnPaths: [] },
  sourceStatus: { state: 'current', reasons: [] }, persistence: { state: 'saved' },
});
const form = (scope = 'public_candidate') => ({ scope, kind: 'owner-interface', owner: 'Kernel Nautico / Lifecycle Return Qualification',
  title: 'Distinguere disponibilità e compatibilità', method: 'Un’alternativa disponibile non è ancora una scelta compatibile. Rendi leggibile il passaggio fra chi conosce il componente e chi ne decide l’uso.',
  reason: 'La stessa proposta attraversa responsabilità diverse.', nextUse: 'Quando si considera una sostituzione.',
  limits: 'Non dedurre equivalenza tecnica senza fonti e competenze pertinenti.', reviewed: true });
const options = { id: () => 'projection-001', now: () => '2026-10-05T15:00:00.000Z' };

test('A: public candidate copies selected method, not private case content or identities', async () => {
  const source = fixture(), before = canonical(source), work = await prepareProjection(source, form(), options);
  const exported = JSON.stringify(work.candidate);
  for (const marker of ['PRIVATE-', 'private-case', 'private-revision', 'private-request', 'private-return', 'caseDigest', 'originalContribution']) assert.ok(!exported.includes(marker), marker);
  assert.equal(work.candidate.method, form().method); assert.equal(canonical(source), before);
  assert.equal(work.localReceipt.origin.caseId, source.case.id);
  assert.equal(work.localReceipt.privacy, 'private_do_not_publish');
});
test('B: different supplier case and private destination exercise the same projection function', async () => {
  const source = fixture('private-case-B'); source.case.originalContribution.text = 'PRIVATE-SUPPLIER proposes an alternative after a drawing revision.';
  source.revision.label = 'A different configuration';
  const work = await prepareProjection(source, { ...form('company_private'), owner: 'Owner aziendale', kind: 'reusable-method' }, options);
  assert.equal(work.candidate.scope, 'company_private'); assert.ok(!JSON.stringify(work.candidate).includes('PRIVATE-SUPPLIER'));
  assert.equal(work.localReceipt.origin.caseId, 'private-case-B');
});
test('generalizable does not grant application or publication', async () => {
  const { candidate } = await prepareProjection(fixture(), form(), options);
  assert.equal(candidate.applicationState, 'proposed_not_applied');
  assert.equal(candidate.publicationAuthority, 'not_granted_by_this_file');
  assert.match(candidate.review, /not_independent/);
});
test('explicitly selected sensitive text is NOT automatically anonymized', async () => {
  const { candidate } = await prepareProjection(fixture(), { ...form(), method: 'PRIVATE-EXPLICIT-TEXT' }, options);
  assert.equal(candidate.method, 'PRIVATE-EXPLICIT-TEXT');
});
test('local working copy resumes byte-equivalent candidate on the same source', async () => {
  const source = fixture(), work = await prepareProjection(source, form(), options);
  const restored = await validateProjectionWork(source, JSON.stringify(work));
  assert.equal(canonical(restored), canonical(work));
});
test('changed case cannot reactivate an older reviewed projection', async () => {
  const source = fixture(), work = await prepareProjection(source, form(), options);
  source.case.events.push({ kind: 'case_revised' });
  await assert.rejects(validateProjectionWork(source, work), /diverso|cambiato/);
});
test('changed source applicability invalidates review even if case bytes return', async () => {
  const source = fixture(), work = await prepareProjection(source, form(), options);
  source.sourceStatus = { state: 'stale', reasons: ['source_was_invalidated'] };
  await assert.rejects(validateProjectionWork(source, work), /diverso|cambiato/);
});
test('navigation and persistence messages are not material case differences', async () => {
  const source = fixture(), original = await caseFingerprint(source);
  source.persistence = { state: 'memory_only' }; source.selectedView = 'learning';
  assert.equal(await caseFingerprint(source), original);
});
test('foreign case cannot reuse a local receipt', async () => {
  const work = await prepareProjection(fixture(), form(), options);
  await assert.rejects(validateProjectionWork(fixture('other'), work));
});
test('tampered method and unknown extra keys are rejected', async () => {
  const work = await prepareProjection(fixture(), form(), options);
  work.candidate.method += ' CHANGED'; await assert.rejects(validateProjectionWork(fixture(), work), /ricevuta/);
  work.candidate.secret = 'PRIVATE'; await assert.rejects(validateProjectionWork(fixture(), work), /Forma/);
});
test('forged apply/publish status is not accepted even with a recomputed digest', async () => {
  const work = await prepareProjection(fixture(), form(), options);
  work.candidate.applicationState = 'applied'; work.localReceipt.projectionDigest = await digest(work.candidate);
  await assert.rejects(validateProjectionWork(fixture(), work), /autorità/);
});
test('local receipt cannot redirect origin while retaining the same case digest', async () => {
  const work = await prepareProjection(fixture(), form(), options);
  work.localReceipt.origin.requestId = 'other-request';
  await assert.rejects(validateProjectionWork(fixture(), work), /diverso|cambiato/);
});
for (const [name, change] of [
  ['missing review', { reviewed: false }], ['unknown scope', { scope: 'public_approved' }],
  ['unknown kind', { kind: 'publish' }], ['missing meaning', { reason: '  ' }], ['overlong method', { method: 'x'.repeat(4001) }],
]) test(name + ' does not prepare a candidate', async () => {
  await assert.rejects(prepareProjection(fixture(), { ...form(), ...change }, options));
});
test('unknown future schema and prototype injection remain rejected', async () => {
  const work = await prepareProjection(fixture(), form(), options);
  work.schema = 'kn.learning-work.v99'; await assert.rejects(validateProjectionWork(fixture(), work));
  await assert.rejects(validateProjectionWork(fixture(), '{"__proto__":{"admin":true}}'));
  assert.equal({}.admin, undefined);
});
test('case view preserves original and explicit definition types', () => {
  const s = fixture(), before = canonical(s), v = caseView(s);
  assert.equal(v.original, s.case.originalContribution.text); assert.equal(v.definitions[0].kind, 'observed');
  v.definitions[0].text = 'edited projection'; assert.equal(canonical(s), before);
});
test('a stale historic return is not displayed as a current answer', () => {
  const s = fixture(); s.sourceStatus.state = 'stale'; const v = caseView(s);
  assert.equal(v.result, null); assert.equal(v.historicalReturnCount, 1); assert.equal(v.current, false);
});
test('empty view is a useful entry, not a fake example or an inferred company', () => {
  assert.equal(caseView({ case: null }).empty, true);
});
test('story scenes have distinct function and finite meaningful duration', () => {
  assert.equal(new Set(SCENES.map(s => s.id)).size, SCENES.length);
  assert.equal(TOTAL_SECONDS, 57);
  for (const s of SCENES) assert.ok(s.detail && s.change && s.roles.length > 0 && s.seconds > 0);
});
