/** Renderer-independent, read-only context projection. No model, microphone or authority service. */
import { ACTS, MODEL, RETURN_EXAMPLE } from '../data/story.js';
export const PROJECT_ID = 'kn-first-encounter-illustrative';
export const ANCHOR_ID = 'kn:anchor:stern-access';
export const SOURCE_REF = 'public-documentation';
const OWNER = 'GrazianoGuiducci/kernel-nautico';
const PREFIX = 'workstations/visual-presentation/production/threejs-first-encounter/';
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
};
const source = (path, section, title) => freeze({ owner: OWNER, path, revision: SOURCE_REF,
  section, title, read_state: 'linked_not_loaded', freshness: 'build_snapshot_not_live',
  url: `./public-receiver/sources/${path}${section ? '#' + section : ''}` });
const domain = source('KERNEL.md', 'first-complete-vertical--v-01-causal-product-continuity', 'V-01 · continuità del prodotto');
const returnSource = source('COMPETENCE_FIELD.md', 'ritorno-dal-ciclo-di-vita', 'Lifecycle Return Qualification v0.2');
const illustration = source(PREFIX + 'app/src/data/story.js', '', 'Esempio illustrativo · sorgente del racconto');
const spatial = source('docs/NAUTICAL_OPERATIONAL_SPATIAL_SURFACE_0_1.md', 'spatial-selection---context', 'Selezione spaziale e contesto');
export const REGISTRY = freeze([
  ...ACTS.map(act => ({ id: `kn:phase:${act.id}`, kind: 'lifecycle_phase', label: act.id,
    act: act.id, relation: act.label, spatial_anchor: null,
    sources: act.id === 'RETURN' ? [domain, returnSource, illustration] : [domain, illustration] })),
  { id: ANCHOR_ID, kind: 'spatial_anchor', label: 'Accesso a poppa', act: null,
    relation: 'Punto di accesso nello stesso yacht illustrativo.', spatial_anchor: 'stern-access',
    sources: [spatial, illustration, returnSource] },
]);
export const phaseId = act => `kn:phase:${act}`;
export function targetFor(id) {
  const target = REGISTRY.find(item => item.id === id);
  if (!target) throw new RangeError('Indirizzo non disponibile in questo esercizio.');
  return target;
}
export function addressFor(id) {
  const t = targetFor(id);
  return freeze({ semantic_id: t.id, project_id: PROJECT_ID,
    configuration: MODEL.sha256, object_type: t.kind });
}
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().trim().replace(/[.!?]+$/g, '').replace(/\s+/g, ' ');
const aliases = new Map([
  ['form', phaseId('FORM')], ['progetto', phaseId('FORM')],
  ['build', phaseId('BUILD')], ['costruzione', phaseId('BUILD')],
  ['live', phaseId('LIVE')], ['vita', phaseId('LIVE')],
  ['return', phaseId('RETURN')], ['ritorno', phaseId('RETURN')],
  ['accesso a poppa', ANCHOR_ID], ['accesso di poppa', ANCHOR_ID],
  ['poppa', ANCHOR_ID], ['stern-access', ANCHOR_ID],
  ...REGISTRY.map(t => [t.id.toLowerCase(), t.id]),
]);
/** A deliberately bounded command parser, not natural-language understanding. */
export function resolveIntent(text, currentId = null) {
  if (typeof text !== 'string' || text.length > 240) return { ok: false, reason: 'invalid_input' };
  let key = normalize(text);
  if (['cosa manca qui', 'cosa manca', 'perche', 'perche e cosi'].includes(key)) {
    return currentId ? { ok: true, id: targetFor(currentId).id, view: 'gaps' }
      : { ok: false, reason: 'no_focus' };
  }
  key = key.replace(/^(?:mostrami|mostra|seleziona|esplora|apri|vai a|torna a|show)\s+/, '')
    .replace(/^(?:il|la|lo|l['’])\s*/, '');
  const id = aliases.get(key);
  if (id) return { ok: true, id, view: 'context' };
  // Never pick the first match from an ambiguous or partially understood command.
  return { ok: false, reason: /\b(?:e|o|oppure|and|or)\b/.test(key) ? 'ambiguous_input' : 'unknown_target' };
}
export function resolveField(address, state) {
  if (!address || address.project_id !== PROJECT_ID || address.configuration !== MODEL.sha256)
    throw new RangeError('Progetto o configurazione non corrispondono al dimostratore.');
  const target = targetFor(address.semantic_id);
  if (address.object_type !== target.kind) throw new RangeError('Tipo di oggetto non corrispondente.');
  const act = ACTS.find(a => a.id === state?.act);
  if (!act) throw new RangeError('Stato della presentazione non valido.');
  if (target.act && target.act !== act.id) throw new RangeError('Fase e contesto non allineati.');
  const isAnchor = target.id === ANCHOR_ID;
  return freeze({ schema: 'kn.focus-field.v0.1', address,
    label: target.label, relation: target.relation,
    state: { presentation_act: act.id, state_owner: 'local presentation timeline',
      reality: 'illustrative_not_observed', vessel_instance: null,
      configuration_kind: 'visual_asset_sha256_not_as_built',
      geometry: state.fallback ? 'schematic_alternative' : 'licensed_carrier',
      spatial_anchor: target.spatial_anchor, current_resultant: act.text },
    knowledge: {
      explanation: isAnchor && act.id === 'RETURN' ? RETURN_EXAMPLE.observation : act.text,
      example: isAnchor || act.id === 'RETURN' ? RETURN_EXAMPLE : null,
      sources: target.sources,
      competences: isAnchor || act.id === 'RETURN' ? [{
        name: 'Lifecycle Return Qualification v0.2', reference: returnSource,
        participation: 'reachable_reference_not_executed',
      }] : [],
      gaps: [
        { missing: 'Dati di un progetto o di uno yacht reale',
          why: 'Il candidato contiene geometria e racconto illustrativi, non fonti aziendali o dati di bordo.' },
        ...(isAnchor || act.id === 'RETURN' ? [{ missing: 'Evento osservato, cause e responsabili',
          why: 'L’esempio dell’accesso non è una non-conformità reale né una valutazione tecnica.' }] : []),
      ],
      continuation: 'Leggere le fonti collegate; una futura integrazione dovrà fornire dati, competenze esercitabili e autorità proprie.',
    },
    receiver: { session: 'local_demo', authentication: 'not_implemented' },
    capabilities: { inspect: true, source_links: true, export_context: true,
      edit_project: false, execute: false, approve: false, route_planning: false,
      microphone: false, ai_connected: false },
  });
}
const MODALITIES = new Set(['pointer', 'touch', 'keyboard', 'text', 'voice_simulated', 'api', 'timeline']);
/** One selected address; fresh state is supplied by the existing timeline, never mirrored. */
export function createFocusController(getState) {
  let id = phaseId(getState().act), field = resolveField(addressFor(id), getState());
  let revision = 0, event = null;
  const listeners = new Set();
  function select(address, modality = 'api', { expectedRevision = revision } = {}) {
    if (!MODALITIES.has(modality)) throw new RangeError('Modalità di ingresso non valida.');
    if (expectedRevision !== revision) throw new RangeError('Focus superato: rileggere il contesto.');
    const next = resolveField(address, getState()); // Validate everything before mutation.
    id = address.semantic_id; field = next; revision++;
    event = freeze({ schema: 'kn.focus-event.v0.1', revision, modality, address });
    for (const fn of listeners) fn(snapshot());
    return snapshot();
  }
  function sync() {
    const state = getState();
    const nextId = targetFor(id).kind === 'lifecycle_phase' ? phaseId(state.act) : id;
    if (nextId !== id || field.state.presentation_act !== state.act ||
        field.state.geometry !== (state.fallback ? 'schematic_alternative' : 'licensed_carrier'))
      select(addressFor(nextId), 'timeline');
  }
  function snapshot() { return freeze({ field, event, revision }); }
  return Object.freeze({ select, sync, snapshot,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); } });
}
