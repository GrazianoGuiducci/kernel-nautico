/** Local project state owns records; browser storage is a fallible cache/transport. */
import { SCHEMAS, LIMITS, plainData, frozen, equal, checkSourceBinding, makeContribution,
  assessApplicability, makeProductRequest, checkVariant, checkDecision, emptyProject,
  checkProjectState } from './contract.js';

export const STORAGE_KEY = 'kn:integrated-product:0.1';
const fail = message => { throw new TypeError(message); };
export function createProductStore({ getFocus, selectFocus, getSourceBinding, storage,
  storageKey = STORAGE_KEY, now = () => new Date().toISOString(), id = () => crypto.randomUUID() } = {}) {
  if (typeof getFocus !== 'function' || typeof getSourceBinding !== 'function') fail('Servono focus corrente e sorgente verificata.');
  let state = frozen(emptyProject({ now: now() }));
  let cache = storage, lastRead = null, blocked = false;
  let persistence = { state: 'memory_only', message: 'Stato in memoria. Esporta il progetto per conservarne una copia.' };
  const listeners = new Set();
  if (cache === undefined) {
    try { cache = globalThis.localStorage ?? null; }
    catch { cache = null; persistence = { state: 'error', message: 'Memoria del browser non accessibile. Esporta il progetto.' }; }
  }
  const current = key => state[key].find(x => x.id === state.selection[{
    contributions: 'contributionId', requests: 'requestId', variants: 'variantId', decisions: 'decisionId' }[key]]) ?? null;
  const observations = () => {
    let focus = null, binding = null;
    try { focus = getFocus(); } catch { /* Missing current observation remains unavailable. */ }
    try { binding = getSourceBinding(); } catch { /* No stale-source fallback. */ }
    return { focus, binding };
  };
  function persist() {
    if (blocked) {
      persistence = { state: 'blocked', message: 'Il salvataggio originale non è stato riconosciuto: non verrà sovrascritto. Esporta il lavoro corrente o importa esplicitamente un progetto valido.' };
      return;
    }
    if (!cache) {
      if (persistence.state !== 'error') persistence = { state: 'memory_only', message: 'Lavoro in memoria. Esporta il progetto per conservarlo.' };
      return;
    }
    const encoded = JSON.stringify(state);
    try {
      const currentStored = cache.getItem(storageKey);
      if (currentStored !== lastRead) {
        blocked = true;
        persistence = { state: 'blocked', message: 'La copia del browser è cambiata in un’altra sessione. Lavoro corrente preservato in memoria; esporta e riconcilia le due copie.' };
        return;
      }
      cache.setItem(storageKey, encoded);
      if (cache.getItem(storageKey) !== encoded) throw new Error('readback_mismatch');
      lastRead = encoded;
      persistence = { state: 'saved', message: 'Conservato in questo browser. Il file esportato è la copia trasferibile.' };
    } catch {
      persistence = { state: 'error', message: 'Salvataggio nel browser non riuscito. Il lavoro resta in memoria: esportalo prima di chiudere.' };
    }
  }
  function rawQuarantine(input) {
    let raw;
    try { raw = typeof input === 'string' ? input : JSON.stringify(plainData(input)); }
    catch { raw = '[Dati non JSON; oggetto non eseguito.]'; }
    if (raw.length > LIMITS.resultBytes) raw = raw.slice(0, LIMITS.resultBytes - 120) + '\n[Anteprima limitata. L’originale resta nel file o nel salvataggio sorgente.]';
    return raw;
  }
  function quarantine(input, error, save = true) {
    const next = plainData(state);
    if (next.quarantine.length < LIMITS.quarantine) {
      next.quarantine.push({ id: id(), created_at: now(), reason: String(error?.message ?? error).slice(0, 1200), raw: rawQuarantine(input) });
      next.updated_at = now(); state = frozen(checkProjectState(next));
    }
    if (save) persist();
  }
  if (cache) {
    try {
      lastRead = cache.getItem(storageKey);
      if (lastRead !== null) {
        try {
          state = frozen(checkProjectState(lastRead));
          persistence = { state: 'loaded', message: 'Progetto ripreso dalla copia locale. Sorgenti e contesto vengono risolti nuovamente.' };
        } catch (error) {
          blocked = true; quarantine(lastRead, error, false);
          persistence = { state: 'blocked', message: 'Copia locale sconosciuta o non leggibile: originale preservato senza sovrascriverlo. Puoi esportare il lavoro corrente.' };
        }
      }
    } catch {
      blocked = true;
      persistence = { state: 'error', message: 'Lettura del salvataggio non riuscita: nessuna sovrascrittura automatica. Esporta il lavoro corrente.' };
    }
  }
  function bindingStatus({ recordObservation = true } = {}) {
    const c = current('contributions'), { focus, binding } = observations();
    const status = assessApplicability(c, focus, binding);
    if (c && status.reasons.includes('source_binding_changed') && recordObservation &&
        !state.invalidations.some(i => i.contribution_id === c.id)) {
      const observed = checkSourceBinding(binding), next = plainData(state);
      next.invalidations.push({ id: id(), contribution_id: c.id, created_at: now(), reason: 'source_binding_changed',
        observed_revision: observed.revision, observed_context_digest: observed.contextDigest });
      next.updated_at = now(); state = frozen(checkProjectState(next)); persist();
    }
    if (c && state.invalidations.some(i => i.contribution_id === c.id)) {
      status.state = 'stale';
      if (!status.reasons.includes('source_was_invalidated')) status.reasons.push('source_was_invalidated');
    }
    return status;
  }
  function snapshot() {
    const status = bindingStatus();
    const copy = plainData(state);
    return frozen({ ...copy, contribution: current('contributions'), request: current('requests'),
      variant: current('variants'), decision: current('decisions'), bindingStatus: status,
      activeVariantId: status.state === 'current' ? state.selection.activeVariantId : null,
      persistence: { ...persistence }, transport: 'manual_file_handoff_not_live_api' });
  }
  const emit = () => { const value = snapshot(); for (const fn of listeners) fn(value); };
  const assertCurrent = () => {
    const status = bindingStatus();
    if (status.state !== 'current') fail(status.state === 'empty' ? 'Conserva prima un contributo originale.' :
      `Originale non applicabile al presente (${status.reasons.join(', ')}). La storia è preservata.`);
  };
  function receipt(next, kind, recordId) {
    next.receipts.push({ id: id(), created_at: now(), kind, record_id: recordId,
      scope: 'project_local_only', external_mutation: false });
  }
  function install(next) {
    next.updated_at = now(); state = frozen(checkProjectState(next)); persist(); emit();
  }
  function capacity(name) {
    if (state[name].length >= LIMITS.records || state.receipts.length >= 256) fail('Questo esercizio ha raggiunto il limite di record. Esporta il progetto; nessuna storia è stata cancellata.');
  }
  function capture(input) {
    capacity('contributions'); const { focus, binding } = observations();
    const contribution = makeContribution(focus, binding, input, { id: id(), now: now() });
    const next = plainData(state); next.contributions.push(contribution);
    next.selection = { contributionId: contribution.id, requestId: null, variantId: null, decisionId: null, activeVariantId: null };
    receipt(next, 'capture', contribution.id); install(next); return plainData(contribution);
  }
  function prepareRequest(instruction) {
    assertCurrent(); capacity('requests');
    const request = makeProductRequest(current('contributions'), instruction, { id: id(), now: now() });
    const next = plainData(state); next.requests.push(request);
    next.selection = { ...next.selection, requestId: request.id, variantId: null, decisionId: null, activeVariantId: null };
    receipt(next, 'request_prepared', request.id); install(next); return plainData(request);
  }
  function importResult(input) {
    try {
      assertCurrent(); capacity('variants'); const request = current('requests');
      if (!request) fail('Prepara una richiesta per questo contributo.');
      if (current('variants')) fail('Questa richiesta ha già un risultato. Prepara una nuova richiesta per un’altra variante.');
      const variant = checkVariant(request, input);
      if (state.variants.some(v => v.id === variant.id)) fail('Identità variante già ricevuta.');
      const next = plainData(state); next.variants.push(variant);
      next.selection = { ...next.selection, variantId: variant.id, decisionId: null, activeVariantId: null };
      receipt(next, 'variant_received', variant.id); install(next); return plainData(variant);
    } catch (error) { quarantine(input, error); emit(); throw error; }
  }
  function decide(dispositionOrObject, reason) {
    const input = typeof dispositionOrObject === 'string' ? { disposition: dispositionOrObject, reason } : plainData(dispositionOrObject);
    if (!input || Object.keys(input).some(k => !['disposition','reason'].includes(k))) fail('Decisione non riconosciuta.');
    assertCurrent(); capacity('decisions'); const variant = current('variants');
    if (!variant) fail('Importa prima una variante collegata alla richiesta.');
    const decision = checkDecision({ schema: SCHEMAS.decision, id: id(), variant_id: variant.id,
      disposition: input.disposition, reason: input.reason, created_at: now(), actor: 'local_operator_unverified', scope: 'project_local_only' });
    const next = plainData(state); next.decisions.push(decision);
    next.selection.decisionId = decision.id;
    next.selection.activeVariantId = decision.disposition === 'accept' ? variant.id : null;
    receipt(next, 'decision_recorded', decision.id); install(next); return plainData(decision);
  }
  function exportState() { bindingStatus(); return JSON.stringify(state, null, 2); }
  function rejectKnownRollback(next) {
    // An archive is a transport, not authority to erase already observed causal
    // facts. Compare only related project history; import/cache receipts are not
    // source or decision events and need not make an equivalent archive stale.
    const shared = state.contributions.some(c => next.contributions.some(n => n.id === c.id));
    if (!shared) return;
    for (const kind of ['contributions','requests','variants','decisions','invalidations']) {
      for (let index = 0; index < state[kind].length; index++) {
        // Order carries supersession/disposition causality. The known sequence
        // must remain an unchanged prefix, not merely an equal set of records.
        const known = state[kind][index], incoming = next[kind][index];
        if (!incoming || !equal(known, incoming)) fail('L’archivio è in conflitto con la storia già osservata: mancano, cambiano o vengono riordinati originali, richieste, decisioni o invalidazioni. Copie preservate; riconcilia prima di importare.');
      }
    }
  }
  function importState(input) {
    let next;
    try { bindingStatus(); next = checkProjectState(input); rejectKnownRollback(next); }
    catch (error) { quarantine(input, error); emit(); throw error; }
    if (next.receipts.length >= 256) fail('Archivio completo: conservarlo senza aggiungere una ricevuta.');
    // Explicit recognized-state import selects a replacement. A failed load never does.
    if (cache) {
      try { lastRead = cache.getItem(storageKey); blocked = false; }
      catch { blocked = true; }
    } else blocked = false;
    const importId = id(); receipt(next, 'state_imported', importId);
    install(next); return snapshot();
  }
  function showTarget() {
    assertCurrent(); const v = current('variants');
    if (!v?.focus_target || typeof selectFocus !== 'function') fail('Nessun collegamento di focus disponibile.');
    selectFocus(v.focus_target); emit(); return v.focus_target;
  }
  const api = { capture, prepareRequest, importResult, decide, exportState, importState, snapshot,
    showTarget, refresh() { emit(); return snapshot(); },
    subscribe(fn) { if (typeof fn !== 'function') fail('Osservatore non valido.'); listeners.add(fn); return () => listeners.delete(fn); },
    // Names accepted by alternate receiver adapters; same underlying transformation.
    contribute: capture, importVariant: importResult };
  return Object.freeze(api);
}
export const createProductController = createProductStore;
