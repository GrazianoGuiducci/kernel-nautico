import { createWorld } from './scene/world.js';
import { createTimeline, DURATION, actTime, smooth, clamp } from './core/timeline.js';
import { RETURN_EXAMPLE } from './data/story.js';

const $=id=>document.getElementById(id), params=new URLSearchParams(location.search);
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const timeline=createTimeline({reducedMotion:preference.matches});
let world=null, pending=false, previous=0, ready=false, fallback=false, inspection=false, lastAct='', lastFrameMS=0;
const renderSamples=[], phaseButtons=[...document.querySelectorAll('[data-act]')];
let returnStage='not_active';
function invalidate(){if(!pending){pending=true;requestAnimationFrame(tick);}}
function closeInspection(){inspection=false;document.body.classList.remove('inspection');$('inspect').setAttribute('aria-pressed','false');world?.setInspect(false);}
function selectAct(id){closeInspection();timeline.seek(actTime(id,id==='RETURN'?.90:.68));invalidate();}
function drawRelation(frame){
  const w=innerWidth,h=innerHeight,mobile=w<600;
  const point=world?.projectAnchor() || {x:w*(mobile?.70:.72),y:h*.50,visible:true};
  const note=$('design-note'), rect=note.getBoundingClientRect();
  const destination={x:rect.right+9,y:rect.top+(mobile?45:62)};
  const isReturn=frame.index===3, p=frame.progress;
  const opacity=frame.index===0?1:isReturn?smooth(p/.12):frame.index===1?.27:0;
  note.style.opacity=opacity;
  $('note-kicker').textContent=isReturn?'PROSSIMO FORM · CRITERIO PROPOSTO':'ORIGINE · FORM';
  $('note-title').textContent=isReturn?'Una verifica in più nel prossimo progetto.':'L’accesso entra nel progetto.';
  $('note-status').textContent=isReturn?'Proposta da valutare, non applicazione automatica.':'Uno schema, non dati ingegneristici.';
  const review={x:destination.x+(point.x-destination.x)*.52,y:Math.min(point.y,destination.y)-(mobile?30:40)};
  const curve=`M${point.x},${point.y} Q${point.x-30},${review.y} ${review.x},${review.y} T${destination.x},${destination.y}`;
  const source=$('source-line'), returned=$('return-line');
  source.setAttribute('d',curve);source.style.opacity=isReturn?.12:frame.index===0?.50:frame.index===1?.22:0;
  returned.setAttribute('d',curve);
  const amount=isReturn?smooth((p-.12)/.64):0;
  const length=returned.getTotalLength();returned.style.strokeDasharray=`${length}`;
  returned.style.strokeDashoffset=`${length*(1-amount)}`;returned.style.opacity=isReturn?1:0;
  $('source-dot').setAttribute('cx',point.x);$('source-dot').setAttribute('cy',point.y);
  const traveller=returned.getPointAtLength(Math.max(0,length*amount));
  $('traveller').setAttribute('cx',traveller.x);$('traveller').setAttribute('cy',traveller.y);
  $('traveller').style.opacity=isReturn&&amount>0&&amount<1?1:0;
  const witness=$('anchor-label');witness.textContent=frame.act.anchor;
  witness.style.left=`${clamp(point.x+16,16,w-(mobile?185:260))}px`;
  witness.style.top=`${point.y+(mobile?-21:19)}px`;
  const gate=smooth((p-.27)/.14), change=isReturn?smooth((p-.73)/.15):0;
  $('review-glyph').setAttribute('transform',`translate(${review.x},${review.y})`);
  $('review-glyph').style.opacity=isReturn?gate:0;
  $('review-label').style.cssText=`opacity:${isReturn?gate:0};left:${review.x-60}px;top:${review.y-30}px`;
  $('new-route').style.opacity=change;$('path-arrow').style.opacity=change;
  $('design-note').style.borderColor=change>.01?'var(--gold)':'var(--cyan)';
  returnStage=!isReturn?'not_active':p<.3?'observation':p<.74?'human_qualification':'proposed_design_criterion';
  $('relation').style.opacity=point.visible&&!inspection?1:0;
  witness.style.visibility=inspection?'hidden':'';
}
function updateUI(frame){
  if(lastAct!==frame.currentAct){lastAct=frame.currentAct;
    $('act-title').textContent=frame.act.title;$('act-text').textContent=frame.act.text;$('act-number').textContent=frame.act.number;
    $('live-status').textContent=`${frame.currentAct}. ${frame.act.title} ${frame.act.text}`;
    for(const b of phaseButtons)b.setAttribute('aria-pressed',String(b.dataset.act===frame.currentAct));
    $('stage').setAttribute('aria-label',`${frame.currentAct}: ${frame.act.title} Lo yacht mantiene la stessa identità.`);
  }
  $('timeline').value=frame.seconds;$('timeline').setAttribute('aria-valuetext',`${frame.currentAct}, ${Math.round(frame.seconds)} secondi su ${DURATION}`);
  $('clock').textContent=`${Math.floor(frame.seconds).toString().padStart(2,'0')} / ${DURATION}`;
  $('play').innerHTML=timeline.playing?'Ⅱ <span>Pausa</span>':'▷ <span>Riprendi</span>';
  $('play').setAttribute('aria-label',timeline.playing?'Metti in pausa la presentazione':'Riprendi la presentazione');
  drawRelation(frame);
}
function tick(now){pending=false;const start=performance.now();
  const dt=previous?Math.min((now-previous)/1000,.15):0;previous=now;
  const frame=ready?timeline.tick(dt):timeline.frame;
  if(ready){world?.apply(frame);updateUI(frame);}
  lastFrameMS=performance.now()-start;
  if(ready&&timeline.playing){renderSamples.push({frameMS:lastFrameMS,intervalMS:dt*1000});if(renderSamples.length>600)renderSamples.shift();invalidate();}
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
}
ready=true;$('loading').hidden=true;
if(preference.matches||fallback||params.has('test'))timeline.seek(actTime('FORM'));
invalidate();
// Read-only evidence and deterministic presentation controls, exposed only in test mode.
if(params.has('test'))window.__KN_DEBUG__={
  get ready(){return ready;},seekAct(id,p=.68){closeInspection();timeline.seek(actTime(id,p));invalidate();},
  seek(t){closeInspection();timeline.seek(t);invalidate();},
  silent(value){document.body.classList.toggle('silent',Boolean(value));invalidate();},
  snapshot(){return {ready,fallback,playing:timeline.playing,reducedMotion:preference.matches,
    currentAct:timeline.frame.currentAct,seconds:timeline.seconds,returnStage,
    returnExample:RETURN_EXAMPLE,...world?.snapshot(),frameMS:lastFrameMS,
    performanceSamples:renderSamples,network:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.transferSize,duration:r.duration}))};}
};
