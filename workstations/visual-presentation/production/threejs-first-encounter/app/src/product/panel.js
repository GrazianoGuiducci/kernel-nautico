import { createProductStore } from './store.js';
import { checkSourceBinding, LIMITS } from './contract.js';
import { ANCHOR_ID } from '../focus/field.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEW = Object.freeze({ id: 'kn:view:stern-plan:v1', width: 640, height: 360,
  coordinateSpace: 'normalized-captured-view' });
const PLAN_URL = new URL('../../product/stern-plan.svg', import.meta.url).href;
const BINDING_URL = new URL('../../product/source-binding.json', import.meta.url).href;
const DECISIONS = { accept: 'Accettata', reject: 'Rifiutata', defer: 'Rimandata', rework: 'Altra variante richiesta' };

/** A bounded product workspace. The shared Focus controller retains semantic identity. */
export function mountProduct(focus) {
  const $ = id => document.getElementById(id);
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet'; stylesheet.href = new URL('./panel.css', import.meta.url).href;
  document.head.append(stylesheet);
  const toggle = document.createElement('button');
  toggle.id = 'product-toggle'; toggle.type = 'button'; toggle.textContent = 'Progetto';
  toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'product-workspace');
  $('focus-toggle').before(toggle);
  const contextualEntry = document.createElement('button');
  contextualEntry.id = 'product-context-entry'; contextualEntry.type = 'button';
  contextualEntry.textContent = 'Annota questo accesso'; contextualEntry.hidden = true;
  $('focus-explanation').after(contextualEntry);

  const workspace = document.createElement('section');
  workspace.id = 'product-workspace'; workspace.hidden = true;
  workspace.setAttribute('aria-labelledby', 'product-title');
  // Only static, owner-authored markup. All incoming records are rendered with textContent.
  workspace.innerHTML = `
    <div class="product-head">
      <div><p class="product-eyebrow">PROGETTO · ACCESSO A POPPA</p>
        <h2 id="product-title" tabindex="-1">Progetta una variante dell’accesso a poppa.</h2></div>
      <button id="product-close" type="button" aria-label="Chiudi il progetto">Chiudi ×</button>
    </div>
    <div class="product-orientation"><span class="product-tag">PIANTA ILLUSTRATIVA</span>
      <button id="product-return-object" type="button">Mostra l’accesso sullo yacht ↗</button></div>
    <p class="product-lead">Scrivi una nota o disegna sulla pianta. Esporta la richiesta per il tuo assistente AI, importa la sua variante e registra la tua decisione sul progetto.</p>
    <ol class="product-progress" aria-label="Percorso del contributo">
      <li id="product-step-original"><span>01</span> Contributo</li>
      <li id="product-step-variant"><span>02</span> Variante</li>
      <li id="product-step-decision"><span>03</span> Decisione</li>
    </ol>
    <p id="product-source-state" class="product-source-state" role="status" aria-live="polite" tabindex="-1">Lettura delle fonti del progetto…</p>
    <button id="product-source-retry" type="button" class="product-inline-action" hidden>Riprova la lettura delle fonti</button>
    <div id="product-save-warning" class="product-notice" hidden><p id="product-save-warning-text" role="status" aria-live="polite"></p>
      <button id="product-save-recovery" type="button" aria-describedby="product-save-warning-text">Esporta una copia del lavoro</button></div>
    <p id="product-focus-state" class="product-notice" hidden></p>
    <section class="product-section" aria-labelledby="product-original-title">
      <div class="product-section-head"><h3 id="product-original-title">Il contributo originale</h3>
        <span id="product-original-state" class="product-state">Da conservare</span></div>
      <form id="product-capture-form">
        <label for="product-note">Nota sul progetto</label>
        <textarea id="product-note" rows="3" maxlength="4000" placeholder="Che cosa vuoi cambiare o preservare nell’accesso?"></textarea>
        <div class="product-drawing-wrap"><svg id="product-drawing" viewBox="0 0 640 360" role="img" aria-label="Pianta illustrativa dell’accesso a poppa con lo schizzo del contributo."><title>Schizzo sull’accesso a poppa</title></svg>
          <span id="product-drawing-badge" aria-hidden="true">VISTA CONSERVATA · POPPA</span></div>
        <div class="product-drawing-tools">
          <button id="product-draw" type="button" aria-pressed="false">Disegna</button>
          <button id="product-undo" type="button" disabled>Annulla tratto</button>
          <button id="product-clear" type="button" disabled>Cancella segni</button>
        </div>
        <p id="product-drawing-help" class="product-hint">Lo schizzo è facoltativo. La nota permette di continuare anche da tastiera.</p>
        <div class="product-actions"><button id="product-capture" class="product-primary" type="submit">Conserva il contributo</button>
          <button id="product-revise" type="button" hidden>Prepara una revisione</button>
          <button id="product-cancel-revision" type="button" hidden>Riprendi l’originale</button></div>
        <p id="product-capture-feedback" class="product-feedback" role="status" aria-live="polite"></p>
      </form>
    </section>
    <section class="product-section" aria-labelledby="product-request-title">
      <div class="product-section-head"><h3 id="product-request-title">La richiesta al tuo assistente AI</h3>
        <span id="product-request-state" class="product-state">In attesa del contributo</span></div>
      <p class="product-hint">Il file contiene la tua nota, lo schizzo, l’accesso selezionato e i riferimenti del progetto. Consegnalo al tuo assistente AI; potrai poi importare qui la variante che produrrà.</p>
      <form id="product-request-form"><label for="product-instruction">Quale risultato vuoi ottenere?</label>
        <textarea id="product-instruction" rows="2" maxlength="2000" required>Proponi una variante coerente con il contributo originale e spiega che cosa cambia.</textarea>
        <div class="product-actions"><button id="product-request-export" class="product-primary" type="submit" disabled>Esporta la richiesta</button>
          <button id="product-variant-open" type="button" disabled>Importa la variante</button></div>
        <input id="product-variant-file" type="file" accept=".json,application/json" hidden>
        <p id="product-request-feedback" class="product-feedback" role="status" aria-live="polite"></p>
      </form>
    </section>
    <section id="product-comparison" class="product-section" aria-labelledby="product-comparison-title" hidden>
      <div class="product-section-head"><h3 id="product-comparison-title" tabindex="-1">Originale e variante</h3>
        <span id="product-variant-state" class="product-state"></span></div>
      <p class="product-hint">Stessa pianta, stessa scala. I segni conservati e la proposta restano distinguibili.</p>
      <div class="product-comparison-grid">
        <figure><figcaption><span class="product-key product-key-original"></span> Originale</figcaption>
          <svg id="product-original-view" viewBox="0 0 640 360" role="img" aria-label="Contributo originale nella vista conservata."></svg>
          <p id="product-original-note"></p></figure>
        <figure><figcaption><span class="product-key product-key-variant"></span> Variante ricevuta</figcaption>
          <svg id="product-candidate-view" viewBox="0 0 640 360" role="img" aria-label="Variante proposta nella stessa vista."></svg>
          <p id="product-candidate-description"></p></figure>
      </div>
      <p id="product-variant-title" class="product-result-title"></p>
      <p id="product-variant-summary"></p>
      <button id="product-variant-focus" type="button" class="product-inline-action">Mostra l’accesso interessato sullo yacht ↗</button>
      <p id="product-focus-reason" class="product-hint"></p>
      <details class="product-details"><summary>Origine e verifiche da completare</summary>
        <p id="product-variant-origin"></p><div id="product-variant-sources"></div>
        <ul id="product-unknowns"></ul></details>
    </section>
    <section id="product-decision-section" class="product-section" aria-labelledby="product-decision-title" hidden>
      <div class="product-section-head"><h3 id="product-decision-title">Come prosegue il progetto?</h3>
        <span id="product-decision-state" class="product-state">Da decidere</span></div>
      <p class="product-hint">L’app registra la tua decisione in questo caso. Il team tecnico dovrà valutare e realizzare separatamente l’eventuale modifica nel modello o nel sistema aziendale.</p>
      <form id="product-decision-form"><fieldset class="product-dispositions"><legend class="sr-only">Decisione sulla variante</legend>
        <label><input type="radio" name="product-disposition" value="accept" required><span>Accetta</span></label>
        <label><input type="radio" name="product-disposition" value="reject"><span>Rifiuta</span></label>
        <label><input type="radio" name="product-disposition" value="defer"><span>Rimanda</span></label>
        <label><input type="radio" name="product-disposition" value="rework"><span>Chiedi un’altra variante</span></label>
      </fieldset><label for="product-decision-reason">Motivo della decisione</label>
      <textarea id="product-decision-reason" rows="2" maxlength="2000" required placeholder="Conserva la ragione utile per riprendere il lavoro."></textarea>
      <button id="product-decision-save" class="product-primary" type="submit">Registra decisione</button>
      <p id="product-decision-feedback" class="product-feedback" role="status" aria-live="polite"></p></form>
      <div id="product-recorded-decision" class="product-recorded" hidden><p id="product-recorded-title"></p><p id="product-recorded-reason"></p></div>
    </section>
    <details class="product-details product-continuity" id="product-continuity"><summary>Lavoro salvato e provenienza</summary>
      <p id="product-persistence" role="status"></p><p id="product-record-count"></p>
      <div class="product-actions"><button id="product-state-export" type="button">Esporta il lavoro</button>
        <button id="product-state-open" type="button">Riprendi da file</button>
        <button id="product-reload-source" type="button">Rileggi le fonti</button></div>
      <input id="product-state-file" type="file" accept=".json,application/json" hidden>
      <p id="product-continuity-feedback" class="product-feedback" role="status" aria-live="polite"></p>
      <p class="product-hint">L’esportazione conserva contributi, richieste, varianti e ragioni. Le fonti corrispondono alla revisione inclusa in questa copia del progetto.</p>
      <div id="product-binding-detail"></div>
    </details>`;
  $('experience').after(workspace);

  let binding = null, verifiedPlanURL = null, loading = true, bindingError = '', open = false, origin = toggle;
  let strokes = [], draft = true, draftSourceRevision = null, editorIdentity = null, currentStroke = null, pointerId = null;
  let drawing = false, suppressFocusNotice = false, decisionVariantId = null, bindingLoadId = 0;
  let controller;
  const pointPath = points => points.map((p, i) => `${i ? 'L' : 'M'}${(p[0] * VIEW.width).toFixed(2)} ${(p[1] * VIEW.height).toFixed(2)}`).join(' ');
  const keyFor = value => value?.contribution_id || value?.variant_id || value?.request_id || value?.decision_id || value?.id || null;
  const noteFor = contribution => contribution?.note ?? contribution?.original?.note ?? '';
  const strokesFor = contribution => contribution?.strokes ?? contribution?.original?.strokes ?? [];
  const previewFor = variant => variant?.preview ?? variant?.result?.preview ?? null;

  function svgNode(tag, attributes = {}, text = null) {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
    if (text !== null) element.textContent = String(text);
    return element;
  }
  function drawPlan(svg, ink = [], preview = null, sourceRevision = null) {
    svg.replaceChildren();
    const originalUnavailable = sourceRevision && sourceRevision !== binding?.sourceRevision;
    if (verifiedPlanURL && !originalUnavailable) {
      svg.dataset.sourceState = 'available';
      svg.append(svgNode('image', { href: verifiedPlanURL, width: VIEW.width, height: VIEW.height }));
    } else {
      svg.dataset.sourceState = originalUnavailable ? 'original_unavailable' : loading ? 'loading' : 'unavailable';
      svg.append(svgNode('rect', { width: VIEW.width, height: VIEW.height, fill: '#081722' }),
        svgNode('text', { x: 320, y: 185, 'text-anchor': 'middle', fill: '#bacbd3', 'font-size': 19 },
          originalUnavailable ? 'Vista originale non disponibile in questa copia' : loading ? 'Preparazione della vista…' : 'Vista sorgente non disponibile'));
      // A same-named view is not the same source bytes. Never remap old marks onto a new base.
      return;
    }
    for (const points of ink) {
      if (Array.isArray(points) && points.length) svg.append(svgNode('path', {
        d: pointPath(points), class: 'product-ink', 'vector-effect': 'non-scaling-stroke' }));
    }
    if (!preview) return;
    // The store validates a closed primitive schema; this projection also rejects unknown kinds.
    for (const primitive of preview.primitives || []) {
      const tone = primitive.tone === 'attention' ? 'attention' : 'proposal';
      if (primitive.kind === 'polyline') svg.append(svgNode('path', {
        d: pointPath(primitive.points), class: `product-proposal ${tone}`, 'vector-effect': 'non-scaling-stroke' }));
      if (primitive.kind === 'circle') svg.append(svgNode('circle', {
        cx: primitive.cx * VIEW.width, cy: primitive.cy * VIEW.height,
        r: primitive.r * Math.min(VIEW.width, VIEW.height), class: `product-proposal ${tone}`,
        'vector-effect': 'non-scaling-stroke' }));
      if (primitive.kind === 'label') svg.append(svgNode('text', {
        x: primitive.x * VIEW.width, y: primitive.y * VIEW.height,
        class: `product-preview-label ${tone}` }, primitive.text));
    }
  }
  function syncDrawing() {
    const c = controller?.snapshot().contribution;
    const revision = draft ? draftSourceRevision : c?.sourceBinding.sourceRevision;
    const mismatched = Boolean(revision && binding && revision !== binding.sourceRevision);
    drawPlan($('product-drawing'), currentStroke ? [...strokes, currentStroke] : strokes, null, revision);
    $('product-draw').setAttribute('aria-pressed', String(drawing));
    $('product-draw').textContent = drawing ? 'Termina lo schizzo' : 'Disegna';
    $('product-drawing').classList.toggle('is-drawing', drawing);
    $('product-drawing-badge').textContent = drawing ? 'DISEGNA SULLA VISTA' : 'VISTA CONSERVATA · POPPA';
    $('product-undo').disabled = !draft || strokes.length === 0;
    $('product-clear').disabled = !draft || strokes.length === 0;
    $('product-draw').disabled = !draft || !binding || !verifiedPlanURL || mismatched;
    $('product-drawing-help').textContent = mismatched && draft
      ? 'La vista è cambiata. I segni restano legati alla base precedente; cancella i segni se vuoi ridisegnare sulla base corrente.'
      : 'Lo schizzo è facoltativo. La nota permette di continuare anche da tastiera.';
  }
  function feedback(id, message, error = false) {
    const element = $(id); element.textContent = message;
    element.classList.toggle('is-error', error);
  }
  function attempt(id, operation, success = '') {
    try { const result = operation(); if (success) feedback(id, success); render(); return result; }
    catch (error) { feedback(id, error.message || 'Il passaggio non è riuscito. Il lavoro conservato resta disponibile.', true); render(); return null; }
  }
  function revealSaveRecovery() {
    // An explicit save owns this focus move. Passive render/drawing never moves the viewport.
    const warning = $('product-save-warning');
    if (warning.hidden) return;
    warning.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' });
    $('product-save-recovery').focus({ preventScroll: true });
  }
  function download(text, filename) {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = filename;
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function readPayload(file, maxBytes = LIMITS.fileBytes) {
    if (!file) return null;
    if (file.size > maxBytes) throw new Error('Il file supera il limite di questo passaggio. Il lavoro attuale resta disponibile.');
    // Keep raw text intact: the store owns parsing, rejection and bounded quarantine.
    return file.text();
  }
  function focusObject(showPanel = false) {
    suppressFocusNotice = true;
    const contribution = controller?.snapshot().contribution;
    if (contribution && focus.snapshot().field.state.presentation_act !== contribution.context.field.state.presentation_act)
      focus.select(`kn:phase:${contribution.context.field.state.presentation_act}`);
    focus.select(ANCHOR_ID);
    if (!showPanel && !$('focus-panel').hidden) $('focus-close').click();
    suppressFocusNotice = false;
  }
  function setOpen(value, invokingControl = toggle, restoreFocus = true) {
    open = Boolean(value);
    if (open) {
      origin = invokingControl;
      focusObject(false);
    }
    workspace.hidden = !open;
    document.body.classList.toggle('product-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    window.dispatchEvent(new Event('resize'));
    if (open) {
      render(); $('product-title').focus({ preventScroll: true });
      if (matchMedia('(max-width: 760px), (max-height: 640px)').matches) workspace.scrollIntoView({ block: 'start' });
    } else if (restoreFocus) {
      if ($('focus-panel').contains(origin)) {
        if ($('focus-panel').hidden) $('focus-toggle').click();
        (origin.getClientRects().length ? origin : $('focus-title')).focus({ preventScroll: true });
      } else (origin?.isConnected && origin.getClientRects().length ? origin : toggle).focus({ preventScroll: true });
    }
  }
  function showRecordSources(container, sourceList) {
    container.replaceChildren();
    for (const source of sourceList || []) {
      const paragraph = document.createElement('p');
      const name = source.path || source.source_id || source.sourceId || source.id || source.owner || 'Fonte del progetto';
      const revision = source.revision || source.sha256 || source.blob_sha || source.blob || '';
      paragraph.textContent = `${name}${revision ? ` · ${String(revision).slice(0, 12)}` : ''}${source.used_for ? ` — ${source.used_for}` : ''}`;
      container.append(paragraph);
    }
  }
  function render() {
    if (!controller) return;
    const state = controller.snapshot(), contribution = state.contribution, variant = state.variant;
    const readyBinding = Boolean(binding) && Boolean(verifiedPlanURL) && !bindingError && !loading;
    const bindingState = state.bindingStatus?.state;
    const blocked = !readyBinding || ['stale', 'invalid', 'unavailable', 'mismatch', 'quarantined'].includes(bindingState);
    const contributionId = keyFor(contribution);
    if (contribution && editorIdentity !== contributionId) {
      editorIdentity = contributionId; $('product-note').value = noteFor(contribution);
      strokes = structuredClone(strokesFor(contribution)); draftSourceRevision = contribution.sourceBinding.sourceRevision;
      draft = false; drawing = false;
    }
    if (draft && !strokes.length && binding) draftSourceRevision = binding.sourceRevision;
    $('product-note').readOnly = !draft;
    $('product-capture').hidden = !draft;
    $('product-capture').disabled = !readyBinding || Boolean(strokes.length && draftSourceRevision !== binding?.sourceRevision);
    $('product-revise').hidden = !contribution || draft;
    $('product-cancel-revision').hidden = !contribution || !draft;
    $('product-original-state').textContent = contribution ? draft ? 'Revisione in preparazione' : 'Originale conservato' : 'Da conservare';
    $('product-request-export').disabled = !contribution || blocked || draft;
    $('product-variant-open').disabled = !state.request || blocked || draft;
    $('product-instruction').disabled = !contribution;
    $('product-request-state').textContent = variant ? 'Variante ricevuta' : state.request ? 'Richiesta conservata' : contribution ? 'Pronta da formulare' : 'In attesa del contributo';
    $('product-source-state').textContent = loading ? 'Lettura delle fonti del progetto…' : bindingError
      ? `Fonti non disponibili: ${bindingError}` : blocked
      ? (state.bindingStatus?.reasons || []).some(reason => reason.startsWith('source_') || reason === 'original_view_changed')
        ? 'La fonte del contributo è cambiata. La storia resta conservata; prepara una revisione sulla base corrente.'
        : 'Il contesto è cambiato. Riprendi l’oggetto del contributo per confrontare o decidere.'
      : 'Fonti della copia corrente collegate · nessuna sincronizzazione automatica.';
    $('product-source-state').classList.toggle('is-error', blocked && !loading);
    $('product-source-retry').hidden = loading || (!bindingError && readyBinding);
    const currentFocus = focus.snapshot();
    const atObject = currentFocus.field.address.semantic_id === ANCHOR_ID;
    contextualEntry.hidden = !atObject;
    $('product-return-object').textContent = contribution ? 'Torna all’accesso a poppa ↗' : 'Mostra l’accesso sullo yacht ↗';
    $('product-focus-state').hidden = atObject;
    $('product-focus-state').textContent = 'Hai selezionato un altro elemento. La tua nota riguarda l’accesso a poppa: usa «Torna all’accesso a poppa» per riprendere quella vista.';
    $('product-capture').disabled ||= !atObject;
    $('product-request-export').disabled ||= !atObject;
    for (const [id, complete] of [['original', contribution], ['variant', variant], ['decision', state.decision]]) {
      $(`product-step-${id}`).classList.toggle('is-complete', Boolean(complete));
    }
    $('product-comparison').hidden = !variant;
    $('product-decision-section').hidden = !variant;
    if (keyFor(variant) !== decisionVariantId) {
      decisionVariantId = keyFor(variant);
      for (const option of workspace.querySelectorAll('input[name="product-disposition"]'))
        option.checked = Boolean(state.decision && option.value === state.decision.disposition);
      $('product-decision-reason').value = state.decision?.reason || '';
    }
    if (variant) {
      drawPlan($('product-original-view'), strokesFor(contribution), null, contribution?.sourceBinding.sourceRevision);
      drawPlan($('product-candidate-view'), [], previewFor(variant), variant.sourceBinding.sourceRevision);
      $('product-original-note').textContent = noteFor(contribution);
      const preview = previewFor(variant);
      $('product-candidate-description').textContent = preview?.description || variant.visual_description || 'Proposta nella vista del contributo originale.';
      $('product-variant-title').textContent = variant.title || variant.name || 'La proposta dell’assistente AI';
      $('product-variant-summary').textContent = variant.summary || variant.answer || variant.description || '';
      $('product-variant-state').textContent = blocked ? 'Base da riallineare' : 'Proposta da valutare';
      const provenance = variant.provenance || variant.receiver || {};
      $('product-variant-origin').textContent = typeof provenance === 'string' ? provenance :
        [provenance.label || provenance.name || provenance.receiver || provenance.kind,
          provenance.model, provenance.generated_at || variant.created_at].filter(Boolean).join(' · ') || 'Provenienza dichiarata nel risultato importato.';
      showRecordSources($('product-variant-sources'), variant.sources || provenance.sources || variant.source_bindings);
      $('product-unknowns').replaceChildren();
      for (const unknown of variant.unknowns || []) {
        const item = document.createElement('li'); item.textContent = typeof unknown === 'string' ? unknown : unknown.description || unknown.missing || JSON.stringify(unknown);
        $('product-unknowns').append(item);
      }
      $('product-decision-save').disabled = blocked || draft;
      $('product-variant-focus').hidden = !variant.focus_target;
      $('product-variant-focus').disabled = blocked;
      $('product-focus-reason').textContent = variant.focus_reason || '';
    }
    $('product-decision-state').textContent = state.decision ? DECISIONS[state.decision.disposition] || state.decision.disposition : 'Da decidere';
    $('product-recorded-decision').hidden = !state.decision;
    if (state.decision) {
      $('product-recorded-title').textContent = `Decisione conservata · ${DECISIONS[state.decision.disposition] || state.decision.disposition}`;
      $('product-recorded-reason').textContent = state.decision.reason;
    }
    const persisted = state.persistence;
    const saveAtRisk = ['error', 'blocked'].includes(persisted?.state) || (contribution && persisted?.state === 'memory_only');
    $('product-save-warning').hidden = !saveAtRisk;
    $('product-save-warning-text').textContent = saveAtRisk ? persisted.message : '';
    $('product-persistence').textContent = persisted?.message || (persisted?.state === 'saved' ? 'Lavoro salvato su questo dispositivo.' : 'Esporta il lavoro per conservarne una copia trasferibile.');
    $('product-record-count').textContent = `${state.contributions?.length || 0} contributi · ${state.variants?.length || 0} varianti · ${state.decisions?.length || 0} decisioni`;
    showRecordSources($('product-binding-detail'), binding?.sources || binding?.sourceBindings || []);
    syncDrawing();
  }

  async function reloadBinding() {
    const loadId = ++bindingLoadId;
    loading = true; bindingError = ''; binding = null; render();
    try {
      const response = await fetch(BINDING_URL, { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error(`lettura non riuscita (${response.status})`);
      const next = checkSourceBinding(await response.json());
      const asset = await fetch(PLAN_URL, { cache: 'no-store', credentials: 'same-origin' });
      if (!asset.ok) throw new Error(`vista non disponibile (${asset.status})`);
      const bytes = await asset.arrayBuffer();
      if (bytes.byteLength > 256000) throw new Error('dimensione della vista non riconosciuta');
      const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
        .map(byte => byte.toString(16).padStart(2, '0')).join('');
      if (digest !== next.sourceRevision) throw new Error('la vista caricata non corrisponde alla revisione delle fonti');
      const nextURL = URL.createObjectURL(new Blob([bytes], { type: 'image/svg+xml' }));
      const decoded = new Image(); decoded.src = nextURL;
      try { await decoded.decode(); }
      catch { URL.revokeObjectURL(nextURL); throw new Error('la vista verificata non può essere visualizzata'); }
      if (loadId !== bindingLoadId) { URL.revokeObjectURL(nextURL); return; }
      if (verifiedPlanURL) URL.revokeObjectURL(verifiedPlanURL);
      verifiedPlanURL = nextURL;
      binding = next;
    } catch (error) {
      if (loadId !== bindingLoadId) return;
      binding = null; bindingError = error.message;
      if (verifiedPlanURL) URL.revokeObjectURL(verifiedPlanURL);
      verifiedPlanURL = null;
    } finally { if (loadId === bindingLoadId) { loading = false; controller.refresh(); render(); } }
  }
  // Persistence belongs to the store. Failure to load sources must not erase the saved project.
  controller = createProductStore({ getFocus: () => focus.snapshot(),
    selectFocus: id => {
      const selected = focus.select(id);
      if (open && !$('focus-panel').hidden) $('focus-close').click();
      return selected;
    }, getSourceBinding: () => binding });
  controller.subscribe(render);
  toggle.onclick = () => setOpen(!open);
  contextualEntry.onclick = () => setOpen(true, contextualEntry);
  $('product-close').onclick = () => setOpen(false);
  $('product-return-object').onclick = () => { focusObject(false); render(); $('product-title').focus({ preventScroll: true }); };
  workspace.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setOpen(false); }
  });
  $('focus-toggle').addEventListener('click', () => { if (open) setOpen(false, $('focus-toggle'), false); });
  $('product-note').addEventListener('input', () => feedback('product-capture-feedback', ''));
  $('product-draw').onclick = () => { drawing = !drawing; currentStroke = null; syncDrawing(); };
  $('product-undo').onclick = () => { strokes.pop(); syncDrawing(); };
  $('product-clear').onclick = () => { strokes = []; draftSourceRevision = binding?.sourceRevision || null; render(); };
  const drawingSurface = $('product-drawing');
  function pointFrom(event) {
    const rect = drawingSurface.getBoundingClientRect();
    return [Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))];
  }
  drawingSurface.addEventListener('pointerdown', event => {
    if (!drawing || !draft || !binding || !verifiedPlanURL || draftSourceRevision !== binding.sourceRevision || event.button !== 0 || pointerId !== null) return;
    if (strokes.length >= LIMITS.strokes || strokes.reduce((n, stroke) => n + stroke.length, 0) >= LIMITS.points - 2) {
      feedback('product-capture-feedback', 'Lo schizzo ha raggiunto il limite di questa vista. Annulla un tratto oppure continua nella nota.', true); return;
    }
    event.preventDefault(); pointerId = event.pointerId; drawingSurface.setPointerCapture(pointerId);
    currentStroke = [pointFrom(event)]; syncDrawing();
  });
  drawingSurface.addEventListener('pointermove', event => {
    if (event.pointerId !== pointerId || !currentStroke) return;
    const p = pointFrom(event), last = currentStroke.at(-1);
    const remaining = LIMITS.points - strokes.reduce((n, stroke) => n + stroke.length, 0);
    if (Math.hypot(p[0] - last[0], p[1] - last[1]) < .003 || currentStroke.length >= Math.min(256, remaining)) return;
    currentStroke.push(p); syncDrawing();
  });
  function finishStroke(event) {
    if (event.pointerId !== pointerId) return;
    if (currentStroke?.length > 1 && strokes.length < LIMITS.strokes) strokes.push(currentStroke);
    currentStroke = null; pointerId = null; syncDrawing();
  }
  drawingSurface.addEventListener('pointerup', finishStroke);
  drawingSurface.addEventListener('pointercancel', event => { if (event.pointerId === pointerId) { currentStroke = null; pointerId = null; syncDrawing(); } });
  $('product-revise').onclick = () => {
    draft = true; drawing = false;
    if (binding && draftSourceRevision !== binding.sourceRevision) {
      strokes = []; draftSourceRevision = binding.sourceRevision;
      feedback('product-capture-feedback', 'La nuova revisione conserva la nota. La vista è cambiata: ridisegna i segni sulla base corrente. L’originale resta nella storia.');
    }
    render(); $('product-note').focus();
  };
  $('product-cancel-revision').onclick = () => { editorIdentity = null; render(); $('product-revise').focus(); };
  $('product-capture-form').onsubmit = event => {
    event.preventDefault();
    const result = attempt('product-capture-feedback', () => controller.capture({
      note: $('product-note').value, strokes: structuredClone(strokes), view: { ...VIEW } }),
      'Contributo conservato. La nota, lo schizzo e la vista restano collegati.');
    if (result) { draft = false; drawing = false; render(); revealSaveRecovery(); }
  };
  $('product-request-form').onsubmit = event => {
    event.preventDefault();
    const request = attempt('product-request-feedback', () => controller.prepareRequest($('product-instruction').value));
    if (request) {
      download(JSON.stringify(request, null, 2), `kn-richiesta-${keyFor(request) || 'progetto'}.json`);
      feedback('product-request-feedback', 'La richiesta è stata esportata. Consegna il file al tuo assistente AI e importa qui la variante che produrrà.');
    }
  };
  $('product-variant-open').onclick = () => $('product-variant-file').click();
  $('product-variant-file').onchange = async event => {
    const file = event.target.files[0]; if (!file) return;
    feedback('product-request-feedback', 'Verifica della variante…');
    try {
      const raw = await readPayload(file, LIMITS.resultBytes);
      const result = attempt('product-request-feedback', () => controller.importResult(raw), 'Variante importata e collegata al contributo originale.');
      if (result) { $('product-comparison-title').focus(); $('product-comparison').scrollIntoView({ block: 'start' }); }
    } catch (error) { feedback('product-request-feedback', error.message, true); }
    event.target.value = '';
  };
  $('product-variant-focus').onclick = () => {
    // The verified result chooses an existing semantic target; importing it never navigates.
    const selected = attempt('product-request-feedback', () => controller.showTarget(), 'L’app mostra l’elemento indicato dall’AI. La nota e lo schizzo restano legati alla vista originale.');
    if (selected) $('product-return-object').focus({ preventScroll: true });
  };
  $('product-decision-form').onsubmit = event => {
    event.preventDefault();
    const selected = workspace.querySelector('input[name="product-disposition"]:checked');
    if (!selected) return;
    const decision = attempt('product-decision-feedback', () => controller.decide(selected.value, $('product-decision-reason').value),
      'Decisione salvata per questa variante. La ragione sarà disponibile al rientro.');
    if (decision) revealSaveRecovery();
  };
  $('product-state-export').onclick = () => {
    const state = attempt('product-continuity-feedback', () => controller.exportState());
    if (state) { download(typeof state === 'string' ? state : JSON.stringify(state, null, 2), 'kernel-nautico-lavoro.json');
      feedback('product-continuity-feedback', 'Copia del lavoro esportata. Puoi riprenderla su un’altra sessione della stessa versione.'); }
  };
  $('product-state-open').onclick = () => $('product-state-file').click();
  $('product-state-file').onchange = async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      const raw = await readPayload(file);
      const restored = attempt('product-continuity-feedback', () => controller.importState(raw), 'Lavoro ripreso dal file. Contributi e decisioni conservano la loro provenienza.');
      if (restored) { editorIdentity = null; decisionVariantId = null; render(); }
    } catch (error) { feedback('product-continuity-feedback', error.message, true); }
    event.target.value = '';
  };
  $('product-reload-source').onclick = () => reloadBinding();
  $('product-source-retry').onclick = async () => { await reloadBinding(); $('product-source-state').focus({ preventScroll: true }); };
  $('product-save-recovery').onclick = () => $('product-state-export').click();
  document.addEventListener('kn:focus', () => { if (!suppressFocusNotice) render(); });
  window.KN_PRODUCT = Object.freeze({
    open: () => setOpen(true), close: () => setOpen(false), snapshot: () => controller.snapshot(),
    exportState: () => controller.exportState(), view: { ...VIEW },
  });
  render(); reloadBinding();
  return { snapshot: () => controller.snapshot(), open: () => setOpen(true) };
}
