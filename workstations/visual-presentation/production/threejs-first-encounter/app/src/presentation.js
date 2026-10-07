import { PHASE_COPY, PHASE_LABELS } from './ui/copy.js';
import { mountFocus } from './focus/panel.js';
import { createWorld } from './scene/world.js';
import { createTimeline, DURATION, actTime, smooth, clamp } from './core/timeline.js';
import { RETURN_EXAMPLE } from './data/story.js';

const $=id=>document.getElementById(id), params=new URLSearchParams(location.search);
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const timeline=createTimeline({reducedMotion:preference.matches});
let world=null, pending=false, previous=0, ready=false, fallback=false, inspection=false, lastAct='', lastFrameMS=0;
const renderSamples=[], phaseButtons=[...document.querySelectorAll('[data-act]')];
let returnStage='not_active', relationEndpoints=null, focusUI=null;
const svgNS='http://www.w3.org/2000/svg';
const defs=document.createElementNS(svgNS,'defs');
defs.innerHTML='<marker id="return-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5 0 9Z" fill="#dbb38b"/></marker>';
$('relation').prepend(defs);
const reviewer=document.createElementNS(svgNS,'g');reviewer.id='review-person';
reviewer.innerHTML='<circle cx="0" cy="-3" r="2"/><path d="M-4 5Q-4 0 0 0Q4 0 4 5"/>';
$('relation').appendChild(reviewer);
function invalidate(){if(!pending){pending=true;requestAnimationFrame(tick);}}
function closeInspection(){inspection=false;document.body.classList.remove('inspection');$('inspect').setAttribute('aria-pressed','false');world?.setInspect(false);}
function selectAct(id){closeInspection();timeline.seek(actTime(id,id==='RETURN'?.90:.68));invalidate();}
function drawRelation(frame){
  // The workspace keeps this legacy diagram outside its active reading plane.
  // Hidden geometry has no anchor to project, especially while panes resize.
  if (!$('relation').getClientRects().length) return;
  const w=innerWidth,h=innerHeight,mobile=w<600;
  // Both carriers project a real visible anchor. A fallback must not detach the
  // relation from its source by substituting a viewport percentage.
  const fallbackAnchor = fallback ? $('fallback').querySelector('circle').getBoundingClientRect() : null;
  const point = world ? world.projectAnchor() : {
    x: fallbackAnchor.x + fallbackAnchor.width / 2,
    y: fallbackAnchor.y + fallbackAnchor.height / 2, visible: true
  };
  const note=$('design-note');
  const isReturn=frame.index===3, p=frame.progress;
  const opacity=frame.index===0?1:isReturn?smooth(p/.12):frame.index===1?.27:0;
  note.style.opacity=opacity;
  $('note-kicker').textContent=isReturn?'PROSSIMO PROGETTO · CRITERIO PROPOSTO':'ORIGINE · PROGETTAZIONE';
  $('note-title').textContent=isReturn?'Verificare l’accessibilità nel prossimo progetto.':'L’accesso entra nel progetto.';
  $('note-status').textContent=isReturn?'Proposta da valutare, non applicazione automatica.':'Uno schema, non dati ingegneristici.';
  const circle=$('access-diagram').querySelector('circle').getBoundingClientRect();
  const destination={x:circle.x+circle.width/2,y:circle.y+circle.height/2};
  relationEndpoints={source:point,destination};
  const review={x:destination.x+(point.x-destination.x)*.52,y:Math.min(point.y,destination.y)-(mobile?42:45)};
  const curve=`M${point.x},${point.y} Q${point.x-30},${review.y} ${review.x},${review.y} T${destination.x},${destination.y}`;
  const source=$('source-line'), returned=$('return-line');
  source.setAttribute('d',curve);source.style.opacity=isReturn?.12:frame.index===0?.50:frame.index===1?.22:0;
  returned.setAttribute('d',curve);
  const amount=isReturn?smooth((p-.12)/.64):0;
  const length=returned.getTotalLength();returned.style.strokeDasharray=`${length}`;
  returned.style.strokeDashoffset=`${length*(1-amount)}`;returned.style.opacity=isReturn?1:0;
  returned.setAttribute('marker-end',amount>.99?'url(#return-arrow)':'');
  $('source-dot').setAttribute('cx',point.x);$('source-dot').setAttribute('cy',point.y);
  const traveller=returned.getPointAtLength(Math.max(0,length*amount));
  $('traveller').setAttribute('cx',traveller.x);$('traveller').setAttribute('cy',traveller.y);
  $('traveller').style.opacity=isReturn&&amount>0&&amount<1?1:0;
  const witness=$('anchor-label');witness.textContent=frame.act.anchor;
  witness.style.left=`${clamp(point.x+16,16,w-(mobile?185:260))}px`;
  witness.style.top=`${point.y+(mobile?19:23)}px`;
  const gate=smooth((p-.27)/.14), change=isReturn?smooth((p-.73)/.15):0;
  $('review-glyph').setAttribute('transform',`translate(${review.x},${review.y})`);
  $('review-glyph').style.opacity=isReturn?gate:0;
  reviewer.setAttribute('transform',`translate(${review.x},${review.y})`);reviewer.style.opacity=isReturn?gate:0;
  $('review-label').style.cssText=`opacity:${isReturn?gate:0};left:${review.x-60}px;top:${review.y-30}px`;
  $('new-route').style.opacity=change;$('path-arrow').style.opacity=change;
  $('design-note').style.borderColor=change>.01?'var(--gold)':'var(--cyan)';
  returnStage=!isReturn?'not_active':p<.3?'observation':p<.74?'human_qualification':'proposed_design_criterion';
  $('relation').style.opacity=point.visible&&!inspection?1:0;
  witness.style.visibility=inspection?'hidden':'';
}
function updateUI(frame){
  if(lastAct!==frame.currentAct){lastAct=frame.currentAct;
    $('act-title').textContent=PHASE_COPY[frame.currentAct].title;$('act-text').textContent=PHASE_COPY[frame.currentAct].text;$('act-number').textContent=frame.act.number;
    $('live-status').textContent=`${PHASE_LABELS[frame.currentAct]}. ${PHASE_COPY[frame.currentAct].title} ${PHASE_COPY[frame.currentAct].text}`;
    for(const b of phaseButtons)b.setAttribute('aria-pressed',String(b.dataset.act===frame.currentAct));
    $('stage').setAttribute('aria-label',`${PHASE_LABELS[frame.currentAct]}: ${PHASE_COPY[frame.currentAct].title} Lo yacht mantiene la stessa identità.`);
  }
  $('timeline').value=frame.seconds;$('timeline').setAttribute('aria-valuetext',`${PHASE_LABELS[frame.currentAct]}, ${Math.round(frame.seconds)} secondi su ${DURATION}`);
  $('clock').textContent=`${Math.floor(frame.seconds).toString().padStart(2,'0')} / ${DURATION}`;
  $('play').innerHTML=timeline.playing?'Ⅱ <span>Pausa</span>':'▷ <span>Riprendi</span>';
  $('play').setAttribute('aria-label',timeline.playing?'Metti in pausa la presentazione':'Riprendi la presentazione');
  drawRelation(frame);
  focusUI?.sync();
}
function tick(now){pending=false;const start=performance.now();
  const actualInterval=previous?now-previous:0;
  const dt=Math.min(actualInterval/1000,1);previous=now;
  const frame=ready?timeline.tick(dt):timeline.frame;
  if(ready){world?.apply(frame);updateUI(frame);}
  lastFrameMS=performance.now()-start;
  if(ready&&timeline.playing){renderSamples.push({act:frame.currentAct,frameMS:lastFrameMS,intervalMS:actualInterval});if(renderSamples.length>600)renderSamples.shift();invalidate();}
}
$('play').onclick=()=>{closeInspection();timeline.playing?timeline.pause():timeline.play();previous=0;invalidate();};
$('replay').onclick=()=>{closeInspection();timeline.replay();if(preference.matches)timeline.seek(actTime('FORM'));previous=0;invalidate();};
for(const b of phaseButtons)b.onclick=()=>selectAct(b.dataset.act);
$('timeline').oninput=e=>{closeInspection();timeline.seek(Number(e.target.value));invalidate();};
$('inspect').onclick=()=>{if(!world)return;timeline.pause();inspection=!inspection;
  document.body.classList.toggle('inspection',inspection);$('inspect').setAttribute('aria-pressed',String(inspection));world.setInspect(inspection);invalidate();};
