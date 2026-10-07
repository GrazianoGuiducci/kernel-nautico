import { SCENES, TOTAL_SECONDS, LEARNING, FIELD_SESSION } from './content.js';
import { caseView, caseFingerprint, prepareProjection, validateProjectionWork, canonical } from './model.js';

const $ = id => document.getElementById(id);
const el = (tag, text, className = '') => { const n = document.createElement(tag); n.textContent = text; n.className = className; return n; };
const list = items => { const ul = document.createElement('ul'); for (const item of items) ul.append(el('li', item)); return ul; };
const TYPES = { observed: 'Osservato', proposed: 'Proposto', decided: 'Decisione dichiarata', open: 'Aperto',
  state: 'Stato del caso', correction: 'Correzione', 'reusable-method': 'Metodo riusabile', 'owner-interface': 'Passaggio tra responsabili', unknown: 'Da qualificare', routing: 'Accesso alle conoscenze' };
function card(title, text, eyebrow = '') {
  const c = el('article', '', 'en-card'); if (eyebrow) c.append(el('p', eyebrow, 'en-kicker'));
  c.append(el('h3', title)); if (text) c.append(el('p', text)); return c;
}
function details(title, text) { const d = document.createElement('details'); d.append(el('summary', title), el('p', text)); return d; }

