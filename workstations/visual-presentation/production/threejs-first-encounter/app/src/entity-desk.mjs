import { PUBLIC_VIEWS } from './public-controls.js';
import { DESK_TARGETS, PRESENTATION_TARGET, isDeskTarget, labelFor, familyFor,
  deskWeight, normalizeDeskPreferences, normalizeDeskOrder, reorderDesk,
  autoDeskOrder, positionNearEdge } from './entity-desk-model.mjs';

// Alternative receiving shell. All ten contents and their state remain with
// the already-running Nautico controllers inside one isolated original app frame.
const $ = id => document.getElementById(id);
const board = $('ed-board'), zone = $('ed-focus-drop'), win = $('ed-window');
const wrap = $('ed-frame-wrap'), title = $('ed-window-title'), status = $('ed-window-status');
const note = $('ed-load-note'), restore = $('ed-restore'), announcer = $('ed-announcement');
const storageKey = 'kn:entity-desk:appearance:v1';
const descriptions = Object.freeze({
  'nautico-presentazione': 'Lungo il ciclo dello yacht',
  'nautico-apprendimento': 'Conseguenze e metodo',
  'nautico-collaborazione': 'Persone e passaggi',
  'nautico-studio': 'Proposta, fonti, alternative',
  'nautico-cantiere': 'Configurazione e lavorazione',
  'nautico-fornitori': 'Fornitura e interfacce',
  'nautico-showroom': 'Uso e relazione con il cliente',
  'nautico-bordo': 'Situazione ed esperienza',
  'nautico-assistenza': 'Evento, intervento e ritorno',
  'nautico-progetto': 'Contributo e vista di poppa',
});
const groupNames = Object.freeze({ encounter: 'Presentazione e metodo',
  company: 'Campo nautico', product: 'Lavoro sul prodotto' });
