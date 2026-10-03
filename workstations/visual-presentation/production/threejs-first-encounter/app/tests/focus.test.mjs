import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTS, MODEL, RETURN_EXAMPLE } from '../src/data/story.js';
import { REGISTRY, ANCHOR_ID, SOURCE_REF, phaseId, addressFor, resolveField,
  resolveIntent, createFocusController } from '../src/focus/field.js';
const modalities = ['pointer','touch','keyboard','text','voice_simulated','api'];
function fixture(act='RETURN') { const state={act,fallback:false}; return {state,c:createFocusController(()=>state)}; }
test('five distinct addresses cover all acts and the existing spatial anchor',()=>{
 assert.equal(REGISTRY.length,5);assert.equal(new Set(REGISTRY.map(t=>t.id)).size,5);
 assert.deepEqual(REGISTRY.filter(t=>t.kind==='lifecycle_phase').map(t=>t.act),ACTS.map(a=>a.id));
 assert.equal(REGISTRY.find(t=>t.id===ANCHOR_ID).spatial_anchor,'stern-access');
});
for(const act of ACTS) test(`one ${act.id} context across pointer/touch/text/simulated voice`,()=>{
 const {c}=fixture(act.id);const address=addressFor(phaseId(act.id));
 const expected=resolveField(address,{act:act.id,fallback:false});
 for(const mode of modalities){const r=c.select(address,mode);assert.deepEqual(r.field,expected);assert.equal(r.event.modality,mode);}
});
test('same spatial address and context across all inputs',()=>{
 const {c}=fixture();let expected=null;
 for(const via of modalities){const {field}=c.select(addressFor(ANCHOR_ID),via);
  if(expected)assert.deepEqual(field,expected);expected=field;
  assert.strictEqual(field.knowledge.example,RETURN_EXAMPLE);
 }
});
test('resolver uses current timeline state, preserves spatial identity when state changes',()=>{
 const {c,state}=fixture('FORM');c.select(addressFor(ANCHOR_ID),'pointer');
 state.act='LIVE';c.sync();const next=c.snapshot();
 assert.equal(next.field.address.semantic_id,ANCHOR_ID);
 assert.equal(next.field.state.presentation_act,'LIVE');assert.equal(next.event.modality,'timeline');
 assert.strictEqual(next.field.state.current_resultant,ACTS[2].text);
 assert.equal(next.field.knowledge.explanation,ACTS[2].text);
 assert.notEqual(next.field.knowledge.explanation,RETURN_EXAMPLE.observation);
});
test('phase focus follows presentation, not a duplicated phase store',()=>{
 const {c,state}=fixture('FORM');state.act='BUILD';c.sync();
 assert.equal(c.snapshot().field.address.semantic_id,phaseId('BUILD'));
 const revision=c.snapshot().revision;c.sync();assert.equal(c.snapshot().revision,revision);
});
test('fallback preserves semantic identity, never inherits geometric proof',()=>{
 const {c,state}=fixture();c.select(addressFor(ANCHOR_ID));state.fallback=true;c.sync();
 assert.equal(c.snapshot().field.address.semantic_id,ANCHOR_ID);
 assert.equal(c.snapshot().field.state.geometry,'schematic_alternative');
});
for(const key of ['project_id','configuration','object_type','semantic_id']) test(`reject wrong ${key} before mutation`,()=>{
 const {c}=fixture();const before=c.snapshot();
 assert.throws(()=>c.select({...addressFor(ANCHOR_ID),[key]:'unrecognized'}),RangeError);
 assert.strictEqual(c.snapshot().field,before.field);assert.equal(c.snapshot().revision,before.revision);
});
test('stale revision cannot replace a newer focus',()=>{
 const {c}=fixture();const rev=c.snapshot().revision;c.select(addressFor(ANCHOR_ID));
 assert.throws(()=>c.select(addressFor(phaseId('RETURN')),'api',{expectedRevision:rev}),RangeError);
 assert.equal(c.snapshot().field.address.semantic_id,ANCHOR_ID);
});
test('mismatched lifecycle does not pretend to be current context',()=>{
 const {c}=fixture('FORM');assert.throws(()=>c.select(addressFor(phaseId('RETURN'))),RangeError);
 assert.throws(()=>resolveField(addressFor(ANCHOR_ID),{act:'UNKNOWN'}),RangeError);
});
test('unsupported modality cannot claim actual voice acquisition',()=>{
 const {c}=fixture();assert.throws(()=>c.select(addressFor(ANCHOR_ID),'voice'),RangeError);
 assert.equal(c.snapshot().revision,0);
});
test('bounded commands resolve aliases and canonical addresses without model calls',()=>{
 for(const text of ['Mostrami RETURN','apri il RETURN','torna a RETURN','kn:phase:RETURN','ritorno'])
  assert.equal(resolveIntent(text).id,phaseId('RETURN'));
 for(const text of ['mostrami accesso a poppa','accesso di poppa','stern-access',ANCHOR_ID])
  assert.equal(resolveIntent(text).id,ANCHOR_ID);
 assert.equal(resolveIntent('cosa manca qui',ANCHOR_ID).view,'gaps');
 assert.equal(resolveIntent('cosa manca qui').reason,'no_focus');
});
test('unknown, ambiguous or consequential commands do not resolve an arbitrary target',()=>{
 for(const text of ['',null,42,'x'.repeat(241),'vai al porto','FORM o RETURN','elimina RETURN',
  'mostrami RETURN e approva la modifica','<script>alert(1)</script>','paratia 17'])
  assert.equal(resolveIntent(text).ok,false);
});
test('source references are pinned and honestly linked, not live-loaded',()=>{
 for(const t of REGISTRY)for(const s of t.sources){assert.equal(s.revision,SOURCE_REF);
 assert.equal(s.freshness,'pinned_reference_not_live');assert.equal(s.read_state,'linked_not_loaded');
 assert.ok(s.url.startsWith(`https://github.com/GrazianoGuiducci/kernel-nautico/blob/${SOURCE_REF}/`));}
});
test('immutable read-only projection grants no operational or model capability',()=>{
 const {c}=fixture();const f=c.snapshot().field;
 assert.throws(()=>{f.capabilities.execute=true;},TypeError);
 for(const k of ['execute','approve','edit_project','route_planning','microphone','ai_connected'])assert.equal(f.capabilities[k],false);
 assert.equal(f.state.vessel_instance,null);assert.equal(f.address.configuration,MODEL.sha256);
 assert.equal(f.knowledge.competences[0].participation,'reachable_reference_not_executed');
});
test('event subscribers observe one committed field, and can unsubscribe',()=>{
 const {c}=fixture();let calls=0;const unsub=c.subscribe(s=>{calls++;assert.equal(s.revision,c.snapshot().revision);});
 c.select(addressFor(ANCHOR_ID));unsub();c.select(addressFor(ANCHOR_ID));assert.equal(calls,1);
});
