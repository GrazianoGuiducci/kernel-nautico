import { mountContextualSurface } from './contextual/view.mjs';
import { connectCompanyContext } from './contextual/integration.mjs';

/** One product navigation; company store and public v2 remain the existing owners. */
export async function mountProductNavigation() {
  const $ = id => document.getElementById(id);
  const styles = [];
  for (const path of ['./contextual/style.css', './product-navigation.css']) {
    const link = document.createElement('link'); link.rel = 'stylesheet';
    link.href = new URL(path, import.meta.url).href;
    styles.push(new Promise((resolve, reject) => {
      link.addEventListener('load', resolve, { once: true });
      link.addEventListener('error', () => reject(new Error(`Stile non disponibile: ${path}`)), { once: true });
    }));
    document.head.append(link);
  }
  document.body.classList.add('product-integrated');
  const nav = document.createElement('nav'); nav.id = 'product-navigation';
  nav.setAttribute('aria-label', 'Kernel Nautico');
  const modes = { story: 'Presentazione', explore: 'Esplorazione', case: 'Il tuo lavoro', project: 'Progetto', learning: 'Come impara', session: 'Collaborare' };
  for (const [id, label] of Object.entries(modes)) {
    const button = document.createElement('button'); button.type = 'button';
    button.textContent = label; button.dataset.productMode = id;
    button.onclick = () => open(id); nav.append(button);
  }
  document.body.prepend(nav);
  const host = document.createElement('div'); host.id = 'contextual-surface';
  $('company-explore').append(host);
  const surface = mountContextualSurface(host, {
    embedded: true,
    onOpenCase: () => open('case'),
    // No composer acknowledgement contract exists here. Public prompt/copy stays explicit.
  });
  connectCompanyContext(surface, window.KN_COMPANY);
  function open(mode) {
    window.KN_ENCOUNTER.close(); window.KN_COMPANY.close(); window.KN_PRODUCT.close();
    if (mode === 'explore') {
      window.KN_COMPANY.openContext(window.KN_COMPANY.context());
      $('cvs-field-title').focus({ preventScroll: true });
    } else if (mode === 'case') window.KN_COMPANY.openCase();
    else if (mode === 'project') window.KN_PRODUCT.open();
    else window.KN_ENCOUNTER.open(mode);
    observe();
  }
  function observe() {
    const encounter = window.KN_ENCOUNTER.state();
    const company = !$('company-panel').hidden;
    const mode = encounter.active ? encounter.view : !$('product-workspace').hidden ? 'project'
      : company ? (!$('company-workspace').hidden ? 'case' : 'explore') : '';
    document.body.dataset.productMode = mode;
    for (const button of nav.children) {
      if (button.dataset.productMode === mode) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
  }
  const observer = new MutationObserver(observe);
  for (const id of ['company-panel', 'company-workspace', 'product-workspace', 'encounter', 'en-story', 'en-case', 'en-learning', 'en-session']) {
    observer.observe($(id), { attributes: true, attributeFilter: ['hidden'] });
  }
  // All entry points to the existing owner show the same contextual surface.
  document.addEventListener('kn:company-context', observe);
  $('company-back').addEventListener('click', () => $('cvs-field-title').focus({ preventScroll: true }));
  window.KN_CONTEXTUAL = surface;
  observe();
  const workspace = mountWorkspace(surface, open);
  await Promise.all(styles);
  document.documentElement.classList.remove('workspace-loading');
  $('workspace-boot')?.remove();
  window.KN_WORKSPACE = workspace;
}


/** Atlas workspace shell adapted to the Nautico owners already mounted above. */
function mountWorkspace(surface, openMode) {
 const $=id=>document.getElementById(id),body=document.body;
 const compact=matchMedia('(max-width: 900px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const grid=document.createElement('div');grid.id='workspace-grid';grid.className='atlas-workspace-grid';
 grid.innerHTML='<button id="workspace-backdrop" class="atlas-mobile-panel-backdrop" type="button" aria-label="Chiudi il pannello"></button><button id="workspace-mobile-left" class="atlas-mobile-panel-peek atlas-mobile-panel-peek-left" type="button" aria-controls="workspace-left" aria-expanded="false"><span>Percorsi</span></button><button id="workspace-mobile-right" class="atlas-mobile-panel-peek atlas-mobile-panel-peek-right" type="button" aria-controls="workspace-right" aria-expanded="false"><span>Dettaglio</span></button>';
 const left=document.createElement('aside');left.id='workspace-left';left.className='atlas-rail';left.setAttribute('aria-label','Percorsi del prodotto');
 left.innerHTML='<div class="atlas-rail-heading"><span>Percorsi</span><button id="workspace-left-toggle" class="atlas-panel-collapse" type="button" aria-controls="workspace-left" aria-expanded="true" aria-label="Riduci percorsi">‹</button></div><button id="workspace-left-reopen" class="atlas-panel-gutter" type="button" aria-controls="workspace-left" aria-label="Apri percorsi"><span aria-hidden="true">▦</span><span>Percorsi</span></button>';
 const leftHandle=document.createElement('div');leftHandle.id='workspace-left-resizer';leftHandle.className='atlas-column-resizer';leftHandle.setAttribute('role','separator');leftHandle.setAttribute('aria-orientation','vertical');leftHandle.setAttribute('aria-label','Ridimensiona percorsi');leftHandle.setAttribute('aria-controls','workspace-left');leftHandle.tabIndex=0;leftHandle.innerHTML='<span></span>';
 const center=document.createElement('main');center.id='workspace-center';center.className='atlas-main-field';center.tabIndex=-1;
 center.innerHTML='<details id="workspace-intro"><summary><strong>Kernel Nautico</strong><span>Informazioni sulla demo</span></summary><p>Esplora il prodotto. La chat ti aiuta a scegliere cosa vedere.</p><p>La demo conserva note e casi nel browser e li include nei file che esporti. La chat riceve ciò che scrivi nella conversazione e il nome della vista aperta. Usa esempi senza dati riservati: questa demo non è un archivio aziendale protetto.</p></details><div id="workspace-content"></div>';
 const rightHandle=document.createElement('div');rightHandle.id='workspace-right-resizer';rightHandle.className='atlas-column-resizer';rightHandle.setAttribute('role','separator');rightHandle.setAttribute('aria-orientation','vertical');rightHandle.setAttribute('aria-label','Ridimensiona dettaglio');rightHandle.setAttribute('aria-controls','workspace-right');rightHandle.tabIndex=0;rightHandle.innerHTML='<span></span>';
 const right=document.createElement('aside');right.id='workspace-right';right.className='atlas-inspector';right.setAttribute('aria-label','Dettaglio e strumenti');
 right.innerHTML='<button id="workspace-right-toggle" class="atlas-panel-collapse" type="button" aria-controls="workspace-right" aria-expanded="true" aria-label="Riduci dettaglio">›</button><div id="workspace-help"><h2 tabindex="-1">Nel tuo spazio di lavoro</h2><p>Segui il prodotto, esplora un contesto o riprendi il tuo caso.</p><details open><summary>Come orientarti</summary><p>Il pannello sinistro apre le modalità. Il centro conserva il lavoro; questo lato ne approfondisce il significato.</p></details><details><summary>Il tuo caso e il progetto</summary><p>Il caso conserva ciò che scrivi nel browser. Il progetto permette di annotare o disegnare una variante dell’accesso a poppa.</p></details><details><summary>La chat</summary><p>La chat si apre sopra la pagina: puoi trascinarla dalla testata, ridimensionarla o richiuderla. I suoi pulsanti aprono soltanto le viste pubbliche.</p></details></div><button id="workspace-right-reopen" class="atlas-panel-gutter" type="button" aria-controls="workspace-right" aria-label="Apri dettaglio"><span aria-hidden="true">▦</span><span>Dettaglio</span></button>';
 grid.append(left,leftHandle,center,rightHandle,right);body.append(grid);
 left.insertBefore($('product-navigation'),$('workspace-left-reopen'));
 const contexts=document.createElement('details');contexts.id='workspace-contexts';contexts.open=true;
 contexts.innerHTML='<summary>Contesti di lavoro</summary><div></div>';
 for(const original of document.querySelectorAll('.cvs-context-nav button')){
  const button=document.createElement('button');button.type='button';button.textContent=original.textContent;button.dataset.workspaceContext=original.dataset.context;
  button.onclick=async()=>{openMode('explore');await surface.openContext(button.dataset.workspaceContext);if(compact.matches)await setSide('left',false);};
  contexts.lastElementChild.append(button);
 }
 left.insertBefore(contexts,$('workspace-left-reopen'));
 for(const id of ['experience','encounter','company-panel','product-workspace'])$('workspace-content').append($(id));
 const inspector=document.querySelector('.cvs-inspector');
 inspector.insertAdjacentHTML('afterbegin','<button id="workspace-inspector-toggle" class="atlas-panel-collapse" type="button" aria-controls="workspace-right" aria-expanded="true" aria-label="Riduci dettaglio">›</button>');
 const storage='kn-workspace-atlas-v1',limits={leftMin:192,rightMin:256,maximum:520,gutter:44,handle:8,mainMin:420};
 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 const defaults=()=>({left:innerWidth<=1100?208:clamp(innerWidth*.16,216,288),right:innerWidth<=1100?272:clamp(innerWidth*.22,288,384)});
 function stored(key,fallback){try{const value=localStorage.getItem(storage+'_'+key);return value===null?fallback:value;}catch{return fallback;}}
 const initial=defaults();
 const state={leftOpen:stored('left_state','open')!=='closed',rightOpen:stored('right_state','open')!=='closed',leftWidth:Number(stored('left_width',initial.left))||initial.left,rightWidth:Number(stored('right_width',initial.right))||initial.right};
 let rendered={left:initial.left,right:initial.right},drag=null,mobileFocusOwner=null,inertParts=[],lastMode='',lastSelection=null,detailAnimation=null;
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 function persist(){try{for(const side of ['left','right']){localStorage.setItem(storage+'_'+side+'_state',state[side+'Open']?'open':'closed');localStorage.setItem(storage+'_'+side+'_width',String(Math.round(state[side+'Width'])));}}catch{}}
 function fittedWidths(){
  const total=grid.getBoundingClientRect().width||innerWidth;
  const fixed=limits.handle*2+(state.leftOpen?0:limits.gutter)+(state.rightOpen?0:limits.gutter);
  const budget=Math.max(0,total-fixed-limits.mainMin);
  let leftWidth=state.leftOpen?clamp(state.leftWidth,limits.leftMin,limits.maximum):limits.gutter;
  let rightWidth=state.rightOpen?clamp(state.rightWidth,limits.rightMin,limits.maximum):limits.gutter;
  if(state.leftOpen&&state.rightOpen&&leftWidth+rightWidth>budget){
   const extraBudget=Math.max(0,budget-limits.leftMin-limits.rightMin);
   const leftExtra=Math.max(0,leftWidth-limits.leftMin),rightExtra=Math.max(0,rightWidth-limits.rightMin),extraTotal=leftExtra+rightExtra;
   leftWidth=limits.leftMin+(extraTotal?extraBudget*leftExtra/extraTotal:extraBudget*.42);
   rightWidth=limits.rightMin+(extraTotal?extraBudget*rightExtra/extraTotal:extraBudget*.58);
  }else if(state.leftOpen&&!state.rightOpen)leftWidth=Math.min(leftWidth,Math.max(limits.leftMin,budget));
  else if(!state.leftOpen&&state.rightOpen)rightWidth=Math.min(rightWidth,Math.max(limits.rightMin,budget));
  return {left:Math.round(leftWidth),right:Math.round(rightWidth)};
 }
 function updateInteractivity(){
  for(const part of inertParts)part.inert=false;inertParts=[];center.inert=false;
  const active=compact.matches?(grid.dataset.mobilePanel||'none'):'none';
  const leftActive=compact.matches?active==='left':state.leftOpen;
  const rightActive=compact.matches?active==='right':state.rightOpen;
  body.dataset.leftOpen=String(leftActive);body.dataset.rightOpen=String(rightActive);
  left.inert=compact.matches&&!leftActive;right.inert=compact.matches&&!rightActive;
  $('workspace-help').inert=!rightActive||body.dataset.productMode==='explore';
  inspector.inert=!rightActive||body.dataset.productMode!=='explore';
  $('workspace-mobile-left').setAttribute('aria-expanded',String(leftActive));
  $('workspace-mobile-right').setAttribute('aria-expanded',String(rightActive));
  if(!compact.matches||active==='none')return;
  if(active==='left'||body.dataset.productMode!=='explore'){center.inert=true;return;}
  let node=inspector;while(node&&node!==center){for(const sibling of node.parentElement.children){if(sibling!==node){sibling.inert=true;inertParts.push(sibling);}}node=node.parentElement;}
 }
 function apply(save=false){
  rendered=fittedWidths();
  grid.style.setProperty('--atlas-left-size',`${state.leftOpen?rendered.left:limits.gutter}px`);
  grid.style.setProperty('--atlas-right-size',`${state.rightOpen?rendered.right:limits.gutter}px`);
  grid.dataset.leftState=state.leftOpen?'open':'closed';grid.dataset.rightState=state.rightOpen?'open':'closed';
  for(const side of ['left','right']){
   const open=state[side+'Open'];$('workspace-'+side+'-toggle').setAttribute('aria-expanded',String(open));
   if(side==='right')$('workspace-inspector-toggle').setAttribute('aria-expanded',String(open));
   $('workspace-'+side+'-reopen').setAttribute('aria-expanded',String(open));
   const handle=$('workspace-'+side+'-resizer');handle.setAttribute('aria-valuemin',String(limits[side+'Min']));
   handle.setAttribute('aria-valuemax',String(limits.maximum));handle.setAttribute('aria-valuenow',String(open?rendered[side]:limits.gutter));
  }
  if(save)persist();updateInteractivity();
 }
 async function setSide(side,open,transferFocus=true){
  if(compact.matches){
   if(open&&transferFocus)mobileFocusOwner=document.activeElement;
   grid.dataset.mobilePanel=open?side:'none';updateInteractivity();
   if(!transferFocus)return;
   await wait(reduced.matches?0:360);
   const target=open?(side==='left'?$('product-navigation').querySelector('button'):body.dataset.productMode==='explore'?$('cvs-inspector-title'):$('workspace-help').querySelector('h2')):(mobileFocusOwner?.isConnected&&!mobileFocusOwner.closest('[inert]')?mobileFocusOwner:$('workspace-mobile-'+side));
   target?.focus({preventScroll:true});if(!open)mobileFocusOwner=null;
   return;
  }
  state[side+'Open']=open;apply(true);
  if(transferFocus){await wait(reduced.matches?0:240);$(open&&side==='right'&&body.dataset.productMode==='explore'?'workspace-inspector-toggle':open?'workspace-'+side+'-toggle':'workspace-'+side+'-reopen').focus({preventScroll:true});}
 }
 function resetSide(side){const next=defaults();state[side+'Width']=next[side];state[side+'Open']=true;apply(true);}
 function startResize(side,event){
  if(compact.matches||event.button!==0)return;event.preventDefault();
  const handle=$('workspace-'+side+'-resizer');handle.setPointerCapture(event.pointerId);
  const original={open:state[side+'Open'],width:state[side+'Width']};
  drag={side,startX:event.clientX,startWidth:rendered[side],original,handle,pointerId:event.pointerId};
  grid.dataset.resizing='true';handle.dataset.active='true';
  const move=e=>{if(!drag)return;const delta=side==='left'?e.clientX-drag.startX:drag.startX-e.clientX;
   if(!original.open){if(delta>56){state[side+'Open']=true;state[side+'Width']=limits[side+'Min']+delta-56;}}
   else{const next=drag.startWidth+delta,closeBelow=side==='left'?144:192;
    if(next<closeBelow)state[side+'Open']=false;
    else{state[side+'Open']=true;state[side+'Width']=clamp(next,limits[side+'Min'],limits.maximum);}}
   apply(false);
  };
  const finish=commit=>{if(!drag)return;if(!commit){state[side+'Open']=original.open;state[side+'Width']=original.width;}
   if(handle.hasPointerCapture(drag.pointerId))handle.releasePointerCapture(drag.pointerId);
   drag=null;delete grid.dataset.resizing;delete handle.dataset.active;
   window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',cancel);window.removeEventListener('blur',cancel);window.removeEventListener('keydown',keyCancel);apply(commit);
  };
  const end=()=>finish(true),cancel=()=>finish(false),keyCancel=e=>{if(e.key==='Escape'){e.preventDefault();finish(false);}};
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',end);window.addEventListener('pointercancel',cancel);window.addEventListener('blur',cancel);window.addEventListener('keydown',keyCancel);
 }
 function resizeWithKeyboard(side,event){
  if(compact.matches)return;
  if(event.key==='Enter'||event.key===' '){event.preventDefault();setSide(side,!state[side+'Open']);return;}
  if(event.key==='Home'||event.key==='End'){event.preventDefault();state[side+'Open']=true;state[side+'Width']=event.key==='Home'?limits[side+'Min']:limits.maximum;apply(true);return;}
  if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();
  const delta=(event.key==='ArrowRight'?1:-1)*(side==='left'?1:-1)*16;
  state[side+'Open']=true;state[side+'Width']=clamp(state[side+'Width']+delta,limits[side+'Min'],limits.maximum);apply(true);
 }
 for(const side of ['left','right']){
  $('workspace-'+side+'-toggle').onclick=()=>setSide(side,false);
  if(side==='right')$('workspace-inspector-toggle').onclick=()=>setSide(side,false);
  $('workspace-'+side+'-reopen').onclick=()=>setSide(side,true);
  const handle=$('workspace-'+side+'-resizer');handle.title='Trascina o usa le frecce. Invio riduce; doppio clic ripristina.';
  handle.addEventListener('pointerdown',e=>startResize(side,e));handle.addEventListener('keydown',e=>resizeWithKeyboard(side,e));handle.addEventListener('dblclick',()=>resetSide(side));
  $('workspace-mobile-'+side).onclick=()=>setSide(side,true);
 }
 $('workspace-backdrop').onclick=()=>{const side=grid.dataset.mobilePanel;if(side&&side!=='none')setSide(side,false);};
 left.addEventListener('click',e=>{if(e.target.closest('[data-product-mode]')&&compact.matches)setSide('left',false);});
 document.addEventListener('keydown',e=>{if(e.key!=='Escape'||drag||document.querySelector('dialog[open]'))return;
  if(compact.matches&&grid.dataset.mobilePanel&&grid.dataset.mobilePanel!=='none'){e.preventDefault();setSide(grid.dataset.mobilePanel,false);return;}
  const side=inspector.contains(e.target)||right.contains(e.target)?'right':left.contains(e.target)?'left':null;
  if(side){e.preventDefault();setSide(side,false);}
 },true);
 compact.addEventListener('change',()=>{grid.dataset.mobilePanel='none';apply(false);});
 window.addEventListener('resize',()=>apply(false));
 const labels={story:'Presentazione',explore:'Esplorazione',case:'Il tuo lavoro',project:'Progetto',learning:'Come impara',session:'Collaborare'};
 document.addEventListener('kn:company-context',()=>{if(compact.matches&&grid.dataset.mobilePanel==='left')setSide('left',false);});
 function updated(){
  const mode=body.dataset.productMode;
  $('workspace-help').hidden=mode==='explore';updateInteractivity();
  if(mode!==lastMode){if(compact.matches&&grid.dataset.mobilePanel==='left')setSide('left',false);lastMode=mode;center.scrollTop=0;if(!reduced.matches)$('workspace-content').animate([{opacity:.65},{opacity:1}],{duration:600,easing:'ease-out'});}
  for(const card of document.querySelectorAll('.en-card')){
   if(card.tagName==='DETAILS')continue;const title=card.querySelector('h3');if(!title)continue;
   const details=document.createElement('details');details.className=card.className;
   const summary=document.createElement('summary');summary.textContent=title.textContent;title.remove();details.append(summary);while(card.firstChild)details.append(card.firstChild);card.replaceWith(details);
  }
 }
 new MutationObserver(updated).observe(body,{attributes:true,attributeFilter:['data-product-mode']});
 surface.controller.subscribe(s=>{
  for(const button of contexts.querySelectorAll('button')){if(button.dataset.workspaceContext===s.contextId)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');}
  if(s.selectedId&&s.selectedId!==lastSelection){setSide('right',true,false);detailAnimation?.cancel();if(!reduced.matches)detailAnimation=$('cvs-inspector-content').animate([{opacity:.7},{opacity:1}],{duration:550});}lastSelection=s.selectedId;
 });
 const description=document.createElement('details');description.className='workspace-view-info';description.innerHTML='<summary>Come leggere questa vista</summary>';
 $('cvs-lead').parentElement.append(description);description.append($('cvs-lead'));
 for(const details of document.querySelectorAll('details'))details.addEventListener('toggle',()=>{if(details.open&&!reduced.matches)details.animate([{opacity:.6},{opacity:1}],{duration:550});});
 body.classList.add('workspace-on');apply(false);updated();
 return Object.freeze({setSide,state:()=>({left:compact.matches?grid.dataset.mobilePanel==='left':state.leftOpen,right:compact.matches?grid.dataset.mobilePanel==='right':state.rightOpen,widths:{...rendered}})});
}
