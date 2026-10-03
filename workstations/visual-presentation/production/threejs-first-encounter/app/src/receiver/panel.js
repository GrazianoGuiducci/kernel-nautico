import { createReceiver, sourceURL } from './contract.js';
/** Optional file-based exchange. The page never pretends to contact a model. */
export function mountReceiver(focus) {
  const css = document.createElement('link'); css.rel = 'stylesheet';
  css.href = new URL('./panel.css', import.meta.url).href; document.head.append(css);
  const box = document.createElement('details'); box.id = 'receiver-panel';
  box.innerHTML = `<summary>Domanda sul focus · passaggio AI</summary>
    <p>Nessun modello collegato alla pagina. Esporta il contesto per un assistente reale e importa la sua risposta.</p>
    <label for="receiver-question">Domanda sull’elemento selezionato</label>
    <textarea id="receiver-question" maxlength="1000" rows="2">Cosa manca qui?</textarea>
    <button id="receiver-export" type="button">Esporta domanda</button>
    <label for="receiver-import">Importa la risposta JSON dell’assistente</label>
    <input id="receiver-import" type="file" accept=".json,application/json">
    <p id="receiver-status" role="status" aria-live="polite"></p>
    <div id="receiver-answer" hidden><p id="receiver-origin"></p><p id="receiver-answer-text"></p>
      <details><summary>Fonti lette e limiti della risposta</summary><div id="receiver-sources"></div><ul id="receiver-unknowns"></ul></details>
      <button id="receiver-show" type="button">Mostra collegamento</button><p id="receiver-reason"></p></div>`;
  document.getElementById('focus-panel').append(box);
  const $ = id => document.getElementById(id), controller = createReceiver(focus.snapshot, focus.select);
  function render() {
    const s = controller.snapshot(), r = s.result;
    $('receiver-answer').hidden = !r;
    $('receiver-status').textContent = s.applied ? 'Collegamento mostrato. Nessuna modifica al progetto.' : s.stale
      ? 'Il contesto è cambiato. La risposta precedente non è applicata al nuovo focus.' : s.request
      ? r ? 'Risposta importata per questa richiesta. Le fonti sono dichiarate dal ricevente.' : 'Richiesta preparata, non inviata automaticamente.'
      : 'Il file conterrà identità, stato e fonti del focus corrente.';
    if (r) {
      $('receiver-origin').textContent = `${s.request.question} · ${r.semantic_id} · ${s.request.focus.field.state.presentation_act}`;
      $('receiver-answer-text').textContent = r.answer;
      const sources = $('receiver-sources'); sources.replaceChildren();
      for (const ref of r.sources) {
        const p = document.createElement('p'), a = document.createElement('a');
        a.href = sourceURL(ref); a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = `${ref.path} @ ${ref.revision.slice(0,8)}`;
        p.append(a, document.createElement('br'), ref.used_for); sources.append(p);
      }
      const list = $('receiver-unknowns'); list.replaceChildren();
      for (const u of r.unknowns) { const li = document.createElement('li'); li.textContent = u; list.append(li); }
      $('receiver-show').hidden = !r.focus_target;
      $('receiver-show').disabled = s.stale || s.applied;
      $('receiver-reason').textContent = r.focus_reason || '';
    }
  }
  function attempt(fn) { try { const value=fn(); render(); return value; }
    catch (e) { $('receiver-status').textContent=e.message; throw e; } }
  function prepare(question) { return attempt(() => controller.prepare(question)); }
  function accept(result) { return attempt(() => controller.accept(result)); }
  function show() { return attempt(() => controller.show()); }
  $('receiver-export').onclick = () => {
    try {
      const request = prepare($('receiver-question').value);
      const url = URL.createObjectURL(new Blob([JSON.stringify(request,null,2)],{type:'application/json'}));
      const a=document.createElement('a'); a.href=url; a.download=`kn-request-${request.request_id}.json`;
      document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    } catch { /* Error already exposed beside its input. */ }
  };
  $('receiver-import').onchange = async e => {
    const file=e.target.files[0]; if (!file) return;
    try { if (file.size>64000) throw new Error('File troppo grande.'); accept(JSON.parse(await file.text())); }
    catch (error) { $('receiver-status').textContent=error.message; }
    e.target.value='';
  };
  $('receiver-show').onclick=()=>{try {show();} catch { /* local status */ }};
  document.addEventListener('kn:focus',render);
  window.KN_RECEIVER=Object.freeze({prepare, accept, show, snapshot:controller.snapshot});
  if (new URLSearchParams(location.search).has('test')) window.__KN_RECEIVER_TEST__=Object.freeze({
    restoreCaptured: request => attempt(()=>controller.restoreForReplay(request)),
  });
  render();
}
