import { PHASE_COPY, PHASE_LABELS } from '../ui/copy.js';
import { ANCHOR_ID, REGISTRY, addressFor, phaseId, targetFor, resolveIntent, createFocusController } from './field.js';

/** Thin DOM adapter; the semantic resolver has no dependency on this panel or Three.js. */
export function mountFocus({ getState, seekAct, pause, invalidate, projectAnchor, isInspect }) {
  const $ = id => document.getElementById(id);
  const css = document.createElement('link'); css.rel = 'stylesheet';
  css.href = new URL('./panel.css', import.meta.url).href; document.head.append(css);
  const controller = createFocusController(getState);
  const toggle = document.createElement('button'); toggle.id = 'focus-toggle';
  toggle.textContent = 'Contesto'; toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'focus-panel');
  $('about').before(toggle);
  const anchor = document.createElement('button'); anchor.id = 'focus-anchor';
  anchor.setAttribute('aria-label', 'Apri il contesto dell’accesso a poppa');
  anchor.setAttribute('aria-pressed', 'false');
  anchor.title = 'Accesso a poppa · contesto'; anchor.textContent = '+';
  $('experience').append(anchor);
  const panel = document.createElement('section'); panel.id = 'focus-panel'; panel.hidden = true;
  panel.setAttribute('aria-labelledby', 'focus-title');
  // Static markup only. Source labels and all user input are rendered with textContent.
  panel.innerHTML = `
    <div class="focus-head"><p>ELEMENTO SELEZIONATO · INFORMAZIONI</p><button id="focus-close" aria-label="Chiudi il contesto">Chiudi ×</button></div>
    <h2 id="focus-title" tabindex="-1"></h2>
    <p id="focus-position"></p><p id="focus-reality"></p><p id="focus-explanation"></p>
    <form id="focus-command"><label for="focus-input">Indica dove andare</label>
      <div class="focus-input-row"><input id="focus-input" maxlength="240" autocomplete="off" placeholder="Mostrami accesso a poppa" aria-describedby="focus-hint"><button type="submit">Vai</button></div>
      <label class="focus-voice"><input id="focus-voice" type="checkbox"> Trascrizione vocale simulata</label>
      <p id="focus-hint">Puoi scrivere «progetto», «costruzione», «vita», «ritorno», «accesso a poppa» o «cosa manca qui». Questi comandi selezionano parti della presentazione; la voce è soltanto simulata.</p>
    </form>
    <p id="focus-feedback" role="status" aria-live="polite"></p>
    <details id="focus-gaps"><summary>Cosa manca e perché</summary><div id="focus-gap-list"></div></details>
    <details id="focus-sources"><summary>Documenti e metodi di riferimento</summary><div id="focus-source-list"></div><p id="focus-source-status"></p></details>
    <details><summary>Dati tecnici dell’elemento selezionato · JSON</summary><pre id="focus-json"></pre></details>
  `;
  document.body.append(panel);
  let returnFocus = toggle, open = false;
  const modality = event => event.pointerType === 'touch' ? 'touch' : event.detail === 0 ? 'keyboard' : 'pointer';
  function render() {
    const snapshot = controller.snapshot(), f = snapshot.field;
    $('focus-title').textContent = PHASE_LABELS[f.label] || f.label;
    $('focus-position').textContent = `Yacht illustrativo · ${PHASE_LABELS[f.state.presentation_act]}`;
    $('focus-reality').textContent = f.state.geometry === 'schematic_alternative'
      ? 'Contesto illustrativo · schema alternativo, non dati di bordo.'
      : 'Contesto illustrativo · non dati di bordo.';
    $('focus-explanation').textContent = f.address.semantic_id === ANCHOR_ID && f.state.presentation_act === 'RETURN'
      ? 'Nell’esempio, una persona segnala che il passaggio verso l’accesso a poppa è poco agevole. Il team deve valutare il caso prima di proporre una modifica.'
      : PHASE_COPY[f.state.presentation_act].text;
    anchor.setAttribute('aria-pressed', String(f.address.semantic_id === ANCHOR_ID));
    toggle.setAttribute('aria-label', `Apri il contesto: ${PHASE_LABELS[f.label] || f.label}`);
    const gaps = $('focus-gap-list'); gaps.replaceChildren();
    for (const item of f.knowledge.gaps) {
      const p = document.createElement('p'), strong = document.createElement('strong');
      strong.textContent = item.missing; p.append(strong, document.createElement('br'), item.why); gaps.append(p);
    }
    const list = $('focus-source-list'); list.replaceChildren();
    for (const ref of f.knowledge.sources) {
      const p = document.createElement('p'), a = document.createElement('a');
      a.textContent = ref.title + ' ↗'; a.href = ref.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      p.append(a); list.append(p);
    }
    $('focus-source-status').textContent = 'I collegamenti aprono versioni precise dei documenti. Puoi leggerne i metodi; questa vista mostra informazioni sull’elemento selezionato e non esegue analisi AI.';
    $('focus-json').textContent = JSON.stringify(snapshot, null, 2);
    document.dispatchEvent(new CustomEvent('kn:focus', { detail: structuredClone(snapshot) }));
  }
  function setOpen(value, origin = toggle) {
    open = Boolean(value); pause(); panel.hidden = !open;
    document.body.classList.toggle('focus-open', open); toggle.setAttribute('aria-expanded', String(open));
    if (open) { returnFocus = origin; $('focus-title').focus({ preventScroll: true }); }
    else (returnFocus?.isConnected && !returnFocus.hidden ? returnFocus : toggle).focus({ preventScroll: true });
    invalidate();
  }
  function select(id, via = 'api', show = true, origin = toggle) {
    const target = targetFor(id); // Validate before moving the timeline.
    if (target.act) seekAct(target.act); else pause();
    const result = controller.select(addressFor(id), via);
    if (show && !open) setOpen(true, origin);
    $('focus-feedback').textContent = `${PHASE_LABELS[result.field.label] || result.field.label} selezionato${via === 'voice_simulated' ? ' tramite trascrizione simulata' : ''}.`;
    invalidate(); return result;
  }
  function submit(text, via = 'text') {
    if (!['text', 'voice_simulated'].includes(via)) throw new RangeError('Ingresso testuale non valido.');
    const intent = resolveIntent(text, controller.snapshot().field.address.semantic_id);
    if (!intent.ok) {
      $('focus-feedback').textContent = intent.reason === 'ambiguous_input'
        ? 'Indica un solo elemento. La selezione precedente resta invariata.'
        : 'Elemento non riconosciuto. Usa una fase o «accesso a poppa»; la selezione non cambia.';
      return intent;
    }
    select(intent.id, via);
    if (intent.view === 'gaps') $('focus-gaps').open = true;
    return { ...intent, snapshot: controller.snapshot() };
  }
  toggle.onclick = () => setOpen(!open);
  $('focus-close').onclick = () => setOpen(false);
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setOpen(false); }
  });
  anchor.addEventListener('click', event => select(ANCHOR_ID, modality(event), true, anchor));
  for (const button of document.querySelectorAll('[data-act]')) {
    // The existing handler first positions the timeline. This adds context, not a second phase state.
    button.addEventListener('click', event => select(phaseId(button.dataset.act), modality(event), false, button));
  }
  $('focus-command').onsubmit = event => { event.preventDefault(); submit($('focus-input').value, $('focus-voice').checked ? 'voice_simulated' : 'text'); };
  controller.subscribe(render); render();
  function sync() {
    controller.sync();
    const p = projectAnchor(), inspect = isInspect();
    anchor.hidden = !p || !p.visible || inspect;
    if (!anchor.hidden) { anchor.style.left = `${p.x}px`; anchor.style.top = `${p.y}px`; }
  }
  // Local receiver seam. No credentials, remote calls, source edits or command execution.
  window.KN_FOCUS = Object.freeze({
    snapshot: () => structuredClone(controller.snapshot()),
    targets: () => REGISTRY.map(t => ({ id: t.id, label: t.label })),
    select: id => select(id, 'api'), submit,
  });
  return { sync, snapshot: () => controller.snapshot() };
}