export function mountEncounter() {
  const company = window.KN_COMPANY;
  // Reuse the existing user-facing presentation controls, never the test-only API
  // or a copied timeline. Their action remains illustrative navigation.
  const presentation = {
    showAct: id => document.querySelector(`#acts [data-act="${id}"]`)?.click(),
    pause: () => { if ($('play').getAttribute('aria-label') === 'Metti in pausa la presentazione') $('play').click(); },
    state: () => ({ fallback: document.body.classList.contains('static-fallback') }),
  };
  if (!company || !$('acts') || !$('company-start') || !$('company-resume')) throw new Error('Il primo incontro richiede il caso e la presentazione originali.');
  const css = el('link', ''); css.rel = 'stylesheet'; css.href = './src/encounter/panel.css'; document.head.append(css);
  const launch = el('button', '← Presentazione', 'en-launch'); launch.id = 'encounter-launch'; launch.type = 'button'; document.body.append(launch);
  const root = el('section', '', 'en-root'); root.id = 'encounter'; root.hidden = true;
  root.setAttribute('aria-label', 'Primo incontro con Kernel Nautico');
  root.innerHTML = `
    <div class="en-navigation" aria-label="Primo incontro">
      <button data-en-view="story" aria-pressed="true">Scopri Kernel Nautico</button>
      <button data-en-view="case" aria-pressed="false">Il tuo lavoro</button>
      <button data-en-view="learning" aria-pressed="false">Come impara il kernel</button>
      <button data-en-view="session" aria-pressed="false">Collaborare</button>
      <button id="en-explore" class="en-explore">Esplora il lavoro in azienda ↗</button>
    </div>
    <div id="en-scroll" class="en-scroll">
      <section id="en-story" aria-labelledby="en-story-title">
        <div class="en-story-copy"><p class="en-kicker">KERNEL NAUTICO · AI AL LAVORO CON IL TEAM</p>
          <h1 id="en-story-title" tabindex="-1"></h1><p id="en-story-text" class="en-lead"></p>
          <p id="en-change" class="en-change"></p>
          <div class="en-actions"><button id="en-work" class="en-primary">Descrivi un caso di lavoro ↗</button><button id="en-how">Vedi come il kernel impara</button></div>
        </div>
        <div class="en-story-visual"><div id="en-carrier"></div><div class="en-scene-caption"><p class="en-kicker">CHI PARTECIPA AL LAVORO SULLO YACHT</p><div id="en-roles" class="en-roles"></div>
          <details><summary>Che cosa mostra questo prototipo</summary><p id="en-detail"></p>
          <p>Puoi provare il caso aziendale e il progetto di poppa da «Il tuo lavoro». Il modello 3D e le tavole sono illustrativi; le scene descrivono applicazioni da sviluppare con l’azienda.</p></details></div></div>
      </section>
      <section id="en-case" class="en-reading" hidden aria-labelledby="en-case-title"><p class="en-kicker">IL TUO CASO · RICHIESTE, PROPOSTE E DECISIONI</p>
        <h2 id="en-case-title" tabindex="-1"></h2><p id="en-case-meta" class="en-muted"></p>
        <div class="en-actions"><button id="en-edit" class="en-primary">Apri il caso e continua ↗</button><button id="en-project">Apri il progetto di poppa ↗</button></div>
        <div id="en-case-cards" class="en-grid"></div>
        <details id="en-projection"><summary>Prepara un metodo da riutilizzare in altri casi</summary>
          <p>Descrivi che cosa hai imparato e come dovrebbe cambiare il lavoro. Il file da condividere conterrà solo il testo che scrivi qui; una bozza separata conserverà il collegamento al caso privato.</p>
          <form id="en-projection-form" class="en-form">
            <div class="en-form-pair"><label>Destinazione del contenuto<select id="en-scope"><option value="company_private">Uso riservato in azienda</option><option value="public_candidate">Proposta per un progetto pubblico</option></select></label>
            <label>Che cosa cambia<select id="en-kind"><option value="reusable-method">Metodo riusabile</option><option value="owner-interface">Passaggio tra responsabili</option><option value="routing">Accesso alle conoscenze</option></select></label></div>
            <label>Reparto, ruolo o competenza destinataria<input id="en-owner" maxlength="240" required placeholder="Es. assistenza, responsabile di progetto, metodo dell’AI"></label>
            <label>Titolo del miglioramento<input id="en-title" maxlength="160" required></label>
            <label>Come dovrà cambiare il metodo di lavoro<textarea id="en-method" rows="3" maxlength="4000" required></textarea></label>
            <div class="en-form-pair"><label>Perché serve<textarea id="en-reason" rows="2" maxlength="1600" required></textarea></label><label>In quali situazioni usare questo metodo<textarea id="en-next" rows="2" maxlength="1600" required></textarea></label></div>
            <label>Condizioni, limiti e ciò che resta da verificare<textarea id="en-limits" rows="2" maxlength="1600" required></textarea></label>
            <label class="en-check"><input id="en-reviewed" type="checkbox" required>Ho controllato il testo esatto per questa destinazione. Non contiene dati che non devo trasferire.</label>
            <p class="en-muted">L’app include nel file tutti i dati che scrivi in questi campi e non li anonimizza. Il controllo spetta a te. Preparare o scaricare la proposta non la pubblica e non modifica il metodo del destinatario.</p>
            <div class="en-actions"><button class="en-primary" type="submit">Prepara la proposta di metodo</button><button id="en-restore-draft" type="button">Riprendi bozza locale</button></div>
            <input id="en-draft-file" type="file" accept=".json,application/json" hidden>
          </form>
          <p id="en-projection-status" role="status" aria-live="polite"></p>
          <div id="en-projection-ready" hidden><label for="en-projection-json">Contenuto della proposta da condividere</label><textarea id="en-projection-json" readonly rows="8" spellcheck="false"></textarea>
            <div class="en-actions"><a id="en-candidate-download" class="en-primary" download>Scarica la proposta JSON</a><a id="en-local-download" download>Conserva la bozza locale RISERVATA</a></div>
            <p class="en-muted">La bozza riservata serve a riprendere la proposta su questo stesso caso e contiene riferimenti privati. Conserva la bozza per te; il destinatario dovrà valutare e applicare la proposta separatamente.</p></div>
        </details>
      </section>
      <section id="en-learning" class="en-reading" hidden aria-labelledby="en-learning-title"><p class="en-kicker">APPRENDIMENTO DI KERNEL NAUTICO</p>
        <h2 id="en-learning-title" tabindex="-1"></h2><p class="en-lead">Il team aggiorna le competenze del kernel a partire dall’esperienza. L’AI può così affrontare un caso successivo usando il metodo che il lavoro precedente ha migliorato.</p>
        <div id="en-learning-cards" class="en-grid"></div><h3>Un caso diverso: l’alternativa di un fornitore</h3><p id="en-learning-case"></p><div id="en-learning-paths" class="en-grid"></div><p class="en-muted">Il caso del componente alternativo illustra come distribuire il lavoro fra reparti. La pagina non avvia una nuova elaborazione AI.</p>
        <details><summary>Come leggere questo esempio</summary><p>L’esempio mostra una differenza riusabile nel metodo. Una prova con un ricevente reale deve documentare richiesta, fonti e risultato separatamente.</p><a href="./encounter/LEARNING.md" target="_blank" rel="noopener">Leggi il metodo di apprendimento ↗</a></details>
        <div class="en-note"><h3>Il metodo si può condividere separatamente dal caso.</h3><p>Nel tuo caso puoi scrivere una proposta di miglioramento per un reparto o una competenza del kernel. Scegli quali informazioni condividere e conserva separatamente i riferimenti privati; la pubblicazione richiede una decisione distinta.</p><button id="en-to-projection" class="en-primary">Torna al tuo caso</button></div>
      </section>
      <section id="en-session" class="en-reading" hidden aria-labelledby="en-session-title"><p class="en-kicker">KERNEL NAUTICO · INCONTRO CON L’AZIENDA</p>
        <h2 id="en-session-title" tabindex="-1"></h2><p id="en-session-intro" class="en-lead"></p><div id="en-session-cards" class="en-grid en-three"></div>
        <div class="en-note"><h3>Una collaborazione parte da un caso del vostro team.</h3><p>Il team può scegliere un’esigenza concreta del proprio contesto nautico. Con ogni azienda, il lavoro comune definirà le competenze necessarie e i collegamenti con i suoi documenti, processi e sistemi.</p>
          <div class="en-actions"><a href="./encounter/COLLABORATION.md" target="_blank" rel="noopener" class="en-primary">Esplora la collaborazione ↗</a><a href="./public-receiver/START.md" target="_blank" rel="noopener">Istruzioni per provare il kernel con una nuova AI ↗</a></div>
          <p class="en-muted">Il documento presenta una possibilità di collaborazione. I collegamenti aprono documenti; l’app non invia richieste di contatto.</p></div>
      </section>
    </div>
    <div id="en-story-controls" class="en-story-controls"><div id="en-steps" class="en-steps" aria-label="Passaggi del racconto"></div>
      <div class="en-transport"><button id="en-play">Pausa</button><button id="en-restart">Ricomincia</button><span id="en-clock"></span><span class="en-muted">Racconto illustrativo · puoi interromperlo ed esplorare</span></div></div>
    <p id="en-live" class="sr-only" role="status" aria-live="polite"></p>`;
  document.body.append(root);
  let active = false, view = 'story', index = 0, elapsed = 0, playing = false, last = 0, frame = 0;
  let draft = null, draftSignature = '', urls = [];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const oldFooter = document.querySelector('body > footer');
  // Move the existing visual carrier, not its product identity or source of state.
  // Normal flow keeps it readable on short/narrow surfaces without another canvas.
  const carriers = ['stage', 'fallback'].map(id => ({ node: $(id), parent: $(id).parentNode, next: $(id).nextSibling }));
  function placeCarrier(inStory) {
    for (const { node, parent, next } of carriers) {
      if (inStory) $('en-carrier').append(node);
      else parent.insertBefore(node, next?.parentNode === parent ? next : null);
    }
  }
  const oldChildren = [...$('experience').children].filter(n => !['stage', 'fallback', 'loading'].includes(n.id));
  const fields = { scope: 'en-scope', kind: 'en-kind', owner: 'en-owner', title: 'en-title', method: 'en-method', reason: 'en-reason', nextUse: 'en-next', limits: 'en-limits' };
  const values = () => ({ ...Object.fromEntries(Object.entries(fields).map(([key, id]) => [key, $(id).value])), reviewed: $('en-reviewed').checked });
  function revoke() { urls.forEach(URL.revokeObjectURL); urls = []; $('en-projection-ready').hidden = true; }
  function discardReview(message = '') { draft = null; draftSignature = ''; $('en-reviewed').checked = false; revoke(); $('en-projection-status').textContent = message; }
  function linkFile(id, value, name) { const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2) + '\n'], { type: 'application/json' })); urls.push(url); $(id).href = url; $(id).download = name; }
  function showDraft(work) {
    revoke(); draft = work; draftSignature = canonical(values());
    $('en-projection-json').value = JSON.stringify(work.candidate, null, 2);
    linkFile('en-candidate-download', work.candidate, `kn-candidato-${work.candidate.id}.json`);
    linkFile('en-local-download', work, `kn-bozza-RISERVATA-${work.candidate.id}.json`);
    $('en-projection-ready').hidden = false;
    $('en-projection-status').textContent = 'La proposta di metodo è pronta da scaricare. L’app non ha inviato dati né modificato il lavoro del destinatario.';
  }
  async function verifyDraft() {
    if (!draft) return;
    try { await validateProjectionWork(company.snapshot(), draft); }
    catch (error) { discardReview(error.message); }
  }
  function timeUI() {
    $('en-play').textContent = playing ? 'Pausa' : 'Riprendi'; $('en-play').setAttribute('aria-pressed', String(playing));
    const total = SCENES.slice(0, index).reduce((n, s) => n + s.seconds, 0) + elapsed;
    $('en-clock').textContent = `${Math.floor(total).toString().padStart(2, '0')} / ${TOTAL_SECONDS} s`;
  }
  function pause() { playing = false; cancelAnimationFrame(frame); last = 0; timeUI(); }
  function showScene(n, manual = false) {
    index = Math.max(0, Math.min(SCENES.length - 1, n)); elapsed = 0;
    if (manual) pause();
    const scene = SCENES[index];
    $('en-story-title').textContent = scene.title; $('en-story-text').textContent = scene.text;
    $('en-change').textContent = scene.change; $('en-detail').textContent = scene.detail;
    $('en-roles').replaceChildren(...scene.roles.map((role, i) => el('span', role, i === 1 ? 'en-role central' : 'en-role')));
    for (const b of $('en-steps').children) b.setAttribute('aria-pressed', String(Number(b.dataset.scene) === index));
    presentation.showAct(scene.act); timeUI();
    if (manual) $('en-live').textContent = `${scene.label}. ${scene.title.replace('\n', ' ')}`;
  }
  function tick(now) {
    if (!playing || !active || view !== 'story') return;
    elapsed += last ? Math.min((now - last) / 1000, .2) : 0; last = now;
    if (elapsed >= SCENES[index].seconds) {
      if (index === SCENES.length - 1) { elapsed = SCENES[index].seconds; pause(); return; }
      showScene(index + 1);
    }
    timeUI(); frame = requestAnimationFrame(tick);
  }
  function play() { if (index === SCENES.length - 1 && elapsed >= SCENES[index].seconds) showScene(0); playing = true; last = 0; timeUI(); frame = requestAnimationFrame(tick); }
  function showView(next, moveFocus = false) {
    if (!['story', 'case', 'learning', 'session'].includes(next)) return;
    pause(); view = next; root.dataset.view = next;
    for (const id of ['story', 'case', 'learning', 'session']) $(`en-${id}`).hidden = id !== next;
    for (const button of root.querySelectorAll('[data-en-view]')) button.setAttribute('aria-pressed', String(button.dataset.enView === next));
    $('en-story-controls').hidden = next !== 'story'; $('en-scroll').scrollTop = 0;
    placeCarrier(active && next === 'story');
    document.body.classList.toggle('en-reading-mode', next !== 'story');
    if (next === 'case') renderCase();
    if (next === 'story') showScene(index);
    if (moveFocus) $(`en-${next}-title`).focus({ preventScroll: true });
    window.dispatchEvent(new Event('resize'));
  }
  function open(next = view) {
    company.close(); window.KN_PRODUCT?.close(); if (!$('focus-panel')?.hidden) $('focus-close')?.click();
    active = true; root.hidden = false; launch.hidden = true;
    document.body.classList.add('encounter-on');
    oldFooter.inert = true; oldChildren.forEach(n => n.inert = true);
    presentation.pause(); showView(next, true);
  }
  function close() {
    pause(); active = false; placeCarrier(false); root.hidden = true; launch.hidden = false;
    document.body.classList.remove('encounter-on', 'en-reading-mode');
    oldFooter.inert = false; oldChildren.forEach(n => n.inert = false);
    window.dispatchEvent(new Event('resize'));
  }
  function editCase() { close(); company.open(); (company.snapshot().case ? $('company-resume') : $('company-start')).click(); }
  function renderCase() {
    const v = caseView(company.snapshot()); $('en-case-title').textContent = v.title;
    const cards = $('en-case-cards'); cards.replaceChildren(); $('en-projection').hidden = v.empty;
    if (v.empty) {
      $('en-case-meta').textContent = 'Non hai ancora aperto un caso. Puoi iniziare descrivendo un’esigenza, un problema o una proposta.';
      cards.append(card('Descrivi il lavoro che vuoi affrontare.', 'Il caso raccoglie la tua descrizione, le informazioni disponibili e le domande. Puoi aggiungere dettagli e chiedere un contributo all’AI mentre il lavoro prosegue.', 'PRIMO CONTRIBUTO'));
      return;
    }
    $('en-case-meta').textContent = `Revisione ${v.revisionNumber} · ${v.current ? 'il caso usa le fonti correnti' : 'le fonti sono cambiate; occorre aggiornare il caso'} · ${v.sourceCount} riferimenti associati al caso`;
    cards.append(card('La tua descrizione iniziale', v.original, 'CONSERVATO · NON RISCRITTO'));
    const definitions = card('La comprensione attuale', '', 'FATTI, PROPOSTE E DECISIONI REGISTRATE');
    if (!v.definitions.length) definitions.append(el('p', 'Puoi aggiungere fatti, proposte, decisioni e domande mentre il caso evolve.'));
    for (const def of v.definitions) {
      const d = el('div', '', 'en-definition'); d.append(el('span', TYPES[def.kind] || def.kind, 'en-badge'), el('p', def.text));
      d.append(details('Ragione e attribuzione', `${def.reason || 'Ragione non dichiarata'} · ${def.actor || 'Attribuzione locale'}`)); definitions.append(d);
    }
    if (v.questions.length) definitions.append(el('h4', 'Ciò che resta aperto'), list(v.questions)); cards.append(definitions);
    const received = card(v.result ? 'La risposta dell’assistente AI' : 'Il lavoro può continuare', '', v.result ? 'RISPOSTA IMPORTATA · DA VALUTARE' : 'NESSUNA RISPOSTA CORRENTE');
    if (v.result) {
      received.append(el('p', v.result.summary));
      for (const [heading, rows] of [['Osservazioni', v.result.observations], ['Proposte', v.result.proposals]]) {
        if (!rows?.length) continue;
        const d = document.createElement('details'); d.append(el('summary', `${heading} · ${rows.length}`));
        for (const row of rows) d.append(el('p', row.text), el('p', row.reason || '', 'en-muted')); received.append(d);
      }
    } else received.append(el('p', v.current ? 'Apri il caso, prepara una richiesta e consegnala al tuo assistente AI. Dopo aver importato la sua risposta, potrai leggerla qui insieme alla richiesta originale.' : 'La risposta precedente riguarda una versione diversa del caso. Apri il caso e aggiorna le informazioni prima di preparare una nuova richiesta.'));
    cards.append(received);
    const returns = card('Chi deve proseguire il lavoro', '', 'RESPONSABILI E MIGLIORAMENTI PROPOSTI');
    if (!v.result?.returnPaths?.length) returns.append(el('p', 'La risposta dell’AI potrà indicare quali persone, reparti o competenze devono partecipare al seguito del caso.'));
    for (const item of v.result?.returnPaths || []) {
      const c = el('div', '', 'en-return'); c.append(el('span', TYPES[item.kind] || item.kind, 'en-badge'), el('h4', item.owner), el('p', item.reason), el('p', item.nextUse, 'en-muted'), el('small', 'Proposta da valutare con il destinatario')); returns.append(c);
    }
    cards.append(returns); verifyDraft();
  }
  for (const [i, scene] of SCENES.entries()) {
    const b = el('button', `${String(i + 1).padStart(2, '0')}  ${scene.label}`); b.type = 'button'; b.dataset.scene = i;
    b.onclick = () => showScene(i, true); $('en-steps').append(b);
  }
  $('en-learning-title').textContent = LEARNING.title; $('en-learning-case').textContent = LEARNING.newCase;
  $('en-learning-cards').append(card('Come il kernel lavorava prima', LEARNING.before, 'METODO PRECEDENTE'), card('Perché il metodo è cambiato', LEARNING.difference, 'CHE COSA HA INSEGNATO IL CASO'), card('Come il kernel affronta il caso successivo', LEARNING.after, 'METODO AGGIORNATO NEL KERNEL'));
  for (const [owner, method] of LEARNING.paths) $('en-learning-paths').append(card(owner, method, 'CONTRIBUTO DISTINTO'));
  $('en-session-title').textContent = FIELD_SESSION.title; $('en-session-intro').textContent = FIELD_SESSION.introduction;
  for (const [title, items] of [['Chi sviluppa Kernel Nautico porta', FIELD_SESSION.bring], ['L’azienda porta', FIELD_SESSION.company], ['Il lavoro comune può produrre', FIELD_SESSION.together]]) { const c = card(title); c.append(list(items)); $('en-session-cards').append(c); }
  for (const b of root.querySelectorAll('[data-en-view]')) b.onclick = () => showView(b.dataset.enView);
  launch.onclick = () => open(); $('en-work').onclick = editCase; $('en-edit').onclick = editCase;
  $('en-how').onclick = () => showView('learning', true); $('en-to-projection').onclick = () => showView('case', true);
  $('en-project').onclick = () => { close(); window.KN_PRODUCT?.open(); };
  $('en-explore').onclick = () => { close(); company.open(); };
  $('en-play').onclick = () => playing ? pause() : play(); $('en-restart').onclick = () => { pause(); showScene(0); if (!motion.matches) play(); };
  root.addEventListener('keydown', e => { if (e.key === 'Escape' && e.target.tagName !== 'TEXTAREA') { close(); launch.focus(); } });
  $('en-projection-form').addEventListener('input', e => { if (e.target.id !== 'en-reviewed') discardReview('Hai cambiato il testo: controlla di nuovo la proposta prima di condividerla.'); });
  $('en-projection-form').onsubmit = async e => {
    e.preventDefault(); const form = values(), snapshot = company.snapshot();
    try {
      if (draft && draftSignature === canonical(form)) { await validateProjectionWork(snapshot, draft); return; }
      const work = await prepareProjection(snapshot, form);
      if (canonical(values()) !== canonical(form) || await caseFingerprint(company.snapshot()) !== work.localReceipt.origin.caseDigest)
        throw new Error('Il testo o il caso è cambiato durante la preparazione. Controlla la nuova situazione.');
      showDraft(work);
    } catch (error) { discardReview(error.message); }
  };
  $('en-restore-draft').onclick = () => $('en-draft-file').click();
  $('en-draft-file').onchange = async e => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      if (file.size > 80000) throw new Error('Bozza troppo grande.');
      const work = await validateProjectionWork(company.snapshot(), await file.text());
      for (const [key, id] of Object.entries(fields)) $(id).value = work.candidate[key];
      $('en-reviewed').checked = true; showDraft(work);
      $('en-projection-status').textContent = 'La bozza è stata ripresa sullo stesso caso. Il controllo del testo è quello dichiarato da te; l’app non certifica chi lo ha effettuato.';
    } catch (error) { discardReview(error.message); }
    e.target.value = '';
  };
  for (const id of ['en-candidate-download', 'en-local-download']) $(id).onclick = async e => {
    e.preventDefault();
    try {
      if (!draft || draftSignature !== canonical(values())) throw new Error('Controlla e prepara il testo corrente.');
      const selected = draft, entering = canonical({ case: company.snapshot().case, sourceStatus: company.snapshot().sourceStatus });
      await validateProjectionWork(company.snapshot(), selected);
      if (draft !== selected || draftSignature !== canonical(values()) || entering !== canonical({ case: company.snapshot().case, sourceStatus: company.snapshot().sourceStatus }))
        throw new Error('Il caso è cambiato prima del download. Prepara una proposta aggiornata.');
      const link = document.createElement('a'); link.href = $(id).href; link.download = $(id).download;
      link.hidden = true; document.body.append(link); link.click(); link.remove();
    } catch (error) { discardReview(error.message); }
  };
  // The working surface owns edits. Returning here reads its current snapshot.
  // Transfer revalidates the source again; no second case store or polling loop.
  addEventListener('focus', () => { if (active && view === 'case') renderCase(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  motion.addEventListener('change', e => { if (e.matches) pause(); });
  addEventListener('pagehide', () => { pause(); revoke(); });
  window.KN_ENCOUNTER = Object.freeze({ open, close, state: () => ({ active, view, scene: SCENES[index].id, playing, source: 'company_store_view' }) });
  if (!new URLSearchParams(location.search).has('legacy')) {
    open('story'); if (!motion.matches && !new URLSearchParams(location.search).has('test') && !presentation.state().fallback) play();
  }
}
