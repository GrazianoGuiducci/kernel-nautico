/** Incoming state is observed from KN_COMPANY; outgoing navigation is verified
 * before this reading surface commits. The existing public v2 bridge stays owner.
 * This is a tested seam, not a claim that the production app has been patched.
 */
import { CONTEXT_IDS } from './field.mjs';
export function connectCompanyContext(surface,company,{eventTarget=document,onObserved=null}={}){
  if(!surface?.controller||typeof surface.observeContext!=='function'||typeof surface.setNavigationHandler!=='function'||!company||typeof company.openContext!=='function'||typeof company.context!=='function')throw new TypeError('Serve il contesto aziendale dell’app Nautico.');
  let disposed=false,inRequest=false;
  const observed=id=>{
    if(disposed||!CONTEXT_IDS.includes(id)||company.context()!==id)return false;
    surface.observeContext(id);onObserved?.({contextId:id,scope:'view_only'});return true;
  };
  const fromEvent=event=>{if(!inRequest&&event.detail?.effect==='presentation_only')observed(event.detail.contextId);};
  eventTarget.addEventListener('kn:company-context',fromEvent);
  const request=id=>{
    if(id==='overview')return {contextId:id,scope:'local_orientation_only'};
    if(!CONTEXT_IDS.includes(id))throw new TypeError('Contesto sconosciuto.');
    inRequest=true;try{company.openContext(id);}finally{inRequest=false;}
    // The host may publish its own observed event synchronously. Re-read the
    // actual controller; do not treat a successful call as acknowledgement.
    if(company.context()!==id){observed(company.context());throw new Error('Contesto richiesto non confermato. La vista osservata resta disponibile.');}
    return {contextId:id,scope:'view_only'};
  };
  surface.setNavigationHandler(request);
  observed(company.context());
  return ()=>{disposed=true;eventTarget.removeEventListener('kn:company-context',fromEvent);surface.setNavigationHandler(null);};
}
