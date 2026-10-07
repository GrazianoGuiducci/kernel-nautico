/** Case projection and selective learning return. Neither function writes an owner.
 * The company store remains the source of case truth; an export is a distinct object.
 */
export const PROJECTION_SCHEMA = 'kn.learning-projection.v0.1';
export const WORK_SCHEMA = 'kn.learning-work.v0.1';
export const SCOPES = Object.freeze(['company_private', 'public_candidate']);
export const KINDS = Object.freeze(['reusable-method', 'owner-interface', 'routing']);
const fail = message => { throw new TypeError(message); };
const text = (value, name, limit = 4000) => {
  if (typeof value !== 'string' || !value.trim() || value.length > limit) fail(`${name}: testo richiesto, massimo ${limit} caratteri.`);
  return value.trim();
};
function plain(value, depth = 0) {
  if (depth > 40) fail('Struttura troppo profonda.');
  if (value === null || ['string', 'boolean'].includes(typeof value)) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (Array.isArray(value)) return value.map(item => plain(item, depth + 1));
  if (!value || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) fail('Sono ammessi solo dati JSON.');
  const out = {};
  for (const key of Object.keys(value).sort()) {
    if (['__proto__', 'prototype', 'constructor'].includes(key)) fail('Chiave non ammessa.');
    out[key] = plain(value[key], depth + 1);
  }
  return out;
}
export const canonical = value => JSON.stringify(plain(value));
export async function digest(value) {
  const bytes = new TextEncoder().encode(canonical(value));
  if (bytes.byteLength > 4000000) fail('Il lavoro supera il limite locale di 4 MB.');
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map(n => n.toString(16).padStart(2, '0')).join('');
}
const clone = value => JSON.parse(JSON.stringify(value));
function keys(object, expected) {
  if (!object || Array.isArray(object) || typeof object !== 'object' ||
      Object.keys(object).sort().join('|') !== [...expected].sort().join('|')) fail('Forma della proiezione non riconosciuta.');
}

/** Read-only view: a stale result is retained as history, never shown as current. */
export function caseView(snapshot) {
  const item = snapshot?.case, revision = snapshot?.revision;
  if (!item || !revision) return { empty: true, title: 'Il tuo caso di lavoro con Kernel Nautico.' };
  const current = snapshot.sourceStatus?.state === 'current';
  const result = current ? snapshot.result : null;
  return {
    empty: false, title: revision.label, caseId: item.id, revisionId: revision.id,
    revisionNumber: revision.number, original: item.originalContribution.text,
    actor: item.originalContribution.actor, sourceState: snapshot.sourceStatus?.state || 'unknown',
    current, requestId: snapshot.request?.id || null,
    definitions: clone(revision.definitions || []), questions: clone(revision.questions || []),
    sourceCount: revision.sourceRefs?.length || 0,
    result: result ? clone(result) : null,
    historicalReturnCount: item.returns?.length || 0,
  };
}
export async function caseFingerprint(snapshot) {
  if (!snapshot?.case || !snapshot?.revision) fail('Apri o conserva prima un caso.');
  return digest({ case: snapshot.case, sourceStatus: snapshot.sourceStatus });
}

/** Explicitly authored content is the ONLY content copied into the candidate.
 * Private origin, source IDs, historical text and case digests stay in localReceipt.
 * The person's review is self-declared, not a privacy classifier or publication grant.
 */
