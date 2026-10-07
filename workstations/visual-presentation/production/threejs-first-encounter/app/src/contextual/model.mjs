import { FIELD_ID, SUBJECT, CONTEXTS, CONTEXT_IDS, objectById, contextById } from './field.mjs';
/** This controller owns ONLY reading state. It never mutates a case or source. */
export const BOOKMARK_SCHEMA='kn.contextual-reading.v1';
const clone=x=>JSON.parse(JSON.stringify(x));
const freeze=x=>{ if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);} return x; };
const fail=message=>{throw new TypeError(message);};
const viewValid=id=>id==='overview'||CONTEXT_IDS.includes(id);
function checkView(v){
  if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).sort().join(',')!=='compare,contextId,selectedId') fail('Vista non riconosciuta.');
  if(!viewValid(v.contextId)||!(v.selectedId===null||objectById(v.selectedId))||typeof v.compare!=='boolean')fail('Identità o stato di lettura non riconosciuto.');
  return {contextId:v.contextId,selectedId:v.selectedId,compare:v.compare};
}
export function validateBookmark(input){
  let b;try{b=typeof input==='string'?JSON.parse(input):clone(input);}catch{fail('File di lettura non riconosciuto.');}
  if(!b||Array.isArray(b)||Object.keys(b).sort().join(',')!=='fieldId,history,schema,subjectId,view'||b.schema!==BOOKMARK_SCHEMA||b.fieldId!==FIELD_ID||b.subjectId!==SUBJECT.id||!Array.isArray(b.history)||b.history.length>40) fail('Il file non appartiene a questa versione del campo. Nessuna lettura modificata.');
  return freeze({schema:b.schema,fieldId:b.fieldId,subjectId:b.subjectId,view:checkView(b.view),history:b.history.map(checkView)});
}
export function createReadingController(){
  let state={contextId:'overview',selectedId:null,compare:false,history:[],question:'Che cosa cambia se scegliamo un componente alternativo?',questionEdited:false};
  const listeners=new Set();
  const view=()=>({contextId:state.contextId,selectedId:state.selectedId,compare:state.compare});
  const snapshot=()=>freeze(clone({...state,subject:SUBJECT,fieldId:FIELD_ID,
    represented:state.selectedId===null||state.contextId==='overview'||CONTEXTS[state.contextId].nodes.some(n=>n.id===state.selectedId)}));
  function emit(){const s=snapshot();for(const l of listeners)l(s);return s;}
  function change(patch){const next=checkView({...view(),...patch});if(JSON.stringify(next)===JSON.stringify(view()))return snapshot();
    state={...state,...next,history:[...state.history,view()].slice(-40)};return emit();}
  return Object.freeze({
    snapshot,
    navigate(contextId){if(!viewValid(contextId))fail('Contesto sconosciuto.');return change({contextId});},
    select(selectedId){if(selectedId!==null&&!objectById(selectedId))fail('Oggetto sconosciuto.');return change({selectedId});},
    compare(value){if(typeof value!=='boolean')fail('Confronto non riconosciuto.');return change({compare:value});},
    question(text){if(typeof text!=='string'||text.length>1200)fail('Usa una domanda entro 1200 caratteri.');state={...state,question:text,questionEdited:true};return emit();},
    back(){if(!state.history.length)return snapshot();const history=state.history.slice();const last=history.pop();state={...state,...last,history};return emit();},
    publicContext(){const c=contextById(state.contextId);return freeze({target:c?.publicTarget||null,label:c?.label||'Panoramica',scope:'public_context_only'});},
    publicPrompt(){const c=contextById(state.contextId);const o=objectById(state.selectedId);
      // Derived entirely from authored public labels; never includes question/free text.
      return `In Kernel Nautico, spiegami ${o?`la relazione di «${o.label}» con l’accesso di poppa`:'come una scelta sullo yacht coinvolge più contesti'}${c?`, dalla vista «${c.label}»`:''}. Distingui l’esempio dalle capacità già collegate.`;},
    bookmark(){return freeze({schema:BOOKMARK_SCHEMA,fieldId:FIELD_ID,subjectId:SUBJECT.id,view:view(),history:clone(state.history)});},
    restore(input){const b=validateBookmark(input);state={...state,...b.view,history:clone(b.history)};return emit();},
    subscribe(fn){if(typeof fn!=='function')fail('Osservatore non valido.');listeners.add(fn);return()=>listeners.delete(fn);},
  });
}
export function comparisonRows(){return freeze([
  ['Identità','Componente A','Componente B'],
  ['Relazione','Riferimento documentale','Alternativa proposta'],
  ['Compatibilità con l’accesso','Da qualificare nel caso reale','Da qualificare nel caso reale'],
  ['Installazione a bordo','Non stabilita','Non stabilita'],
  ['Decisione del cantiere','Non rappresentata','Non rappresentata'],
]);}
export function receivingStatus(selectedId,contextId){
  const object=objectById(selectedId);if(!object)return null;
  if(['cantiere','service','mare'].includes(contextId)&&['part-b','design-b'].includes(selectedId))return 'La proposta resta selezionata. Non è stabilito che B sia installato a bordo.';
  if(!contextById(contextId)?.nodes.some(n=>n.id===selectedId)&&contextId!=='overview')return 'La selezione continua, ma questa vista non la rappresenta direttamente. Non è stata sostituita con un altro oggetto.';
  return 'La selezione resta la stessa; cambia la relazione da cui la osservi.';
}
