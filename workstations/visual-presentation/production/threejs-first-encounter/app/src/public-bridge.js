import { PUBLIC_VIEWS, publicCommand, validPublicId } from './public-controls.js';

export function mountPublicBridge() {
  if (window.parent === window || !new URLSearchParams(location.search).has('public')) return;
  // The containing product page owns the return to the presentation.
  const publicStyle = document.createElement('style');
  publicStyle.textContent = '#encounter-launch, #local-data-notice { display: none; }';
  document.head.append(publicStyle);
  for (const paragraph of document.querySelectorAll('#details p')) {
    if (paragraph.textContent.startsWith('Questa scena illustra')) paragraph.textContent =
      'Questa scena illustra la continuità tra progetto, costruzione, vita dello yacht ed esperienza che torna al progetto. La chat MAIOS può spiegarla e proporre viste da aprire. La scena non riceve dati di bordo e non controlla sistemi aziendali.';
    if (paragraph.textContent.includes('Nessun dato viene inviato')) paragraph.textContent =
      'Puoi esplorare la presentazione da tastiera e interrompere l’animazione. La chat riceve il nome della vista aperta. Note, schizzi e casi inseriti nella demo restano separati dalla conversazione; la chat riceve ciò che scegli di scriverle.';
  }
  let last = '', scheduled = false, session = '', pending = null;
  const visible = id => document.getElementById(id)?.hidden === false;
  function report() {
    scheduled = false;
    const encounter = window.KN_ENCOUNTER.state();
    let target = '';
    if (encounter.active) target = Object.keys(PUBLIC_VIEWS).find(key =>
      PUBLIC_VIEWS[key].family === 'encounter' && PUBLIC_VIEWS[key].view === encounter.view) || '';
    else if (visible('product-workspace')) target = 'nautico-progetto';
    else if (visible('company-panel') && visible('company-explore')) target = Object.keys(PUBLIC_VIEWS).find(key =>
      PUBLIC_VIEWS[key].family === 'company' && PUBLIC_VIEWS[key].view === window.KN_COMPANY.context()) || '';
    // Whitelist fields. Never send case snapshots, notes, sketches or DOM text.
    if (!session) return;
    const data = { schema: 'kn.public-view-state.v2', session, target, ready: true,
      requestId: pending?.requestId || '', ok: pending ? pending.target === target : true };
    pending = null;
    const signature = JSON.stringify(data);
    if (signature !== last) { last = signature; window.parent.postMessage(data, location.origin); }
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(report); } }
  addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== window.parent) return;
    const hello = event.data;
    if (hello?.schema === 'kn.public-view-hello.v2'
        && Object.keys(hello).sort().join(',') === 'schema,session' && validPublicId(hello.session)) {
      session = hello.session; pending = null; last = ''; report(); return;
    }
    const command = publicCommand(event.data);
    if (!command || command.session !== session) return;
    pending = command;
    try {
    window.KN_ENCOUNTER.close(); window.KN_COMPANY.close(); window.KN_PRODUCT.close();
    if (command.family === 'encounter') window.KN_ENCOUNTER.open(command.view);
    else if (command.family === 'company') {
      window.KN_COMPANY.openContext(command.view);
    } else window.KN_PRODUCT.open();
    } catch (_error) { /* report the actually observed view */ }
    last = ''; schedule();
  });
  new MutationObserver(schedule).observe(document.body, {
    subtree: true, attributes: true, attributeFilter: ['hidden', 'aria-pressed'],
  });
  document.addEventListener('click', schedule);
  window.parent.postMessage({ schema: 'kn.public-view-available.v2' }, location.origin);
}