$('about').onclick=()=>{timeline.pause();$('details').showModal();invalidate();};
$('close-details').onclick=()=>$('details').close();
$('details').addEventListener('close',()=>$('about').focus());
preference.addEventListener('change',e=>{timeline.setReduced(e.matches);invalidate();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)timeline.pause();previous=0;invalidate();});
addEventListener('resize',invalidate);

try{
  if(params.has('static'))throw new Error('Versione statica selezionata. Usa le quattro fasi per seguire la relazione.');
  world=await createWorld($('stage'),invalidate);
}catch(error){
  fallback=true;timeline.pause();$('fallback').hidden=false;$('fallback-reason').textContent=error.message;
  $('stage').replaceChildren();$('inspect').disabled=true;
  $('inspect').setAttribute('aria-label','Esplorazione 3D non disponibile nella versione statica');
  document.body.classList.add('static-fallback');
  $('scene-boundary').textContent='SCHEMA ALTERNATIVO · STESSA RELAZIONE';
}
ready=true;$('loading').hidden=true;
if(preference.matches||fallback||params.has('test'))timeline.seek(actTime('FORM'));
focusUI=mountFocus({
  getState:()=>({act:timeline.frame.currentAct,fallback}),
  seekAct:selectAct,
  pause:()=>{closeInspection();timeline.pause();invalidate();},
  invalidate,
  isInspect:()=>inspection,
  projectAnchor:()=>relationEndpoints?.source,
});
invalidate();
// Read-only evidence and deterministic presentation controls, exposed only in test mode.
if(params.has('test'))window.__KN_DEBUG__={
  get ready(){return ready;},seekAct(id,p=.68){closeInspection();timeline.seek(actTime(id,p));invalidate();},
  seek(t){closeInspection();timeline.seek(t);invalidate();},
  silent(value){document.body.classList.toggle('silent',Boolean(value));invalidate();},
  snapshot(){return {ready,fallback,playing:timeline.playing,reducedMotion:preference.matches,
    currentAct:timeline.frame.currentAct,seconds:timeline.seconds,returnStage,relationEndpoints,
    returnExample:RETURN_EXAMPLE,...world?.snapshot(),frameMS:lastFrameMS,
    performanceSamples:renderSamples,network:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.transferSize,duration:r.duration}))};}
};