const iconNames = Object.freeze({
  'nautico-presentazione': 'KN', 'nautico-apprendimento': '↻',
  'nautico-collaborazione': '↗', 'nautico-studio': 'ST',
  'nautico-cantiere': 'CA', 'nautico-fornitori': 'FO',
  'nautico-showroom': 'SH', 'nautico-bordo': 'BO',
  'nautico-assistenza': 'AS', 'nautico-progetto': 'PR',
});
let prefs;
try { prefs = normalizeDeskPreferences(JSON.parse(localStorage.getItem(storageKey) || 'null')); }
catch { prefs = normalizeDeskPreferences(null); }
let order = [...prefs.order], usage = { ...prefs.usage };
let placement = prefs.placement, selectedTarget = null, confirmedTarget = null;
let opener = null, frame = null, bridgeReady = false, requestSerial = 0;
let pendingCommand = null, pendingTimeout = null, dragging = null;
let moving = false, floating = null, announcedError = false;
const session = 'ed' + String(Date.now()) + Math.random().toString(36).slice(2, 11);
const prefersLessMotion = matchMedia('(prefers-reduced-motion: reduce)');
const small = matchMedia('(max-width: 700px)');

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify({
    schema: 'kn.entity-desk.preferences.v1', order, usage, placement,
  })); } catch { /* Visual preferences must not stop source-owned work. */ }
}
function announce(message) { announcer.textContent = message; }
function setStatus(message) { status.textContent = message; }
function element(tag, className, value) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value !== undefined) el.textContent = value;
  return el;
}
function currentCards() {
  for (const el of board.querySelectorAll('.ed-card')) {
    const active = confirmedTarget === el.dataset.target;
    const requested = selectedTarget === el.dataset.target && !active && !win.hidden;
    el.dataset.active = String(active);
    el.querySelector('.ed-card-status').textContent = active ? 'VISTA CONFERMATA' :
      requested ? 'RICHIESTA' : '';
  }
}
function drawBoard() {
  board.replaceChildren();
  for (const id of normalizeDeskOrder(order)) {
    const data = PUBLIC_VIEWS[id], card = element('article', 'ed-card');
    card.dataset.target = id; card.dataset.weight = deskWeight(id);
    card.dataset.family = familyFor(id);
    card.draggable = true;
    const top = element('div', 'ed-card-top');
    const avatar = element('span', 'ed-avatar', iconNames[id] || 'KN');
    avatar.setAttribute('aria-hidden', 'true');
    const state = element('span', 'ed-card-status');
    top.append(avatar, state);
    const main = element('div');
    main.append(element('span', 'ed-overline', groupNames[data.family] || 'Vista'));
    main.append(element('h2', '', data.label));
    main.append(element('p', 'ed-card-note', descriptions[id] || ''));
    const footer = element('div', 'ed-card-footer');
    const open = element('button', 'ed-card-open', id === PRESENTATION_TARGET ? 'Scopri ↗' : 'Apri ↗');
    open.type = 'button'; open.setAttribute('aria-label', 'Apri ' + data.label);
    open.addEventListener('click', () => openTarget(id, open));
    const move = element('button', 'ed-card-move', '↥');
    move.type = 'button'; move.title = 'Sposta questa scheda verso l’inizio';
    move.setAttribute('aria-label', 'Sposta ' + data.label + ' verso l’inizio');
    move.addEventListener('click', () => {
      const current = order.indexOf(id), previous = order[Math.max(0, current - 1)];
      if (previous && previous !== id) {
        order = reorderDesk(order, id, previous); persist(); drawBoard();
        board.querySelector('[data-target="' + id + '"] .ed-card-move')?.focus();
        announce('Ordine aggiornato: ' + data.label);
      }
    });
    footer.append(open, move);
    card.append(top, main, footer);
    card.addEventListener('dragstart', event => {
      dragging = id; card.dataset.dragging = 'true';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', id);
    });
    card.addEventListener('dragend', () => {
      dragging = null; delete card.dataset.dragging;
      for (const item of board.querySelectorAll('.ed-card')) delete item.dataset.drop;
      delete zone.dataset.drop;
    });
    card.addEventListener('dragover', event => {
      if (!dragging || dragging === id) return;
      event.preventDefault(); event.dataTransfer.dropEffect = 'move';
      card.dataset.drop = 'true';
    });
    card.addEventListener('dragleave', () => { delete card.dataset.drop; });
    card.addEventListener('drop', event => {
      event.preventDefault(); delete card.dataset.drop;
      const source = event.dataTransfer.getData('text/plain');
      if (isDeskTarget(source) && source !== id) {
        order = reorderDesk(order, source, id);
        persist(); drawBoard();
        announce('Scheda riposizionata.');
      }
    });
    board.append(card);
  }
  currentCards();
}
function clearPending() {
  if (pendingTimeout !== null) clearTimeout(pendingTimeout);
  pendingTimeout = null; pendingCommand = null;
}
function requestView(target) {
  if (!bridgeReady || !frame?.contentWindow || !isDeskTarget(target)) return;
  clearPending();
  const command = {
    schema: 'kn.public-view-command.v2', session,
    requestId: 'req' + (++requestSerial), target,
  };
  pendingCommand = command;
  setStatus('Attendo conferma della vista…');
  frame.contentWindow.postMessage(command, location.origin);
  pendingTimeout = setTimeout(() => {
    if (pendingCommand?.requestId === command.requestId) {
      setStatus('Vista non confermata: usa i comandi nella demo oppure riprova.');
      announce('Il ricevente non ha confermato la vista.');
    }
  }, 11000);
}
function frameMount() {
  if (frame) return;
  frame = document.createElement('iframe');
  frame.id = 'ed-frame'; frame.title = 'Kernel Nautico — vista originale interattiva';
  frame.src = './index.html?public=1';
  frame.loading = 'eager';
  frame.addEventListener('error', () => {
    setStatus('La demo originale non è raggiungibile.');
    note.textContent = 'La vista non è disponibile. Apri la presentazione classica.';
    announcedError = true;
  });
  wrap.append(frame);
}
function choosePlacement(next) {
  if (!['floating', 'dock-left', 'dock-right', 'full'].includes(next)) return;
  if (placement === 'floating') {
    const r = win.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) floating = { left: r.left, top: r.top };
  }
  placement = small.matches ? 'full' : next;
  if (placement !== 'floating') {
    win.style.left = ''; win.style.top = '';
  } else {
    const x = floating?.left ?? innerWidth * .09;
    const y = floating?.top ?? innerHeight * .08;
    win.style.left = Math.round(Math.max(0, Math.min(x, innerWidth - 320))) + 'px';
    win.style.top = Math.round(Math.max(0, Math.min(y, innerHeight - 180))) + 'px';
  }
  win.dataset.placement = placement;
  persist();
}
function openTarget(target, origin = null) {
  if (!isDeskTarget(target)) return;
  opener = origin || opener;
  selectedTarget = target;
  usage[target] = Math.min(100000, (usage[target] || 0) + 1);
  persist();
  win.hidden = false; restore.hidden = true;
  title.textContent = labelFor(target);
  win.setAttribute('aria-label', 'Vista Kernel Nautico: ' + labelFor(target));
  choosePlacement(placement);
  if (!frame) frameMount();
  if (bridgeReady) requestView(target);
  else setStatus('Preparazione del collegamento…');
  currentCards();
  $('ed-close').focus({ preventScroll: true });
  announce('Apertura di ' + labelFor(target));
}
function closeWindow(minimized = false) {
  win.hidden = true;
  restore.hidden = !minimized;
  restore.querySelector('span').textContent = selectedTarget ?
    'Riprendi: ' + labelFor(selectedTarget) : 'Riprendi la vista';
  const focus = minimized ? restore : opener;
  focus?.focus({ preventScroll: true });
  announce(minimized ? 'Vista ridotta ad avatar' : 'Tornato al campo delle schede.');
}
function restoreWindow() {
  if (!selectedTarget) return;
  win.hidden = false; restore.hidden = true;
  choosePlacement(placement);
  $('ed-close').focus({ preventScroll: true });
}
function receive(event) {
  if (!frame || event.source !== frame.contentWindow || event.origin !== location.origin) return;
  const msg = event.data;
  if (!msg || typeof msg !== 'object' || Array.isArray(msg)) return;
  if (msg.schema === 'kn.public-view-available.v2') {
    frame.contentWindow.postMessage({ schema: 'kn.public-view-hello.v2', session }, location.origin);
    return;
  }
  if (msg.schema !== 'kn.public-view-state.v2' || msg.session !== session || msg.ready !== true) return;
  if (!bridgeReady) {
    bridgeReady = true;
    note.hidden = true;
    if (selectedTarget) requestView(selectedTarget);
    return;
  }
  if (pendingCommand) {
    if (msg.requestId !== pendingCommand.requestId) return;
    const ok = msg.ok === true && msg.target === pendingCommand.target;
    if (ok) confirmedTarget = msg.target;
    setStatus(ok ? 'Vista confermata dal Kernel Nautico' : 'Vista non confermata dal ricevente');
    clearPending();
  } else if (isDeskTarget(msg.target)) {
    confirmedTarget = msg.target;
    setStatus('Vista attuale comunicata dal ricevente');
  }
  currentCards();
}
window.addEventListener('message', receive);
$('ed-organize').addEventListener('click', () => {
  order = autoDeskOrder(order, usage); persist(); drawBoard();
  announce('Schede ordinate per accessi locali. Puoi cambiarle manualmente.');
});
$('ed-restore-order').addEventListener('click', () => {
  order = [...DESK_TARGETS]; persist(); drawBoard();
  announce('Ordine iniziale ripristinato. I dati del caso non sono stati modificati.');
});
zone.addEventListener('dragover', event => {
  if (!dragging) return; event.preventDefault();
  zone.dataset.drop = 'true';
});
zone.addEventListener('dragleave', () => { delete zone.dataset.drop; });
zone.addEventListener('drop', event => {
  event.preventDefault(); delete zone.dataset.drop;
  const id = event.dataTransfer.getData('text/plain');
  if (isDeskTarget(id)) openTarget(id, board.querySelector('[data-target="' + id + '"] .ed-card-open'));
});
zone.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); openTarget(selectedTarget || PRESENTATION_TARGET, zone);
  }
});
zone.addEventListener('click', () => openTarget(selectedTarget || PRESENTATION_TARGET, zone));
$('ed-close').addEventListener('click', () => closeWindow(false));
$('ed-minimize').addEventListener('click', () => closeWindow(true));
restore.addEventListener('click', restoreWindow);
$('ed-dock-left').addEventListener('click', () => choosePlacement('dock-left'));
$('ed-dock-right').addEventListener('click', () => choosePlacement('dock-right'));
$('ed-maximize').addEventListener('click', () => choosePlacement('full'));
$('ed-float').addEventListener('click', () => choosePlacement('floating'));
const handle = $('ed-window-handle');
let drag = null;
handle.addEventListener('pointerdown', event => {
  if (small.matches || event.button !== 0 || event.target.closest('button')) return;
  const box = win.getBoundingClientRect();
  if (placement !== 'floating') {
    floating = { left: Math.max(0, event.clientX - 160), top: 14 };
    choosePlacement('floating');
  }
  drag = { id: event.pointerId, x: event.clientX,
    y: event.clientY, left: box.left, top: box.top };
  handle.setPointerCapture(event.pointerId);
});
handle.addEventListener('pointermove', event => {
  if (!drag || event.pointerId !== drag.id) return;
  const x = drag.left + event.clientX - drag.x;
  const y = drag.top + event.clientY - drag.y;
  win.style.left = Math.round(Math.max(0, Math.min(x, innerWidth - 180))) + 'px';
  win.style.top = Math.round(Math.max(0, Math.min(y, innerHeight - 95))) + 'px';
  moving = true;
});
function release(event) {
  if (!drag || event.pointerId !== drag.id) return;
  if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
  const dock = moving ? positionNearEdge(event.clientX, innerWidth) : 'floating';
  floating = { left: win.getBoundingClientRect().left, top: win.getBoundingClientRect().top };
  drag = null; moving = false;
  if (dock !== 'floating') choosePlacement(dock);
}
handle.addEventListener('pointerup', release);
handle.addEventListener('pointercancel', release);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !win.hidden) closeWindow(false);
});
window.addEventListener('resize', () => { if (!win.hidden && small.matches) choosePlacement('full'); });
drawBoard();
const linkTarget = new URLSearchParams(location.search).get('target');
if (isDeskTarget(linkTarget)) openTarget(linkTarget);
