import { createCompanyStore } from './store.js';
import { checkCompanySourceBinding, LIMITS } from './contract.js';
import { COMPANY_CONTEXTS as SOURCE_CONTEXTS, DEFINITION_KINDS, contextById as sourceContextById, methodForContext } from './field.js';
import { contextForDisplay, RETURN_LABELS } from '../ui/copy.js';
const COMPANY_CONTEXTS = SOURCE_CONTEXTS.map(contextForDisplay);
const contextById = id => contextForDisplay(sourceContextById(id));
import { COMPANY_METHOD } from './method.js';

const BINDING_URL = new URL('../../company/source-binding.json', import.meta.url).href;
const MAX_FILE_BYTES = LIMITS.fileBytes;

/** Company exploration and one situated work case, independent of 3D focus. */
export async function mountCompany() {
  const $ = id => document.getElementById(id);
  const style = document.createElement('link');
  style.rel = 'stylesheet'; style.href = new URL('./panel.css', import.meta.url).href;
  document.head.append(style);
  const toggle = document.createElement('button');
  toggle.id = 'company-toggle'; toggle.type = 'button'; toggle.textContent = 'Esplora il lavoro';
  toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'company-panel');
  document.querySelector('header .edition').before(toggle);
  const panel = document.createElement('section');
  panel.id = 'company-panel'; panel.hidden = true; panel.setAttribute('aria-labelledby', 'company-title');
  // Static authored markup only. All records, source labels and user input use
  // textContent / value; an imported result can never become executable markup.
  panel.innerHTML = `
    <div class="company-head"><div><p class="company-eyebrow">KERNEL NAUTICO · NEL LAVORO DELL’AZIENDA</p>
      <h2 id="company-title" tabindex="-1">Kernel Nautico nel lavoro dei reparti.</h2></div>
      <button id="company-close" type="button" aria-label="Chiudi l’esplorazione del lavoro">Chiudi ×</button></div>
    <div id="company-explore">
      <p class="company-lead">Scegli dove nasce il caso: progettazione, costruzione, forniture, vendita, navigazione o assistenza. Per ogni contesto puoi descrivere una situazione e preparare il lavoro con il tuo assistente AI.</p>
      <div id="company-contexts" class="company-contexts" role="group" aria-label="Scegli un contesto di lavoro"></div>
      <section class="company-context" aria-labelledby="company-context-title">
        <p class="company-tag">APPLICAZIONI DA FORMARE CON IL CANTIERE</p>
        <h3 id="company-context-title"></h3><p id="company-question" class="company-question"></p>
        <p id="company-work"></p>
        <div class="company-actions"><button id="company-start" class="company-primary" type="button">Descrivi un caso di lavoro</button>
          <button id="company-design" type="button" hidden>Apri il progetto di poppa ↗</button>
          <button id="company-resume" class="company-link" type="button" hidden>Riprendi il caso conservato</button></div>
        <details class="company-details"><summary>Chi partecipa e quali informazioni conserva il caso</summary>
          <dl class="company-relations"><dt>Chi partecipa</dt><dd id="company-people"></dd>
            <dt>Quali informazioni restano collegate</dt><dd id="company-continuity"></dd>
            <dt>Che cosa puoi fare qui</dt><dd id="company-capability"></dd></dl>
          <p class="company-hint">Questa scelta mostra un esempio di lavoro del reparto. Il tuo caso salvato resta disponibile dal pulsante «Riprendi il caso conservato».</p></details>
        <details id="company-public-signal" class="company-details" hidden><summary>Esempi illustrativi del dominio nautico</summary><div id="company-public-signal-content"></div></details>
        <details class="company-details"><summary>Documenti di riferimento e possibili miglioramenti</summary>
          <div id="company-sources"></div><ul id="company-return-paths"></ul>
          <p class="company-hint">I documenti descrivono il metodo del kernel. L’elenco indica chi potrebbe usare ciò che il caso insegna.</p></details>
      </section>
    </div>
    <div id="company-workspace" hidden>
      <div class="company-work-nav"><button id="company-back" type="button" class="company-link">← Contesti di lavoro</button>
        <span id="company-case-status" class="company-tag">CASO LOCALE</span></div>
      <p id="company-case-summary" class="company-hint">Descrivi ciò che sai già del caso. Il team potrà aggiungere informazioni e precisare i requisiti durante il lavoro.</p>
      <form id="company-case-form">
        <label for="company-case-label">Titolo del caso</label><input id="company-case-label" maxlength="200" required placeholder="La situazione su cui vuoi lavorare">
        <label for="company-contribution">La descrizione iniziale del caso</label>
        <textarea id="company-contribution" rows="3" maxlength="6000" required placeholder="Descrivi un intento, una situazione o un riscontro."></textarea>
        <p id="company-original-hint" class="company-hint" hidden>La descrizione iniziale resta conservata. Aggiungi fatti, proposte, decisioni e domande nei campi qui sotto per aggiornare il caso.</p>
        <button id="company-example" type="button" class="company-link">Usa un esempio illustrativo</button>
        <details class="company-details"><summary>Azienda, progetto e oggetto</summary>
          <p class="company-hint">Nomi dichiarati in questa copia. Puoi lasciare aperto ciò che va ancora definito.</p>
          <div class="company-identity-grid"><div><label for="company-name">Azienda</label><input id="company-name" maxlength="200" placeholder="Da definire"></div>
            <div><label for="company-project">Progetto</label><input id="company-project" maxlength="200" placeholder="Da definire"></div></div>
          <label for="company-object">Prodotto, imbarcazione o parte</label><input id="company-object" maxlength="200" placeholder="Da definire">
          <label for="company-case-context">Contesto del caso</label><select id="company-case-context"></select></details>
        <details class="company-details" id="company-definition-details"><summary>Aggiungi fatti, proposte e decisioni</summary>
          <p class="company-hint">Un fatto osservato, una proposta, una decisione dichiarata e una domanda aperta restano distinguibili. Aggiungi solo ciò che cambia il caso.</p>
          <div id="company-definitions"></div><button id="company-add-definition" type="button">Aggiungi un elemento al caso</button></details>
        <details class="company-details"><summary>Documenti e domande per l’assistente AI</summary>
          <div id="company-preserved-sources"></div>
          <label for="company-extra-sources">Aggiungi riferimenti · uno per riga</label>
          <textarea id="company-extra-sources" rows="2" maxlength="6000" placeholder="Un documento, una revisione o un link pertinente"></textarea>
          <p class="company-hint">La richiesta include questi riferimenti e il metodo di lavoro del kernel. L’assistente AI dovrà poter accedere ai documenti e dichiarare quali ha effettivamente letto.</p>
          <label for="company-questions">Domande aperte · una per riga</label>
          <textarea id="company-questions" rows="2" maxlength="6000" placeholder="Quale informazione cambierebbe il seguito?"></textarea></details>
        <div class="company-actions"><button id="company-save" class="company-primary" type="submit">Conserva il caso</button></div>
        <p id="company-save-feedback" class="company-feedback" role="status" aria-live="polite"></p>
      </form>
      <section id="company-exchange" class="company-section" aria-labelledby="company-exchange-title" hidden>
        <h3 id="company-exchange-title">Continua il caso con il tuo assistente AI.</h3>
        <p class="company-hint">Prepara il file con descrizione, fatti, proposte, domande e metodo. Consegnalo al tuo assistente AI e importa la risposta nel formato richiesto: l’app la collegherà a questa versione del caso.</p>
        <p id="company-request-state" class="company-request-state"></p>
        <div class="company-actions"><button id="company-request-prepare" class="company-primary" type="button">Prepara la richiesta</button>
          <button id="company-import-return" type="button" disabled>Importa la risposta dell’AI</button></div>
        <input id="company-return-file" type="file" accept=".json,application/json" hidden>
        <details id="company-request-transfer" class="company-details" hidden><summary>Richiesta pronta da trasferire</summary>
          <p class="company-hint">La preparazione non invia dati. Puoi scaricare il file o copiare il contenuto completo.</p>
          <div class="company-actions"><a id="company-request-download" class="company-download" download>Scarica la richiesta JSON</a>
            <button id="company-request-copy" type="button">Copia il contenuto</button></div>
          <label for="company-request-json" class="sr-only">Contenuto completo della richiesta</label>
          <textarea id="company-request-json" class="company-json" rows="5" readonly spellcheck="false"></textarea></details>
        <details class="company-details" id="company-return-paste"><summary>Oppure incolla la risposta JSON</summary>
          <label for="company-return-json" class="sr-only">Risposta JSON dell’assistente AI</label>
          <textarea id="company-return-json" class="company-json" rows="4" maxlength="2000000" spellcheck="false" placeholder="Il risultato nel formato incluso nella richiesta"></textarea>
          <button id="company-return-paste-submit" type="button" disabled>Leggi la risposta</button></details>
        <p id="company-exchange-feedback" class="company-feedback" role="status" aria-live="polite"></p>
      </section>
      <section id="company-result" class="company-section" aria-labelledby="company-result-title" hidden>
        <p class="company-tag">RISPOSTA DELL’AI · DA VALUTARE</p>
        <h3 id="company-result-title" tabindex="-1">Il contributo dell’AI al tuo caso.</h3>
        <p id="company-result-origin" class="company-hint"></p><p id="company-result-summary"></p>
        <div id="company-result-observations"></div><div id="company-result-proposals"></div>
        <div id="company-result-questions"></div>
        <details class="company-details"><summary>Miglioramenti proposti e destinatari</summary><div id="company-result-returns"></div>
          <p class="company-hint">L’AI indica chi potrebbe usare ciò che il caso insegna: un reparto, un responsabile o una competenza del kernel. L’app conserva queste proposte; il destinatario dovrà valutarle e applicarle.</p></details>
        <details class="company-details"><summary>Documenti che l’AI dichiara di aver letto</summary><div id="company-result-sources"></div></details>
      </section>
      <details id="company-continuity-details" class="company-details"><summary>Ripresa e copia del lavoro</summary>
        <p id="company-persistence" class="company-hint" role="status"></p>
        <div class="company-actions"><button id="company-state-prepare" type="button" disabled>Prepara una copia del lavoro</button>
          <button id="company-state-import" type="button">Riprendi da file</button></div>
        <input id="company-state-file" type="file" accept=".json,application/json" hidden>
        <div id="company-state-transfer" hidden><div class="company-actions"><a id="company-state-download" class="company-download" download>Scarica il lavoro JSON</a>
          <button id="company-state-copy" type="button">Copia il lavoro</button></div>
          <label for="company-state-json" class="sr-only">Copia completa del lavoro</label><textarea id="company-state-json" class="company-json" rows="4" readonly spellcheck="false"></textarea></div>
        <p id="company-state-feedback" class="company-feedback" role="status" aria-live="polite"></p></details>
    </div>
    <p id="company-source-state" class="company-source-state" role="status" aria-live="polite">Lettura delle fonti di questa copia…</p>
    <button id="company-source-retry" type="button" class="company-link" hidden>Rileggi le fonti</button>`;
  $('experience').after(panel);

  let binding = null, bindingError = '', sourceLoading = true, opened = false;
  let selectedContext = COMPANY_CONTEXTS[0].id, mode = 'explore', origin = toggle;
  let dirty = false, busy = false, rowSerial = 0, fromCompany = false, hydrating = false;
  let preservedSourceRefs = [], linkedDesign = null;
  let preservedQuestions = [], hydratedQuestionText = null;
  const hydratedIdentity = new Map(), definitionState = new WeakMap();
  const downloadURLs = new Map();
  const store = await createCompanyStore({ getSourceBinding: () => binding });

  function say(id, message, error = false) {
    $(id).textContent = message; $(id).classList.toggle('is-error', error);
  }
  function paragraph(text, className) {
    const p = document.createElement('p'); p.textContent = text;
    if (className) p.className = className;
    return p;
  }
  function sourceLink(ref) {
    const p = document.createElement('p');
    let url;
    try { url = new URL(ref.reference); } catch { /* A document id can be useful without a URL. */ }
    if (url && ['https:', 'http:'].includes(url.protocol)) {
      const a = document.createElement('a'); a.textContent = `${ref.label || ref.reference} ↗`;
      a.href = url.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; p.append(a);
    } else p.textContent = ref.label || ref.reference || ref.sourceId;
    return p;
  }
  function contextSources(context) {
    return context.sources.map(ref => {
      const { path, ...source } = ref;
      const current = binding?.sources?.find(item => item.path === path);
      if (!current) return source;
      return { ...source, revision: current.revision,
        reference: `https://github.com/${binding.repository}/blob/${current.revision}/${path}` };
    });
  }
  function caseContext(id) {
    return COMPANY_CONTEXTS.find(context => context.id === id) || { id, label: id, sources: [] };
  }
  function pausePresentation() {
    if ($('play')?.getAttribute('aria-label') === 'Metti in pausa la presentazione') $('play').click();
  }
  function closeOtherSurfaces() {
    if (!$('product-workspace')?.hidden) window.KN_PRODUCT?.close();
    if (!$('focus-panel')?.hidden) $('focus-close')?.click();
  }
  function setOpen(value, invokingControl = toggle, restore = true) {
    opened = Boolean(value);
    if (opened) {
      origin = invokingControl; fromCompany = false;
      if ($('company-return-from-design')) $('company-return-from-design').hidden = true;
      pausePresentation(); closeOtherSurfaces();
    }
    panel.hidden = !opened; document.body.classList.toggle('company-open', opened);
    toggle.setAttribute('aria-expanded', String(opened));
    window.dispatchEvent(new Event('resize'));
    if (opened) {
      (mode === 'explore' && $('cvs-field-title') ? $('cvs-field-title') : $('company-title')).focus({ preventScroll: true });
      if (matchMedia('(max-width: 760px), (max-height: 640px)').matches) panel.scrollIntoView({ block: 'start' });
    } else if (restore) {
      (origin?.isConnected && origin.getClientRects().length ? origin : toggle).focus({ preventScroll: true });
    }
  }
  function setMode(next, focusDestination = true) {
    mode = next;
    $('company-explore').hidden = next !== 'explore'; $('company-workspace').hidden = next !== 'work';
    if (focusDestination) {
      const destination = next === 'work' ? $('company-case-label') : ($('cvs-field-title') || $('company-context-title'));
      destination.setAttribute('tabindex', next === 'work' ? '0' : '-1');
      destination.focus({ preventScroll: true }); destination.scrollIntoView({ block: 'nearest' });
    }
  }
  function showContext(id) {
    const context = contextById(id); selectedContext = id;
    for (const button of $('company-contexts').children) button.setAttribute('aria-pressed', String(button.dataset.context === id));
    for (const [element, key] of [['company-context-title', 'title'], ['company-question', 'question'], ['company-work', 'work'],
      ['company-people', 'people'], ['company-continuity', 'continuity'], ['company-capability', 'capability']]) $(element).textContent = context[key];
    $('company-design').hidden = !context.designEntry;
    $('company-sources').replaceChildren(...contextSources(context).map(sourceLink));
    $('company-return-paths').replaceChildren(...context.returns.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    $('company-public-signal').hidden = !context.publicSignal;
    $('company-public-signal-content').replaceChildren();
    if (context.publicSignal) $('company-public-signal-content').append(paragraph(context.publicSignal.text),
      sourceLink({ label: context.publicSignal.label, reference: context.publicSignal.url }),
      paragraph('Fonte pubblica che rende concreto il campo. Il caso in questa copia resta distinto dai sistemi e dai dati aziendali.', 'company-hint'));
    document.dispatchEvent(new CustomEvent('kn:company-context', { detail: { contextId: id, effect: 'presentation_only' } }));
  }
  for (const context of COMPANY_CONTEXTS) {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.context = context.id;
    button.textContent = context.label; button.setAttribute('aria-pressed', 'false');
    button.onclick = () => showContext(context.id); $('company-contexts').append(button);
    const option = document.createElement('option'); option.value = context.id; option.textContent = context.label;
    $('company-case-context').append(option);
  }

  function markDirty() {
    if (hydrating) return;
    dirty = true; say('company-save-feedback', 'Modifiche da conservare nel caso.'); render();
  }
  function definitionRow(definition = {}) {
    if ($('company-definitions').children.length >= 32) { say('company-save-feedback', 'Puoi aggiungere fino a 32 elementi a ogni revisione del caso.', true); return; }
    const row = document.createElement('fieldset'); row.className = 'company-definition'; row.dataset.definitionId = definition.id || crypto.randomUUID();
    const serial = ++rowSerial, prefix = `company-definition-${serial}`;
    const legend = document.createElement('legend'); legend.textContent = 'Elemento del caso'; row.append(legend);
    const label = (id, text) => { const l = document.createElement('label'); l.htmlFor = id; l.textContent = text; return l; };
    const kind = document.createElement('select'); kind.id = `${prefix}-kind`; kind.dataset.field = 'kind';
    for (const item of DEFINITION_KINDS) { const option = document.createElement('option'); option.value = item.id; option.textContent = item.label; kind.append(option); }
    kind.value = definition.kind || 'proposed'; row.append(label(kind.id, 'Stato della definizione'), kind);
    const text = document.createElement('textarea'); text.id = `${prefix}-text`; text.dataset.field = 'text'; text.rows = 2; text.maxLength = 2000; text.value = definition.text || '';
    row.append(label(text.id, 'Che cosa entra nel caso'), text);
    const reason = document.createElement('input'); reason.id = `${prefix}-reason`; reason.dataset.field = 'reason'; reason.maxLength = 1600; reason.value = definition.reason || '';
    row.append(label(reason.id, 'Ragione o provenienza'), reason);
    const actor = document.createElement('input'); actor.id = `${prefix}-actor`; actor.dataset.field = 'actor'; actor.maxLength = 200; actor.value = definition.actor || '';
    row.append(label(actor.id, 'Persona o fonte che lo dichiara'), actor);
    // A source association from a validated imported revision is preserved.
    row.dataset.sourceRef = definition.sourceRef || '';
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'company-link'; remove.textContent = 'Rimuovi questo elemento';
    remove.onclick = () => { row.remove(); markDirty(); $('company-add-definition').focus(); };
    row.append(remove); $('company-definitions').append(row);
    definitionState.set(row, { original: structuredClone(definition), displayed: { kind: kind.value, text: text.value, reason: reason.value, actor: actor.value } });
    return text;
  }
  function lines(id, limit, maxLength = 1600) {
    const items = $(id).value.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
    if (items.length > limit) throw new RangeError(`Usa fino a ${limit} righe in questo campo.`);
    if (items.some(item => item.length > maxLength)) throw new RangeError(`Ogni riga può contenere fino a ${maxLength} caratteri.`);
    return items;
  }
  function inputFromForm() {
    const context = caseContext($('company-case-context').value);
    const definitions = [...$('company-definitions').children].map(row => {
      const previous = definitionState.get(row);
      const get = key => {
        const value = row.querySelector(`[data-field="${key}"]`).value;
        return previous && key in previous.original && value === previous.displayed[key] ? previous.original[key] : value;
      };
      const text = get('text'); if (!text.trim()) return null;
      if (!get('reason').trim() || !get('actor').trim()) throw new Error('Ogni definizione compilata richiede ragione e persona o fonte che la dichiara.');
      return { id: row.dataset.definitionId, kind: get('kind'), text, reason: get('reason'), actor: get('actor'), sourceRef: row.dataset.sourceRef || null };
    }).filter(Boolean);
    const extraSources = lines('company-extra-sources', 24, 1200).map(reference => ({ id: `extra-${crypto.randomUUID()}`, label: reference.slice(0, 200),
      reference, owner: $('company-name').value.trim() || 'Fonte fornita dalla persona', revision: null, status: 'supplied_not_read' }));
    // An imported source is evidence with its own identity, not an editable
    // list position. Keep it and all existing definition links. A new source
    // revision receives a new id if its old id still identifies other bytes.
    const sourceRefs = preservedSourceRefs.map(ref => ({ ...ref }));
    // Owner method sources already live in sourceBinding/sourceInventory.
    // Revision sourceRefs contain supplied references, so a full valid imported
    // inventory can still be revised without hidden context-source additions.
    for (const ref of extraSources) {
      if (sourceRefs.some(item => item.reference === ref.reference && item.revision === ref.revision)) continue;
      const id = sourceRefs.some(item => item.id === ref.id) ? `${ref.id}-${crypto.randomUUID()}` : ref.id;
      sourceRefs.push({ ...ref, id });
    }
    if (sourceRefs.length > 24) throw new Error('Questa revisione può conservare fino a 24 fonti. I riferimenti già conservati restano integri; riduci le nuove aggiunte.');
    const identityValue = id => {
      const previous = hydratedIdentity.get(id), value = $(id).value;
      return previous && value === previous.displayed ? previous.original : value;
    };
    return { label: identityValue('company-case-label'), company: identityValue('company-name'),
      project: identityValue('company-project'), object: identityValue('company-object'),
      contextId: context.id, originalContribution: $('company-contribution').value, definitions, sourceRefs,
      questions: hydratedQuestionText !== null && $('company-questions').value === hydratedQuestionText ? [...preservedQuestions] : lines('company-questions', 24), linkedDesign };
  }
  function hydrate(snapshot) {
    if (!snapshot.case || !snapshot.revision) return;
    hydrating = true;
    const record = snapshot.case, revision = snapshot.revision;
    for (const [element, key] of [['company-case-label', 'label'], ['company-name', 'company'], ['company-project', 'project'], ['company-object', 'object']]) {
      const original = revision[key] ?? record[key] ?? '';
      $(element).value = original;
      hydratedIdentity.set(element, { original, displayed: $(element).value });
    }
    $('company-contribution').value = typeof record.originalContribution === 'string' ? record.originalContribution : record.originalContribution?.text || '';
    const contextId = revision.contextId || record.contextId || selectedContext;
    if (![...$('company-case-context').options].some(option => option.value === contextId)) {
      const option = document.createElement('option'); option.value = contextId; option.textContent = `${contextId} · contesto del file`; $('company-case-context').append(option);
    }
    $('company-case-context').value = contextId;
    $('company-definitions').replaceChildren();
    for (const def of revision.definitions || []) definitionRow(def);
    preservedSourceRefs = (revision.sourceRefs || []).map(ref => ({ ...ref }));
    linkedDesign = revision.linkedDesign ? structuredClone(revision.linkedDesign) : null;
    $('company-preserved-sources').replaceChildren();
    if (preservedSourceRefs.length) {
      $('company-preserved-sources').append(paragraph('Riferimenti già conservati', 'company-hint'), ...preservedSourceRefs.map(sourceLink));
    }
    $('company-extra-sources').value = '';
    preservedQuestions = [...(revision.questions || [])];
    $('company-questions').value = preservedQuestions.join('\n'); hydratedQuestionText = $('company-questions').value;
    if (COMPANY_CONTEXTS.some(context => context.id === contextId)) selectedContext = contextId;
    showContext(selectedContext);
    dirty = false; hydrating = false;
  }
  function offerDownload(key, data, filename) {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    if (downloadURLs.has(key)) URL.revokeObjectURL(downloadURLs.get(key));
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' })); downloadURLs.set(key, url);
    $(`company-${key}-download`).href = url; $(`company-${key}-download`).download = filename;
    $(`company-${key}-json`).value = text; $(`company-${key}-transfer`).hidden = false;
  }
  async function copyText(key, feedbackId) {
    const input = $(`company-${key}-json`);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(input.value); say(feedbackId, 'Contenuto completo copiato.');
    } catch {
      input.focus(); input.select(); say(feedbackId, 'Contenuto selezionato: usa il comando Copia del browser.');
    }
  }
  function renderList(id, heading, records, toText) {
    const container = $(id); container.replaceChildren();
    if (!records?.length) return;
    const title = document.createElement('h4'); title.textContent = heading;
    const list = document.createElement('ul');
    for (const item of records) { const li = document.createElement('li'); li.textContent = toText(item); list.append(li); }
    container.append(title, list);
  }
  function renderResult(result) {
    $('company-result').hidden = !result || dirty;
    if (!result) return;
    $('company-result-origin').textContent = `${result.receiver.name} · attribuzione dichiarata · ${result.created_at}`;
    $('company-result-summary').textContent = result.summary;
    renderList('company-result-observations', 'Osservazioni e fonti', result.observations, item => `${item.text}\n${item.reason}`);
    renderList('company-result-proposals', 'Proposte da valutare', result.proposals, item => `${item.text}\n${item.reason}`);
    renderList('company-result-questions', 'Domande che cambiano il seguito', result.questions, item => item);
    renderList('company-result-returns', 'Miglioramenti proposti', result.returnPaths, item => `${item.owner} · ${RETURN_LABELS[item.kind] || item.kind}\n${item.reason}\nUso successivo: ${item.nextUse}`);
    $('company-result-sources').replaceChildren(...(result.sourceReads || []).map(item => paragraph(`${item.sourceId}\n${item.reference}\nUso dichiarato: ${item.usedFor}`)));
  }
  function render() {
    const snapshot = store.snapshot(), exists = Boolean(snapshot.case), request = snapshot.request;
    $('company-resume').hidden = !exists;
    $('company-start').textContent = exists ? 'Apri il tuo caso' : 'Descrivi un caso di lavoro';
    $('company-contribution').readOnly = exists; $('company-original-hint').hidden = !exists; $('company-example').hidden = exists;
    $('company-save').textContent = exists ? 'Conserva la revisione' : 'Conserva il caso';
    $('company-save').disabled = busy || (exists && !dirty && snapshot.sourceStatus.state === 'current');
    $('company-case-status').textContent = exists ? 'CASO CONSERVATO QUI' : 'CASO LOCALE';
    $('company-case-summary').textContent = exists ? 'La descrizione iniziale resta disponibile. Salva una nuova revisione quando aggiungi fatti, proposte, decisioni o domande.' : 'Descrivi ciò che sai già del caso. Il team potrà aggiungere informazioni e precisare i requisiti durante il lavoro.';
    $('company-exchange').hidden = !exists;
    const sourceCurrent = snapshot.sourceStatus.state === 'current';
    $('company-request-prepare').disabled = busy || dirty || sourceLoading || !binding || !sourceCurrent;
    $('company-import-return').disabled = busy || dirty || !request || !sourceCurrent;
    $('company-return-paste-submit').disabled = busy || dirty || !request || !sourceCurrent;
    $('company-state-prepare').disabled = busy || !exists;
    $('company-state-import').disabled = busy;
    $('company-persistence').textContent = snapshot.persistence?.message || 'Il browser può conservare il caso su questo indirizzo. Puoi anche scaricarne una copia per riprenderlo altrove.';
    $('company-persistence').classList.toggle('is-error', ['failed', 'unavailable', 'error'].includes(snapshot.persistence?.state));
    $('company-request-state').textContent = !sourceCurrent && exists ? 'Le fonti del caso richiedono una nuova revisione prima di continuare. La storia precedente resta conservata.' : dirty ? 'Conserva le modifiche prima di continuare lo scambio.' : request
      ? `Richiesta attiva: ${request.id} · ${snapshot.result ? 'risposta conservata' : 'in attesa della risposta dell’AI'}.`
      : 'Il caso è pronto per formare una richiesta.';
    if (request && !dirty && sourceCurrent) offerDownload('request', request, `kernel-nautico-richiesta-${request.id}.json`);
    else $('company-request-transfer').hidden = true;
    renderResult(sourceCurrent ? snapshot.result : null);
    say('company-source-state', sourceLoading ? 'Lettura delle fonti di questa copia…' : bindingError
      ? `Fonti della copia non disponibili: ${bindingError}` : 'La richiesta può includere il metodo e i riferimenti disponibili in questa versione del kernel.', Boolean(bindingError));
    $('company-source-retry').hidden = !bindingError;
  }
  async function loadBinding() {
    sourceLoading = true; bindingError = ''; render();
    try {
      const response = await fetch(BINDING_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`lettura HTTP ${response.status}`);
      binding = checkCompanySourceBinding(await response.json());
      await store.refresh();
    } catch (error) { binding = null; bindingError = error.message; }
    sourceLoading = false; showContext(selectedContext); render();
  }
  async function run(action, feedbackId = 'company-exchange-feedback') {
    if (busy) return;
    busy = true; render();
    try { await action(); } catch (error) { say(feedbackId, error.message || 'Il passaggio non è riuscito.', true); }
    finally { busy = false; render(); }
  }
  async function readJSON(file) {
    if (!file) return null;
    if (file.size > MAX_FILE_BYTES) throw new Error('Il file supera la dimensione gestita da questa copia.');
    return JSON.parse(await file.text());
  }
  async function acceptResult(json) {
    await store.importReturn(json); $('company-return-json').value = '';
    say('company-exchange-feedback', 'La risposta dell’AI è stata collegata alla richiesta e salvata. Puoi ora valutarne le proposte.');
    render(); $('company-result-title').focus({ preventScroll: true }); $('company-result-title').scrollIntoView({ block: 'nearest' });
  }

  toggle.onclick = () => setOpen(!opened);
  $('company-close').onclick = () => setOpen(false);
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setOpen(false); }
  });
  $('company-back').onclick = () => setMode('explore');
  $('company-start').onclick = () => {
    if (!store.snapshot().case && !dirty) $('company-case-context').value = selectedContext;
    setMode('work');
  };
  $('company-resume').onclick = () => setMode('work');
  $('company-example').onclick = () => {
    const context = contextById($('company-case-context').value);
    if ($('company-contribution').value.trim()) { say('company-save-feedback', 'Il tuo testo è già presente. L’esempio non lo sostituisce.'); return; }
    $('company-case-label').value ||= context.sampleTitle;
    $('company-contribution').value = `Esempio illustrativo.\n${context.sample}`;
    $('company-questions').value ||= context.sampleQuestion;
    markDirty(); say('company-save-feedback', 'Esempio illustrativo inserito: puoi modificarlo prima di conservarlo.');
  };
  $('company-add-definition').onclick = () => { const input = definitionRow(); markDirty(); input?.focus(); };
  $('company-case-form').addEventListener('input', markDirty);
  $('company-case-form').addEventListener('change', markDirty);
  $('company-case-form').onsubmit = event => {
    event.preventDefault();
    run(async () => {
      const input = inputFromForm();
      if (store.snapshot().case) { delete input.originalContribution; await store.revise(input); }
      else await store.capture(input);
      hydrate(store.snapshot()); say('company-save-feedback', 'Il caso è stato salvato con la descrizione iniziale e gli aggiornamenti che hai aggiunto.');
      render(); $('company-exchange-title').setAttribute('tabindex', '-1'); $('company-exchange-title').focus({ preventScroll: true });
      $('company-exchange-title').scrollIntoView({ block: 'nearest' });
    }, 'company-save-feedback');
  };
  $('company-request-prepare').onclick = () => run(async () => {
    const snapshot = store.snapshot();
    const contextId = snapshot.revision.contextId;
    const contextMethod = COMPANY_CONTEXTS.some(context => context.id === contextId) ? methodForContext(contextId)
      : `Contesto dichiarato nel caso: ${contextId}. Forma il contributo dal metodo incluso e dalle fonti effettivamente pertinenti; il contesto non impone una sequenza.`;
    const request = await store.prepareRequest({ ...COMPANY_METHOD, contextId, contextMethod });
    offerDownload('request', request, `kernel-nautico-richiesta-${request.id}.json`);
    $('company-request-transfer').open = true;
    say('company-exchange-feedback', 'La richiesta è pronta. Scaricala o copiala e consegnala al tuo assistente AI.');
  });
  $('company-import-return').onclick = () => $('company-return-file').click();
  $('company-return-file').onchange = () => run(async () => {
    const file = $('company-return-file').files[0]; $('company-return-file').value = '';
    const json = await readJSON(file); if (json) await acceptResult(json);
  });
  $('company-return-paste-submit').onclick = () => run(async () => {
    if (!$('company-return-json').value.trim()) throw new Error('Incolla la risposta JSON dell’assistente AI.');
    await acceptResult(JSON.parse($('company-return-json').value));
  });
  $('company-request-copy').onclick = () => copyText('request', 'company-exchange-feedback');
  $('company-request-download').onclick = () => say('company-exchange-feedback', 'Download richiesto al browser. Verifica il file scaricato; il contenuto completo resta disponibile qui.');
  $('company-state-prepare').onclick = () => run(async () => {
    offerDownload('state', await store.exportState(), 'kernel-nautico-caso-aziendale.json');
    say('company-state-feedback', 'Copia pronta con storia del caso e scambi conservati.');
  }, 'company-state-feedback');
  $('company-state-copy').onclick = () => copyText('state', 'company-state-feedback');
  $('company-state-download').onclick = () => say('company-state-feedback', 'Download richiesto al browser. Verifica il file scaricato; puoi anche copiare il contenuto.');
  $('company-state-import').onclick = () => $('company-state-file').click();
  $('company-state-file').onchange = () => run(async () => {
    const file = $('company-state-file').files[0]; $('company-state-file').value = '';
    const json = await readJSON(file); if (!json) return;
    if (dirty) throw new Error('Conserva le modifiche del caso prima di riprendere un altro file.');
    await store.importState(json); hydrate(store.snapshot());
    say('company-state-feedback', 'Lavoro ripreso dal file e verificato rispetto alla storia conosciuta in questa copia.');
  }, 'company-state-feedback');
  $('company-source-retry').onclick = () => loadBinding();

  // A deliberate bridge to the already exercised design workspace. The company
  // selector itself never moves the Focus controller or changes a contribution.
  const returnButton = document.createElement('button'); returnButton.type = 'button'; returnButton.id = 'company-return-from-design';
  returnButton.className = 'company-return-from-design'; returnButton.textContent = '← Torna al contesto di lavoro'; returnButton.hidden = true;
  $('product-title')?.parentElement.append(returnButton);
  function returnFromDesign() {
    if (!fromCompany) return;
    fromCompany = false; returnButton.hidden = true; setOpen(true, toggle); setMode('explore', false);
    const destination = $('company-design').getClientRects().length ? $('company-design') : $('company-context-title');
    if (destination.tagName !== 'BUTTON') destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
  }
  $('company-design').onclick = () => {
    setOpen(false, toggle, false); fromCompany = true; returnButton.hidden = false; window.KN_PRODUCT?.open();
  };
  returnButton.onclick = returnFromDesign;
  $('product-close')?.addEventListener('click', returnFromDesign);
  $('product-workspace')?.addEventListener('keydown', event => { if (event.key === 'Escape') returnFromDesign(); });
  for (const id of ['product-toggle', 'focus-toggle', 'focus-anchor']) $(id)?.addEventListener('click', () => {
    fromCompany = false; returnButton.hidden = true;
    if (opened) setOpen(false, $(id), false);
  });

  store.subscribe(render);
  hydrate(store.snapshot()); showContext(selectedContext); setMode(mode, false); render();
  await loadBinding();
  window.KN_COMPANY = Object.freeze({
    open: () => setOpen(true), close: () => setOpen(false), snapshot: () => store.snapshot(),
    context: () => selectedContext, contexts: () => COMPANY_CONTEXTS.map(({ id, label }) => ({ id, label })),
    selectContext: id => showContext(id), exportState: () => store.exportState(),
    openCase: () => { setOpen(true); (store.snapshot().case ? $('company-resume') : $('company-start')).click(); },
    openContext: id => { showContext(id); setMode('explore', false); setOpen(true); },
  });
  return { open: () => setOpen(true), snapshot: () => store.snapshot() };
}
