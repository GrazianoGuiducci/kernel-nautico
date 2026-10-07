// The public guide can open existing views. Case data and mutations are not part
// of this interface; the visitor retains the ordinary controls inside the demo.
export const PUBLIC_VIEWS = Object.freeze({
  'nautico-presentazione': { label: 'Scopri Kernel Nautico', family: 'encounter', view: 'story' },
  'nautico-apprendimento': { label: 'Come impara il kernel', family: 'encounter', view: 'learning' },
  'nautico-collaborazione': { label: 'Collaborare con un cantiere', family: 'encounter', view: 'session' },
  'nautico-studio': { label: 'Studio di progettazione', family: 'company', view: 'studio' },
  'nautico-cantiere': { label: 'Cantiere', family: 'company', view: 'cantiere' },
  'nautico-fornitori': { label: 'Fornitori e logistica', family: 'company', view: 'rete' },
  'nautico-showroom': { label: 'Showroom e relazione con il cliente', family: 'company', view: 'showroom' },
  'nautico-bordo': { label: 'A bordo', family: 'company', view: 'mare' },
  'nautico-assistenza': { label: 'Assistenza', family: 'company', view: 'service' },
  'nautico-progetto': { label: 'Progetto di poppa', family: 'product', view: 'stern' },
});

export function publicCommand(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)
      || Object.keys(data).sort().join(',') !== 'requestId,schema,session,target'
      || data.schema !== 'kn.public-view-command.v2'
      || !validPublicId(data.session) || !validPublicId(data.requestId)
      || typeof data.target !== 'string'
      || !Object.hasOwn(PUBLIC_VIEWS, data.target)) return null;
  return { requestId: data.requestId, session: data.session, target: data.target, ...PUBLIC_VIEWS[data.target] };
}

export function validPublicId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(value);
}
