import { RETURN_RELATION, RETURN_PROJECTION, RETURN_CONTEXT } from '../data/semantic.js';

export function createReturnDoorway({ onChange }) {
  const trigger = document.getElementById('understand-return');
  const rail = document.getElementById('return-doorway');
  let open = false, depth = 'meaning', origin = null;

  rail.innerHTML = `
    <div class="semantic-head">
      <button id="close-return" class="semantic-close" aria-label="Chiudi approfondimento RETURN e torna alla scena">Torna alla scena <span aria-hidden="true">×</span></button>
      <p class="eyebrow">RETURN · KERNEL NAUTICO</p>
      <h2 id="return-doorway-title" tabindex="-1">${RETURN_CONTEXT.title}</h2>
    </div>
    <div class="semantic-body">
      <div class="semantic-depths" role="group" aria-label="Profondità della relazione RETURN">
        ${RETURN_CONTEXT.depths.map(d => `<button data-depth="${d.id}" aria-pressed="false" aria-controls="semantic-content">${d.label}</button>`).join('')}
      </div>
      <section id="semantic-content" aria-labelledby="semantic-depth-title"></section>
      <div class="semantic-context">
        <p class="semantic-label">IN QUESTA SCENA · ESEMPIO ILLUSTRATIVO</p>
        <p data-projection-state="${RETURN_PROJECTION.example.status}">${RETURN_CONTEXT.projectionNote}</p>
        <p class="semantic-knowledge" data-knowledge-state="${RETURN_RELATION.knowledge.state}">${RETURN_CONTEXT.knowledgeNote}</p>
      </div>
    </div>`;
  const heading = rail.querySelector('h2');
  const content = rail.querySelector('#semantic-content');
  const buttons = [...rail.querySelectorAll('[data-depth]')];

  function renderDepth(id) {
    const selected = RETURN_CONTEXT.depths.find(d => d.id === id);
    if (!selected) throw new RangeError('Unknown RETURN depth.');
    depth = selected.id;
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.depth === depth));
    content.innerHTML = `<h3 id="semantic-depth-title">${selected.title}</h3>
      ${selected.paragraphs.map(p => `<p>${p}</p>`).join('')}
      ${depth === 'source' ? `
        <dl class="semantic-evidence">
          <dt>Competenza</dt><dd>${RETURN_RELATION.knowledge.name} v${RETURN_RELATION.knowledge.version}</dd>
          <dt>Stato della conoscenza</dt><dd>Esercitata · repository e rientro del Kernel Nautico</dd>
          <dt>Proiezione in scena</dt><dd>Esempio illustrativo · accesso di poppa</dd>
        </dl>
        <ul class="semantic-sources">${RETURN_RELATION.knowledge.sources.map(s => `
          <li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} <span aria-hidden="true">↗</span><span class="sr-only"> (apre una nuova scheda)</span></a><p>${s.description}</p></li>`).join('')}</ul>
        <p class="semantic-revision">Fonti alla revisione ${RETURN_RELATION.knowledge.sources[0].revision.slice(0, 7)}.</p>
      ` : ''}`;
  }
  function close({ restoreFocus = true } = {}) {
    if (!open) return;
    open = false;
    rail.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('semantic-open');
    onChange(false);
    if (restoreFocus && origin) {
      const destination = origin.focus?.isConnected && origin.focus.getClientRects().length
        ? origin.focus : trigger;
      destination.focus({ preventScroll: true });
      window.scrollTo(origin.x, origin.y);
    }
    origin = null;
  }
  trigger.addEventListener('click', () => {
    if (open) { close(); return; }
    origin = { focus: trigger, x: scrollX, y: scrollY };
    depth = 'meaning';
    renderDepth(depth);
    open = true;
    rail.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('semantic-open');
    onChange(true);
    heading.focus();
  });
  rail.querySelector('#close-return').addEventListener('click', () => close());
  for (const button of buttons) button.addEventListener('click', () => renderDepth(button.dataset.depth));
  document.addEventListener('keydown', event => {
    if (open && event.key === 'Escape' && !document.getElementById('details').open) {
      event.preventDefault(); close();
    }
  });
  renderDepth(depth);
  return {
    close,
    update(available) {
      if (!available) close({ restoreFocus: false });
      trigger.hidden = !available;
    },
    snapshot() {
      return { open, depth, semanticId: RETURN_RELATION.semanticId,
        knowledgeState: RETURN_RELATION.knowledge.state,
        projectionId: RETURN_PROJECTION.example.id, projectionState: RETURN_PROJECTION.example.status,
        capabilities: RETURN_PROJECTION.capabilities };
    },
  };
}
