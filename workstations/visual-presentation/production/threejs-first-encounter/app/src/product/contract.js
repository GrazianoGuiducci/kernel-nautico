/** Source-bound, plain-data local product contract. No transport or authoritative mutation. */
import { createCapture } from '../../../../design-capture/capture.mjs';
import { ANCHOR_ID, PROJECT_ID, resolveField, targetFor } from '../focus/field.js';

export const SCHEMAS = Object.freeze({ binding: 'kn.source-binding.v0.1',
  contribution: 'kn.product-contribution.v0.1', context: 'kn.product-context.v0.1',
  request: 'kn.product-request.v0.1', variant: 'kn.product-variant.v0.1',
  decision: 'kn.product-decision.v0.1', state: 'kn.product-state.v0.1' });
export const VIEW_ID = 'kn:view:stern-plan:v1';
export const LIMITS = Object.freeze({ fileBytes: 2 * 1024 * 1024, resultBytes: 128 * 1024,
  records: 32, strokes: 16, points: 1024, primitives: 32, quarantine: 8 });
const fail = message => { throw new TypeError(message); };
const object = (x, name) => {
  if (!x || typeof x !== 'object' || Array.isArray(x)) fail(`${name}: oggetto dati richiesto.`);
};
const text = (x, name, max = 4000, empty = false) => {
  if (typeof x !== 'string' || x.length > max || (!empty && !x.trim())) fail(`${name}: testo non valido.`);
};
const keys = (x, allowed, name) => {
  object(x, name);
  if (Object.keys(x).some(k => !allowed.includes(k))) fail(`${name}: campi non riconosciuti; nessuna azione importata.`);
};
const list = (x, name, max, min = 0) => {
  if (!Array.isArray(x) || x.length > max || x.length < min) fail(`${name}: quantità non valida.`);
};
const date = (x, name) => {
  text(x, name, 40);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(x) || !Number.isFinite(Date.parse(x))) fail(`${name}: data non valida.`);
};
const identity = (x, name) => {
  text(x, name, 160);
  if (!/^[a-zA-Z0-9:_-]+$/.test(x)) fail(`${name}: identità non valida.`);
};
const hash = (x, n, name) => { if (typeof x !== 'string' || !new RegExp(`^[a-f0-9]{${n}}$`).test(x)) fail(`${name}: digest non valido.`); };
const point = p => {
  if (!Array.isArray(p) || p.length !== 2 || !p.every(n => Number.isFinite(n) && n >= 0 && n <= 1)) fail('Coordinate fuori dalla vista originale.');
};
const unit = n => { if (!Number.isFinite(n) || n < 0 || n > 1) fail('Dimensione fuori dalla vista originale.'); };
const safePath = p => {
  text(p, 'Percorso', 400);
  if (/[\\\s?#:]/.test(p) || p.split('/').some(s => !s || s === '.' || s === '..')) fail('Percorso sorgente non valido.');
};
const encode = value => new TextEncoder().encode(value).byteLength;

/** Reject executable objects/prototypes before JSON serialization can invoke them. */
export function plainData(input, maxBytes = LIMITS.fileBytes) {
  let value = input;
  if (typeof input === 'string') {
    if (encode(input) > maxBytes) fail('File troppo grande: conservare il file originale.');
    try { value = JSON.parse(input); } catch { fail('JSON non leggibile: il lavoro corrente è preservato.'); }
  }
  const seen = new Set(); let count = 0;
  function visit(v, depth) {
    if (++count > 50000 || depth > 32) fail('Struttura dati troppo complessa.');
    if (v === null || typeof v === 'string' || typeof v === 'boolean') return v;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (!v || typeof v !== 'object' || seen.has(v)) fail('Sono ammessi soltanto dati JSON finiti.');
    if (!Array.isArray(v) && ![Object.prototype, null].includes(Object.getPrototypeOf(v))) fail('Oggetto eseguibile o prototipo non ammesso.');
    seen.add(v);
    let out;
    if (Array.isArray(v)) {
      if (Object.getPrototypeOf(v) !== Array.prototype) fail('Prototipo array non ammesso.');
      const descriptors = Object.getOwnPropertyDescriptors(v);
      if (Object.keys(descriptors).some(k => k !== 'length' && !/^(0|[1-9]\d*)$/.test(k))) fail('Campo array non ammesso.');
      out = [];
      for (let i = 0; i < v.length; i++) {
        const d = descriptors[i];
        if (!d || d.get || d.set || !d.enumerable) fail('Accessore o elemento array non ammesso.');
        out.push(visit(d.value, depth + 1));
      }
    }
    else {
      out = {};
      for (const [k, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(v))) {
        if (['__proto__', 'prototype', 'constructor'].includes(k) || descriptor.get || descriptor.set) fail('Campo o accessore non ammesso.');
        if (!descriptor.enumerable) fail('Dati nascosti non ammessi.');
        out[k] = visit(descriptor.value, depth + 1);
      }
    }
    seen.delete(v); return out;
  }
  const result = visit(value, 0);
  if (encode(JSON.stringify(result)) > maxBytes) fail('Record troppo grande: il lavoro corrente è preservato.');
  return result;
}
export const canonical = value => JSON.stringify(value, (_k, v) => v && !Array.isArray(v) && typeof v === 'object'
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
export const equal = (a, b) => canonical(a) === canonical(b);
export function frozen(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}

export function checkSourceBinding(input) {
  const b = plainData(input, 48000);
  keys(b, ['schema','repository','branch','revision','sourceId','sourceRevision','viewId','assetPath','sources','contextDigest','observation','freshness','availability'], 'SourceBinding');
  if (b.schema !== SCHEMAS.binding || b.repository !== 'GrazianoGuiducci/kernel-nautico' ||
      b.sourceId !== 'kn:source:stern-plan:v1' || b.viewId !== VIEW_ID ||
      b.assetPath !== 'product/stern-plan.svg' || b.observation !== 'local_build_snapshot' ||
      b.freshness !== 'pinned_not_continuous_remote' || b.availability !== 'available') fail('Sorgente non disponibile o formato non riconosciuto.');
  text(b.branch, 'Branch', 200); hash(b.revision, 40, 'Revisione'); hash(b.sourceRevision, 64, 'Asset'); hash(b.contextDigest, 64, 'Contesto');
  list(b.sources, 'Fonti verificate dal build', 20, 1); const paths = new Set();
  for (const s of b.sources) {
    keys(s, ['path','blob','sha256','revision','scope'], 'Fonte');
    safePath(s.path); hash(s.blob, 40, 'Blob'); hash(s.sha256, 64, 'SHA-256'); hash(s.revision, 40, 'Revisione sorgente');
    if (s.scope !== 'owner_source_snapshot' || s.revision !== b.revision || paths.has(s.path)) fail('Identità delle fonti incoerente.');
    paths.add(s.path);
  }
  if (!b.sources.some(s => s.path.endsWith('/app/public/product/stern-plan.svg') && s.sha256 === b.sourceRevision)) fail('La vista non ha una sorgente verificata nel manifest.');
  return b;
}

export function currentContext(snapshot) {
  const s = plainData(snapshot, 48000);
  if (!Number.isSafeInteger(s?.revision) || s.revision < 0) fail('Focus corrente non disponibile.');
  const f = s.field;
  const resolved = resolveField(f?.address, { act: f?.state?.presentation_act,
    fallback: f?.state?.geometry === 'schematic_alternative' });
  if (!equal(f, resolved)) fail('Il focus non coincide con il resolver corrente.');
  return { schema: SCHEMAS.context, field: plainData(resolved) };
}
function checkContext(input, semanticId = ANCHOR_ID) {
  keys(input, ['schema','field'], 'Contesto');
  if (input.schema !== SCHEMAS.context || input.field?.address?.semantic_id !== semanticId) fail('Contesto riferito a un altro oggetto.');
  const resolved = currentContext({ field: input.field, revision: 0 });
  if (!equal(input, resolved)) fail('Contesto non riconosciuto.');
}
function checkView(view) {
  keys(view, ['id','width','height','coordinateSpace'], 'Vista');
  if (view.id !== VIEW_ID || view.width !== 640 || view.height !== 360 || view.coordinateSpace !== 'normalized-captured-view') fail('La cattura richiede la vista originale 640 × 360.');
}
function captureRecord(c) {
  return createCapture({ id: c.id, source: { id: c.sourceBinding.sourceId, revision: c.sourceBinding.sourceRevision },
    view: { id: c.view.id, width: c.view.width, height: c.view.height },
    contributions: [{ id: `${c.id}:note`, kind: 'text', text: c.note }, ...c.strokes.map((points, i) => ({
      id: `${c.id}:stroke:${i}`, kind: 'sketch', coordinateSpace: 'normalized-captured-view', points }))] });
}
export function checkContribution(input) {
  const c = plainData(input, LIMITS.resultBytes);
  keys(c, ['schema','id','created_at','semantic_id','address','sourceBinding','context','view','note','strokes','capture'], 'Contributo');
  if (c.schema !== SCHEMAS.contribution || c.semantic_id !== ANCHOR_ID) fail('Contributo non riconosciuto.');
  identity(c.id, 'Contributo'); date(c.created_at, 'Data contributo'); text(c.note, 'Nota', 4000, true);
  checkSourceBinding(c.sourceBinding); checkContext(c.context); checkView(c.view);
  if (!equal(c.address, c.context.field.address) || c.address.project_id !== PROJECT_ID) fail('Indirizzo del contributo incoerente.');
  list(c.strokes, 'Tratti', LIMITS.strokes); let total = 0;
  for (const stroke of c.strokes) { list(stroke, 'Punti', 256, 2); total += stroke.length; stroke.forEach(point); }
  if (total > LIMITS.points || (!c.note.trim() && !c.strokes.length)) fail('Serve una nota o un tratto entro i limiti di cattura.');
  if (!equal(c.capture, captureRecord(c))) fail('Il contributo originale è stato modificato o non corrisponde alla cattura.');
  return c;
}
export function makeContribution(snapshot, binding, input, { id = crypto.randomUUID(), now = new Date().toISOString() } = {}) {
  const data = plainData(input, LIMITS.resultBytes);
  keys(data, ['note','strokes','view'], 'Cattura');
  const context = currentContext(snapshot);
  if (context.field.address.semantic_id !== ANCHOR_ID) fail('Seleziona l’accesso a poppa prima di conservare il contributo.');
  const c = { schema: SCHEMAS.contribution, id, created_at: now, semantic_id: ANCHOR_ID,
    address: context.field.address, sourceBinding: checkSourceBinding(binding), context,
    view: data.view, note: data.note ?? '', strokes: data.strokes ?? [] };
  // Validate coordinates before invoking the open predecessor capture shape.
  c.capture = captureRecord(c); return checkContribution(c);
}

export function assessApplicability(contribution, snapshot, binding) {
  if (!contribution) return { state: 'empty', reasons: [] };
  let b, context;
  try { b = checkSourceBinding(binding); } catch { return { state: 'unavailable', reasons: ['source_unavailable_or_unrecognized'] }; }
  try { context = currentContext(snapshot); } catch { return { state: 'unavailable', reasons: ['current_context_unavailable'] }; }
  const reasons = [];
  if (!equal(contribution.sourceBinding, b)) reasons.push('source_binding_changed');
  if (context.field.address.semantic_id !== contribution.semantic_id) reasons.push('focus_target_changed');
  else if (!equal(contribution.context, context)) reasons.push('context_changed');
  if (contribution.view.id !== b.viewId) reasons.push('original_view_changed');
  return { state: reasons.length ? 'stale' : 'current', reasons };
}
export function makeProductRequest(contribution, instruction, { id = crypto.randomUUID(), now = new Date().toISOString() } = {}) {
  const c = checkContribution(contribution); text(instruction, 'Richiesta', 2000);
  return checkProductRequest({ schema: SCHEMAS.request, id, created_at: now, instruction: instruction.trim(),
    contribution_id: c.id, semantic_id: c.semantic_id, sourceBinding: c.sourceBinding, context: c.context,
    original: c, transport: 'manual_file_handoff_not_live_api', effect_ceiling: 'project_local_proposal_only' });
}
export function checkProductRequest(input) {
  const r = plainData(input, LIMITS.resultBytes);
  keys(r, ['schema','id','created_at','instruction','contribution_id','semantic_id','sourceBinding','context','original','transport','effect_ceiling'], 'Richiesta');
  if (r.schema !== SCHEMAS.request || r.transport !== 'manual_file_handoff_not_live_api' || r.effect_ceiling !== 'project_local_proposal_only') fail('Richiesta o autorità non riconosciuta.');
  identity(r.id, 'Richiesta'); date(r.created_at, 'Data richiesta'); text(r.instruction, 'Istruzione', 2000);
  const c = checkContribution(r.original);
  if (r.contribution_id !== c.id || r.semantic_id !== c.semantic_id || !equal(r.sourceBinding, c.sourceBinding) || !equal(r.context, c.context)) fail('Richiesta scollegata dal contributo originale.');
  return r;
}
function checkPreview(p, viewId) {
  keys(p, ['viewId','coordinateSpace','primitives'], 'Anteprima');
  if (p.viewId !== viewId || p.coordinateSpace !== 'normalized-captured-view') fail('La variante usa una vista diversa dall’originale.');
  list(p.primitives, 'Elementi della proposta', LIMITS.primitives, 1);
  for (const v of p.primitives) {
    object(v, 'Elemento');
    if (!['proposal','attention'].includes(v.tone)) fail('Colore della proposta non riconosciuto.');
    if (v.kind === 'polyline') {
      keys(v, ['kind','points','tone'], 'Tratto variante'); list(v.points, 'Punti variante', 128, 2); v.points.forEach(point);
    } else if (v.kind === 'circle') {
      keys(v, ['kind','cx','cy','r','tone'], 'Cerchio variante'); unit(v.cx); unit(v.cy); unit(v.r);
      if (v.r <= 0 || v.r > .5 || v.cx - v.r < 0 || v.cy - v.r < 0 || v.cx + v.r > 1 || v.cy + v.r > 1) fail('Cerchio fuori dalla vista.');
    } else if (v.kind === 'label') {
      keys(v, ['kind','x','y','text','tone'], 'Nota variante'); unit(v.x); unit(v.y); text(v.text, 'Etichetta variante', 120);
    } else fail('La variante contiene codice, SVG o un elemento non consentito.');
  }
}
export function checkVariant(requestInput, resultInput) {
  const r = checkProductRequest(requestInput), v = plainData(resultInput, LIMITS.resultBytes);
  keys(v, ['schema','id','request_id','contribution_id','semantic_id','sourceBinding','context','receiver','created_at','summary','unknowns','sources','preview','focus_target','focus_reason','effect_class'], 'Variante');
  if (v.schema !== SCHEMAS.variant || v.effect_class !== 'proposal_only') fail('Versione o effetto della variante non riconosciuto.');
  identity(v.id, 'Variante'); date(v.created_at, 'Data variante'); text(v.receiver, 'Ricevente dichiarato', 200); text(v.summary, 'Descrizione variante', 4000);
  if (v.request_id !== r.id || v.contribution_id !== r.contribution_id || v.semantic_id !== r.semantic_id ||
      !equal(v.sourceBinding, r.sourceBinding) || !equal(v.context, r.context)) fail('Variante riferita a un’altra richiesta, sorgente o contesto.');
  list(v.unknowns, 'Incertezze', 16, 1); v.unknowns.forEach(x => text(x, 'Incertezza', 1000));
  list(v.sources, 'Fonti lette dichiarate', 20, 1); const paths = new Set();
  for (const s of v.sources) {
    keys(s, ['path','blob','sha256','revision','read_state','used_for','observed_at'], 'Lettura dichiarata');
    const exact = r.sourceBinding.sources.find(x => x.path === s.path);
    if (!exact || ['blob','sha256','revision'].some(k => s[k] !== exact[k]) || paths.has(s.path) || s.read_state !== 'read_by_receiver') fail('La lettura dichiarata non coincide con una sorgente del pacchetto.');
    text(s.used_for, 'Uso della fonte', 1200); date(s.observed_at, 'Data lettura'); paths.add(s.path);
  }
  checkPreview(v.preview, r.original.view.id);
  if (v.focus_target !== null) {
    targetFor(v.focus_target); text(v.focus_reason, 'Ragione del collegamento', 1000);
  } else if (v.focus_reason !== null) fail('Ragione di navigazione senza bersaglio.');
  return v;
}
export function checkDecision(input) {
  const d = plainData(input, 16000);
  keys(d, ['schema','id','variant_id','disposition','reason','created_at','actor','scope'], 'Decisione');
  if (d.schema !== SCHEMAS.decision || !['accept','reject','defer','rework'].includes(d.disposition) ||
      d.actor !== 'local_operator_unverified' || d.scope !== 'project_local_only') fail('Decisione o autorità non riconosciuta.');
  identity(d.id, 'Decisione'); identity(d.variant_id, 'Variante'); text(d.reason, 'Ragione della decisione', 2000); date(d.created_at, 'Data decisione');
  return d;
}
export function emptyProject({ now = new Date().toISOString() } = {}) {
  return { schema: SCHEMAS.state, project_id: PROJECT_ID, created_at: now, updated_at: now,
    contributions: [], requests: [], variants: [], decisions: [], receipts: [], quarantine: [], invalidations: [],
    selection: { contributionId: null, requestId: null, variantId: null, decisionId: null, activeVariantId: null } };
}
const unique = (records, name) => {
  const ids = new Set(); for (const r of records) { if (ids.has(r.id)) fail(`${name}: identità duplicata.`); ids.add(r.id); }
};
export function checkProjectState(input) {
  const s = plainData(input);
  keys(s, ['schema','project_id','created_at','updated_at','contributions','requests','variants','decisions','receipts','quarantine','invalidations','selection'], 'Stato progetto');
  if (s.schema !== SCHEMAS.state || s.project_id !== PROJECT_ID) fail('Stato futuro, sconosciuto o appartenente a un altro progetto; originale preservato.');
  date(s.created_at, 'Creazione progetto'); date(s.updated_at, 'Aggiornamento progetto');
  for (const k of ['contributions','requests','variants','decisions']) { list(s[k], k, LIMITS.records); unique(s[k], k); }
  s.contributions.forEach(checkContribution);
  for (const r of s.requests) {
    checkProductRequest(r); const c = s.contributions.find(x => x.id === r.contribution_id);
    if (!c || !equal(c, r.original)) fail('Richiesta senza il suo originale intatto.');
  }
  for (const v of s.variants) {
    const r = s.requests.find(x => x.id === v.request_id);
    if (!r) fail('Variante senza richiesta.'); checkVariant(r, v);
  }
  for (const d of s.decisions) { checkDecision(d); if (!s.variants.some(v => v.id === d.variant_id)) fail('Decisione senza variante.'); }
  list(s.receipts, 'Ricevute', 256); unique(s.receipts, 'Ricevute');
  for (const e of s.receipts) {
    keys(e, ['id','created_at','kind','record_id','scope','external_mutation'], 'Ricevuta');
    identity(e.id, 'Ricevuta'); identity(e.record_id, 'Oggetto ricevuta'); date(e.created_at, 'Data ricevuta');
    if (!['capture','request_prepared','variant_received','decision_recorded','state_imported'].includes(e.kind) || e.scope !== 'project_local_only' || e.external_mutation !== false) fail('Ricevuta con effetto non consentito.');
    const records = { capture: s.contributions, request_prepared: s.requests,
      variant_received: s.variants, decision_recorded: s.decisions }[e.kind];
    if (records && !records.some(record => record.id === e.record_id)) fail('Ricevuta senza l’oggetto dell’effetto dichiarato.');
  }
  list(s.quarantine, 'Quarantena', LIMITS.quarantine);
  for (const q of s.quarantine) {
    keys(q, ['id','created_at','reason','raw'], 'Quarantena'); identity(q.id, 'Quarantena'); date(q.created_at, 'Data quarantena');
    text(q.reason, 'Errore importazione', 1200); text(q.raw, 'Originale in quarantena', LIMITS.resultBytes, true);
  }
  list(s.invalidations, 'Invalidazioni sorgente', LIMITS.records); unique(s.invalidations, 'Invalidazioni');
  for (const i of s.invalidations) {
    keys(i, ['id','contribution_id','created_at','reason','observed_revision','observed_context_digest'], 'Invalidazione');
    identity(i.id, 'Invalidazione'); date(i.created_at, 'Data invalidazione');
    hash(i.observed_revision, 40, 'Revisione osservata'); hash(i.observed_context_digest, 64, 'Digest osservato');
    if (i.reason !== 'source_binding_changed' || !s.contributions.some(c => c.id === i.contribution_id)) fail('Invalidazione priva della sua sorgente.');
  }
  keys(s.selection, ['contributionId','requestId','variantId','decisionId','activeVariantId'], 'Selezione');
  for (const [pointer, listName] of Object.entries({ contributionId:'contributions', requestId:'requests', variantId:'variants', decisionId:'decisions', activeVariantId:'variants' })) {
    if (s.selection[pointer] !== null && !s[listName].some(r => r.id === s.selection[pointer])) fail('Puntatore di rientro non valido.');
  }
  const c = s.contributions.find(x => x.id === s.selection.contributionId);
  const r = s.requests.find(x => x.id === s.selection.requestId);
  const v = s.variants.find(x => x.id === s.selection.variantId);
  const d = s.decisions.find(x => x.id === s.selection.decisionId);
  if ((r && (!c || r.contribution_id !== c.id)) || (v && (!r || v.request_id !== r.id)) || (d && (!v || d.variant_id !== v.id))) fail('La selezione non conserva la relazione originale → richiesta → variante → decisione.');
  if ((c && c !== s.contributions.at(-1)) || (r && r !== s.requests.filter(x => x.contribution_id === c.id).at(-1)) ||
      (v && v !== s.variants.filter(x => x.request_id === r.id).at(-1)) || (d && d !== s.decisions.filter(x => x.variant_id === v.id).at(-1))) fail('Una selezione superata non può tornare attiva dall’archivio.');
  if (s.selection.activeVariantId !== null && (!v || s.selection.activeVariantId !== v.id || !d || d.disposition !== 'accept')) fail('Variante attiva senza decisione locale esplicita.');
  return s;
}
