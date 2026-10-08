import { PUBLIC_VIEWS } from './public-controls.js';

// The domain registry supplies the ten real targets. Layout is a receiving
// preference; never reconstruct case, source or authority from its weights.
export const DESK_TARGETS = Object.freeze(Object.keys(PUBLIC_VIEWS));
export const DESK_PREFERENCES_SCHEMA = 'kn.entity-desk.preferences.v1';
const safeInt = value => Number.isSafeInteger(value) && value >= 0 && value <= 100000 ? value : 0;

export const PRESENTATION_TARGET = 'nautico-presentazione';
const WEIGHTS = Object.freeze({
  'nautico-presentazione': 'hero',
  'nautico-apprendimento': 'medium',
  'nautico-collaborazione': 'large',
  'nautico-studio': 'medium',
  'nautico-cantiere': 'large',
  'nautico-fornitori': 'medium',
  'nautico-showroom': 'medium',
  'nautico-bordo': 'medium',
  'nautico-assistenza': 'medium',
  'nautico-progetto': 'large',
});
export const deskWeight = target => WEIGHTS[target] || 'small';
export const isDeskTarget = target => typeof target === 'string' && Object.hasOwn(PUBLIC_VIEWS, target);
export const labelFor = target => isDeskTarget(target) ? PUBLIC_VIEWS[target].label : '';
export const familyFor = target => isDeskTarget(target) ? PUBLIC_VIEWS[target].family : '';

export function normalizeDeskOrder(value) {
  const known = new Set(), ordered = [];
  for (const id of Array.isArray(value) ? value : []) {
    if (isDeskTarget(id) && !known.has(id)) { known.add(id); ordered.push(id); }
  }
  for (const id of DESK_TARGETS) if (!known.has(id)) ordered.push(id);
  return ordered;
}

export function reorderDesk(order, from, to) {
  const current = normalizeDeskOrder(order);
  if (!isDeskTarget(from) || !isDeskTarget(to) || from === to) return current;
  const next = current.filter(id => id !== from);
  next.splice(next.indexOf(to), 0, from);
  return next;
}

export function autoDeskOrder(order, usage) {
  const items = normalizeDeskOrder(order);
  // Deliberate request only. Stable sorting prevents attention-jitter.
  return items.map((id, index) => ({ id, index, count: safeInt(usage?.[id]) }))
    .sort((a, b) => b.count - a.count || a.index - b.index)
    .map(entry => entry.id);
}

export function normalizeDeskPreferences(value) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const usage = {};
  for (const id of DESK_TARGETS) usage[id] = safeInt(input.usage?.[id]);
  return Object.freeze({
    schema: DESK_PREFERENCES_SCHEMA,
    order: normalizeDeskOrder(input.order),
    usage,
    placement: ['floating', 'dock-left', 'dock-right', 'full'].includes(input.placement) ? input.placement : 'floating',
  });
}

export function positionNearEdge(clientX, viewportWidth, threshold = 68) {
  if (!Number.isFinite(clientX) || !Number.isFinite(viewportWidth) || viewportWidth < 700) return 'floating';
  if (clientX <= threshold) return 'dock-left';
  if (clientX >= viewportWidth - threshold) return 'dock-right';
  return 'floating';
}
