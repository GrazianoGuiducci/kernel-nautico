/**
 * Kernel Nautico — situated design capture, candidate 0.1.
 * Owner: KN for the project record; Design for interaction/observation-frame method.
 * No renderer, network, AI invocation, authorization or model mutation lives here.
 */
const SCHEMA = 'kn.design-capture.v0.1';
const fail = message => { throw new TypeError(message); };
function plain(value) {
  try {
    const text = JSON.stringify(value, (_key, item) => {
      if (typeof item === 'number' && !Number.isFinite(item)) fail('Non-finite number.');
      if (['undefined','function','symbol','bigint'].includes(typeof item)) fail('JSON data required.');
      return item;
    });
    return JSON.parse(text);
  } catch (error) { throw new TypeError(`Capture must remain plain JSON: ${error.message}`); }
}
const string = (value, name) => {
  if (typeof value !== 'string' || !value.trim()) fail(`${name} is required.`);
};
const object = (value, name) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${name} must be an object.`);
};

/** Normalization preserves the captured frame, not a presumed 3D correspondence. */
export function normalizePoint(x, y, width, height) {
  if (![x,y,width,height].every(Number.isFinite) || width <= 0 || height <= 0) {
    fail('A finite point and a positive captured frame are required.');
  }
  return [x / width, y / height];
}

/** Preserve source contributions before a coder/AI interprets them. */
export function createCapture(input) {
  const record = plain(input);
  object(record, 'capture');
  if (record.schema !== undefined && record.schema !== SCHEMA) fail('Unknown capture version; preserve it without rewriting.');
  string(record.id, 'capture.id');
  object(record.source, 'source');
  string(record.source.id, 'source.id');
  string(record.source.revision, 'source.revision');
  object(record.view, 'view');
  string(record.view.id, 'view.id');
  if (![record.view.width, record.view.height].every(n => Number.isFinite(n) && n > 0)) fail('Positive view dimensions required.');
  if (!Array.isArray(record.contributions) || record.contributions.length === 0) fail('At least one source contribution is required.');
  const ids = new Set();
  for (const contribution of record.contributions) {
    object(contribution, 'contribution');
    string(contribution.id, 'contribution.id');
    if (ids.has(contribution.id)) fail('Contribution IDs must remain distinct.');
    ids.add(contribution.id);
    // Kinds are intentionally open. A sketch, text, photo, diagram or later form
    // does not have to become one of a fixed list of semantic categories.
    string(contribution.kind, 'contribution.kind');
    if (contribution.points !== undefined) {
      if (!Array.isArray(contribution.points) || !contribution.points.every(p =>
        Array.isArray(p) && p.length === 2 && p.every(Number.isFinite))) fail('Points must be finite coordinate pairs.');
      if (contribution.coordinateSpace !== 'normalized-captured-view') fail('Stroke coordinates must name their captured frame.');
    }
  }
  return { ...record, schema: SCHEMA };
}

/** It is never valid to attach a 2D mark to a replacement asset by name alone. */
export function assessBinding(capture, current) {
  const record = createCapture(capture);
  const reasons = [];
  if (current?.source?.id !== record.source.id) reasons.push('source_identity_changed');
  if (current?.source?.revision !== record.source.revision) reasons.push('source_revision_changed');
  if (current?.view?.id !== record.view.id) reasons.push('observation_frame_changed');
  return {
    state: reasons.length ? 'needs_explicit_remapping' : 'recorded_frame_identity_matches',
    reasons,
    originalSource: record.source,
    originalView: record.view,
  };
}

/** Prepare a local handoff; this function does not send or execute anything. */
export function createCoderHandoff(capture, { request, baseRevision, interpretation = null }) {
  string(request, 'request');
  string(baseRevision, 'baseRevision');
  return {
    schema: 'kn.design-handoff.v0.1',
    capture: createCapture(capture),
    requestedWork: { text: request, baseRevision },
    interpretation: plain(interpretation),
    effect: { disposition: 'prepared_only', executionAuthorizedByRecord: false },
  };
}