export async function prepareProjection(snapshot, form, { id = () => crypto.randomUUID(), now = () => new Date().toISOString() } = {}) {
  if (!SCOPES.includes(form?.scope)) fail('Scegli la destinazione della proiezione.');
  if (!KINDS.includes(form.kind)) fail('Scegli quale modo di lavorare cambia.');
  if (form.reviewed !== true) fail('Controlla il testo esatto e la sua destinazione prima di preparare il candidato.');
  const sourceDigest = await caseFingerprint(snapshot);
  const candidate = {
    schema: PROJECTION_SCHEMA, id: id(), createdAt: now(),
    scope: form.scope, kind: form.kind, owner: text(form.owner, 'Destinatario', 240),
    title: text(form.title, 'Titolo', 160), method: text(form.method, 'Metodo'),
    reason: text(form.reason, 'Ragione', 1600), nextUse: text(form.nextUse, 'Prossimo uso', 1600),
    limits: text(form.limits, 'Condizioni e limiti', 1600),
    review: 'author_declared_for_this_content_not_independent',
    applicationState: 'proposed_not_applied', publicationAuthority: 'not_granted_by_this_file',
  };
  const localReceipt = {
    schema: 'kn.learning-local-receipt.v0.1', privacy: 'private_do_not_publish',
    projectionId: candidate.id, projectionDigest: await digest(candidate),
    origin: { caseId: snapshot.case.id, revisionId: snapshot.revision.id,
      requestId: snapshot.request?.id || null, returnId: snapshot.result?.id || null,
      caseDigest: sourceDigest, sourceState: snapshot.sourceStatus?.state || 'unknown' },
    attribution: 'local_operator_unverified',
  };
  // Preserve the same transfer key order before and after validated reentry.
  return plain({ schema: WORK_SCHEMA, candidate, localReceipt });
}

export async function validateProjectionWork(snapshot, input) {
  let work;
  try {
    if (typeof input === 'string' && new TextEncoder().encode(input).byteLength > 80000) fail('Bozza troppo grande.');
    work = plain(typeof input === 'string' ? JSON.parse(input) : input);
  } catch { fail('Bozza locale non leggibile o non riconosciuta. Nessun caso è stato modificato.'); }
  keys(work, ['schema', 'candidate', 'localReceipt']);
  if (work.schema !== WORK_SCHEMA) fail('Versione della bozza non riconosciuta.');
  const c = work.candidate, r = work.localReceipt;
  keys(c, ['schema', 'id', 'createdAt', 'scope', 'kind', 'owner', 'title', 'method', 'reason', 'nextUse', 'limits', 'review', 'applicationState', 'publicationAuthority']);
  keys(r, ['schema', 'privacy', 'projectionId', 'projectionDigest', 'origin', 'attribution']);
  keys(r.origin, ['caseId', 'revisionId', 'requestId', 'returnId', 'caseDigest', 'sourceState']);
  if (c.schema !== PROJECTION_SCHEMA || !SCOPES.includes(c.scope) || !KINDS.includes(c.kind) ||
      c.applicationState !== 'proposed_not_applied' || c.publicationAuthority !== 'not_granted_by_this_file' ||
      c.review !== 'author_declared_for_this_content_not_independent' ||
      r.schema !== 'kn.learning-local-receipt.v0.1' || r.privacy !== 'private_do_not_publish' ||
      r.attribution !== 'local_operator_unverified') fail('Stato o autorità della bozza non riconosciuti.');
  text(c.id, 'Identità', 200); text(c.createdAt, 'Data', 80);
  if (!Number.isFinite(Date.parse(c.createdAt))) fail('Data non riconosciuta.');
  for (const [key, max] of Object.entries({ owner: 240, title: 160, method: 4000, reason: 1600, nextUse: 1600, limits: 1600 })) {
    if (text(c[key], key, max) !== c[key]) fail('Testo del candidato modificato.');
  }
  if (r.projectionId !== c.id || r.projectionDigest !== await digest(c)) fail('Il candidato non corrisponde alla ricevuta locale.');
  if (r.origin.caseDigest !== await caseFingerprint(snapshot) || r.origin.caseId !== snapshot.case.id ||
      r.origin.revisionId !== snapshot.revision.id || r.origin.requestId !== (snapshot.request?.id || null) ||
      r.origin.returnId !== (snapshot.result?.id || null) || r.origin.sourceState !== snapshot.sourceStatus?.state)
    fail('Il caso è diverso o è cambiato. Conserva la bozza come storia e prepara una nuova proiezione dalla situazione corrente.');
  return clone(work);
}
