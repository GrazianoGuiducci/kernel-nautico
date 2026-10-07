/** Local case records and fallible browser persistence. No network or owner mutation. */
import { LIMITS, plainData, frozen, equal, createCase, makeRevision, sameRevisionContent,
  requestPayload, makeRequest, checkReturn, checkCase, checkCaseStructure, rejectKnownRollback, checkCompanySourceBinding } from './contract.js';

export const STORAGE_KEY = 'kn:company-case:0.1';
const fail = message => { throw new TypeError(message); };
// Branch is the build's discovery locator, not source applicability. Keep every
// other binding dimension and all recorded bytes intact. Known invalidations
// remain causal even after an identical source set is encountered again.
const applicability = binding => { const { branch, ...meaning } = binding; return meaning; };
const sameApplicableSources = (left, right) => equal(applicability(left), applicability(right));
const sameSituatedRevision = (left, right) => sameRevisionContent(
  { ...left, sourceBinding: applicability(left.sourceBinding) },
  { ...right, sourceBinding: applicability(right.sourceBinding) });

export async function createCompanyStore({ getSourceBinding, storage, storageKey = STORAGE_KEY,
  now = () => new Date().toISOString(), id = () => crypto.randomUUID() } = {}) {
  if (typeof getSourceBinding !== 'function') fail('Serve la sorgente corrente del caso.');
  let state = null, cache = storage, lastRead = null, blocked = false;
  let persistence = { state: 'memory_only', message: 'Il caso è locale. Esporta il lavoro per conservarne una copia trasferibile.' };
  const listeners = new Set();
  if (cache === undefined) {
    try { cache = globalThis.localStorage ?? null; }
    catch { cache = null; persistence = { state: 'error', message: 'Memoria del browser non accessibile. Il lavoro resta esportabile.' }; }
  }
  if (cache) {
    try {
      lastRead = cache.getItem(storageKey);
      if (lastRead !== null) {
        try { state = frozen(await checkCase(lastRead)); persistence = { state: 'loaded', message: 'Caso ripreso dalla copia locale. La sorgente viene verificata di nuovo.' }; }
        catch { blocked = true; persistence = { state: 'blocked', message: 'Copia locale sconosciuta o non leggibile: originale preservato senza sovrascriverlo.' }; }
      }
    } catch { blocked = true; persistence = { state: 'error', message: 'Lettura della copia locale non riuscita. Nessuna sovrascrittura automatica.' }; }
  }
  function readBinding() {
    try { return checkCompanySourceBinding(getSourceBinding()); }
    catch { return null; }
  }
  function requireBinding() {
    const binding = readBinding();
    if (!binding) fail('La sorgente di questa copia non è disponibile. La bozza e il lavoro esistente restano da conservare.');
    return binding;
  }
  const currentRevision = () => state?.revisions.at(-1) ?? null;
  const currentRequest = () => state?.requests.filter(request => request.revisionId === currentRevision()?.id).at(-1) ?? null;
  const currentResult = () => state?.returns.find(result => result.requestId === currentRequest()?.id) ?? null;
  function persist() {
    if (!state) return;
    if (blocked) { persistence = { state: 'blocked', message: 'La copia originale del browser è preservata. Esporta questo lavoro o importa una copia valida dopo averla riconciliata.' }; return; }
    if (!cache) { if (persistence.state !== 'error') persistence = { state: 'memory_only', message: 'Lavoro in memoria. Esporta il caso prima di chiudere.' }; return; }
    try {
      if (cache.getItem(storageKey) !== lastRead) {
        blocked = true; persistence = { state: 'blocked', message: 'La copia del browser è cambiata in un’altra sessione. Questo lavoro resta in memoria ed esportabile.' }; return;
      }
      const encoded = JSON.stringify(state);
      cache.setItem(storageKey, encoded);
      if (cache.getItem(storageKey) !== encoded) throw new Error('readback_mismatch');
      lastRead = encoded;
      persistence = { state: 'saved', message: 'Conservato in questo browser. L’esportazione prepara la copia trasferibile.' };
    } catch { persistence = { state: 'error', message: 'Salvataggio nel browser non riuscito. Il caso resta in memoria: esportalo prima di chiudere.' }; }
  }
  function addEvent(next, kind, record, revisionId = record.revisionId ?? record.id) {
    next.events.push({ id: id(), sequence: next.events.length + 1, kind, recordId: record.id,
      revisionId, created_at: now() });
  }
  function install(next) { next.updated_at = now(); state = frozen(checkCaseStructure(next)); persist(); }
  function sourceStatus({ observe = true } = {}) {
    const revision = currentRevision();
    if (!revision) return { state: 'empty', reasons: [] };
    const binding = readBinding();
    if (!binding) return { state: 'unavailable', reasons: ['source_unavailable'] };
    const changed = !sameApplicableSources(revision.sourceBinding, binding);
    let invalidated = state.invalidations.some(item => item.revisionId === revision.id);
    if (changed && !invalidated && observe) {
      if (state.invalidations.length >= LIMITS.invalidations || state.events.length >= LIMITS.events)
        return { state: 'stale', reasons: ['source_binding_changed', 'history_capacity_reached'] };
      const next = plainData(state), invalidation = { id: id(), revisionId: revision.id, created_at: now(),
        reason: 'source_binding_changed', observedBinding: binding };
      next.invalidations.push(invalidation); addEvent(next, 'source_invalidated', invalidation); install(next); invalidated = true;
    }
    return { state: changed || invalidated ? 'stale' : 'current',
      reasons: [...(changed ? ['source_binding_changed'] : []), ...(invalidated ? ['source_was_invalidated'] : [])] };
  }
  function snapshot() {
    const status = sourceStatus();
    return frozen({ case: state ? plainData(state) : null, revision: currentRevision(), request: currentRequest(),
      result: currentResult(), sourceStatus: status, persistence: { ...persistence } });
  }
  function emit() { const value = snapshot(); for (const listener of listeners) listener(value); return value; }
  function capacity(kind) {
    if (state[kind].length >= LIMITS[kind] || state.events.length >= LIMITS.events) fail('Limite locale raggiunto. Esporta il caso; nessuna storia è stata cancellata.');
  }
  function assertCurrent() {
    const status = sourceStatus();
    if (status.state !== 'current') fail(status.state === 'empty' ? 'Conserva prima un caso.' :
      'La sorgente del caso non è più applicabile. Conserva una revisione sulla base corrente; la storia resta disponibile.');
  }
  function capture(input) {
    if (state) fail('Un caso è già aperto. Conserva una revisione per proseguire senza riscrivere l’originale.');
    const next = createCase(input, requireBinding(), { id: id(), revisionId: id(), now: now() });
    addEvent(next, 'case_created', next.revisions[0]); install(next); return emit();
  }
  function revise(input) {
    if (!state) return capture(input);
    const draft = plainData(input, LIMITS.resultBytes);
    if ('originalContribution' in draft && draft.originalContribution !== state.originalContribution.text) fail('Il contributo originale resta immutabile. Aggiungi il chiarimento alle definizioni o alle domande della nuova revisione.');
    sourceStatus(); const current = currentRevision();
    // A no-op remains valid at capacity. Validate its content with the current
    // metadata before allocating a distinct revision number or identity.
    const candidate = makeRevision(draft, requireBinding(), { id: current.id, number: current.number, now: current.created_at });
    if (sameSituatedRevision(current, candidate) && !state.invalidations.some(item => item.revisionId === current.id)) return snapshot();
    capacity('revisions');
    const revision = { ...candidate, id: id(), number: state.revisions.length + 1, created_at: now() };
    const next = plainData(state); next.revisions.push(revision); addEvent(next, 'case_revised', revision); install(next); return emit();
  }
  async function prepareRequest(method) {
    assertCurrent();
    const base = state, revision = currentRevision(), payload = requestPayload(state, revision, method), existing = currentRequest();
    // Export is transport. Re-exporting identical work cannot supersede its pending or returned request.
    if (existing && equal(existing.payload, payload)) return plainData(existing);
    capacity('requests');
    const request = await makeRequest(state, revision, method, { id: id(), now: now() });
    assertCurrent();
    if (state !== base) fail('Il caso è cambiato durante la preparazione. Ripeti dalla revisione visibile.');
    const next = plainData(state); next.requests.push(request); addEvent(next, 'request_prepared', request); install(next); emit();
    return plainData(request);
  }
  async function importReturn(input) {
    assertCurrent(); const base = state, request = currentRequest();
    if (!request) fail('Prepara una richiesta per questa revisione.');
    const result = await checkReturn(request, input);
    assertCurrent();
    if (state !== base) fail('Il caso è cambiato durante la lettura. La restituzione non è stata applicata.');
    const existing = currentResult();
    if (existing) {
      if (equal(existing, result)) return plainData(existing);
      fail('Questa richiesta conserva già una restituzione diversa. Una revisione o una nuova domanda devono precedere un altro risultato.');
    }
    capacity('returns');
    if (state.returns.some(item => item.id === result.id)) fail('Identità della restituzione già presente.');
    const next = plainData(state); next.returns.push(result); addEvent(next, 'return_received', result); install(next); emit();
    return plainData(result);
  }
  function exportState() {
    sourceStatus(); if (!state) fail('Conserva prima un caso da esportare.');
    // The validated size is compact JSON bytes. Export those exact bounded
    // bytes: indentation must not make a valid case impossible to reimport.
    return JSON.stringify(state);
  }
  async function importState(input) {
    sourceStatus(); const base = state, incoming = await checkCase(input);
    if (state !== base) fail('Il caso è cambiato durante la lettura. Ripeti l’importazione dopo averne verificato la storia.');
    rejectKnownRollback(state, incoming);
    // An explicit import cannot erase a concurrently written recognized history either.
    if (cache) {
      let observed;
      try { observed = cache.getItem(storageKey); }
      catch { blocked = true; fail('La copia del browser non è leggibile. Le copie restano conservate.'); }
      if (observed !== lastRead && observed !== null) {
        let other;
        try { other = await checkCase(observed); }
        catch { blocked = true; fail('Un’altra copia del browser non è riconosciuta. Esporta questo caso e conserva entrambe le copie.'); }
        rejectKnownRollback(other, incoming);
      }
      if (state !== base || cache.getItem(storageKey) !== observed) fail('La copia è cambiata durante la verifica. Ripeti dopo aver conservato il lavoro.');
      // Selecting an explicitly imported, fully validated case is the recovery
      // action for an unchanged unknown startup cache; capture/revise never do it.
      lastRead = observed; blocked = false;
    } else blocked = false;
    state = frozen(incoming); sourceStatus(); persist(); return emit();
  }
  return Object.freeze({ capture, revise, prepareRequest, importReturn, exportState, importState, snapshot,
    refresh: emit, subscribe(listener) { if (typeof listener !== 'function') fail('Osservatore non valido.'); listeners.add(listener); return () => listeners.delete(listener); } });
}
