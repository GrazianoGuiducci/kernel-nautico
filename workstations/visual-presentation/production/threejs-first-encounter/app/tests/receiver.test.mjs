import test from 'node:test';
import assert from 'node:assert/strict';
import { createFocusController, addressFor, ANCHOR_ID } from '../src/focus/field.js';
import { makeRequest, checkRequest, checkResult, createReceiver, sourceURL } from '../src/receiver/contract.js';
function setup(){let state={act:'LIVE',fallback:false};const f=createFocusController(()=>state);
 f.select(addressFor(ANCHOR_ID),'pointer');const moved=[];
 const r=createReceiver(f.snapshot,id=>{moved.push(id);if(id.startsWith('kn:phase:'))state.act=id.split(':')[2];f.select(addressFor(id));});
 return {f,r,state,moved};}
// Contract fixtures only: these statements are not an executed AI/source-read claim.
function reply(q){return {schema:'kn.receiver-result.v0.1',request_id:q.request_id,context_revision:q.focus.revision,
 semantic_id:q.focus.field.address.semantic_id,receiver:'synthetic unit fixture',answered_at:'2026-10-03T00:00:00Z',answer:'Risposta di test.',
 unknowns:['Dato non disponibile.'],sources:[{owner:'GrazianoGuiducci/kernel-nautico',path:'COMPETENCE_FIELD.md',revision:'0'.repeat(40),read_state:'read_by_receiver',observed_at:'2026-10-03T00:00:00Z',used_for:'Schema test, non lettura reale.'}],
 effect_class:'none',focus_target:'kn:phase:RETURN',focus_reason:'Navigazione di test.'};}
test('request captures detached focus, question and manual transport',()=>{const {f,r}=setup(),q=r.prepare('Cosa manca qui?');assert.deepEqual(q.focus,f.snapshot());assert.equal(q.transport,'manual_file_handoff_not_live_api');q.focus.field.label='changed';assert.notEqual(f.snapshot().field.label,'changed');});
test('request keeps linked sources distinct from later receiver reads',()=>{const {r}=setup(),q=r.prepare('Perché?');assert.equal(q.focus.field.knowledge.sources[0].read_state,'linked_not_loaded');r.accept(reply(q));assert.equal(r.snapshot().request.focus.field.capabilities.ai_connected,false);});
test('blank/oversize questions rejected',()=>{const {r}=setup();assert.throws(()=>r.prepare(' '));assert.throws(()=>r.prepare('x'.repeat(1001)));});
test('forged project or capability field rejected',()=>{const {f}=setup();const x=structuredClone(f.snapshot());x.field.capabilities.execute=true;assert.throws(()=>makeRequest(x,'Perché?'));});
test('unknown request schema rejected',()=>{const {r}=setup();const q=r.prepare('Perché?');q.schema='future';assert.throws(()=>checkRequest(q));});
test('response requires pending request',()=>{const {r}=setup();assert.throws(()=>r.accept({}));});
test('valid response stays data and never moves focus on import',()=>{const {r,moved}=setup(),q=r.prepare('Perché?');r.accept(reply(q));assert.deepEqual(moved,[]);});
test('wrong request cannot attach',()=>{const {r}=setup(),q=r.prepare('Perché?'),v=reply(q);v.request_id='other';assert.throws(()=>r.accept(v));});
test('wrong object cannot attach',()=>{const {r}=setup(),q=r.prepare('Perché?'),v=reply(q);v.semantic_id='kn:phase:FORM';assert.throws(()=>r.accept(v));});
test('wrong revision cannot attach',()=>{const {r}=setup(),q=r.prepare('Perché?'),v=reply(q);v.context_revision++;assert.throws(()=>r.accept(v));});
test('same address after phase change is stale',()=>{const {r,state,f}=setup(),q=r.prepare('Perché?');state.act='BUILD';f.sync();assert.equal(r.snapshot().stale,true);assert.throws(()=>r.accept(reply(q)));});
test('fallback representation change invalidates pending response',()=>{const {r,state,f}=setup(),q=r.prepare('Perché?');state.fallback=true;f.sync();assert.throws(()=>r.accept(reply(q)));});
test('new selection invalidates show even after valid import',()=>{const {r,f}=setup(),q=r.prepare('Perché?');r.accept(reply(q));f.select(addressFor(ANCHOR_ID));assert.throws(()=>r.show());});
test('new question supersedes old request even at same target',()=>{const {r}=setup(),q=r.prepare('Perché?');r.prepare('Cosa manca?');assert.throws(()=>r.accept(reply(q)));});
test('executing effect and arbitrary commands rejected',()=>{const {r}=setup(),q=r.prepare('Perché?');for(const patch of [{effect_class:'execute'},{commands:['rm']},{actions:[]},{capabilities:{execute:true}}])assert.throws(()=>r.accept({...reply(q),...patch}));});
test('unrepresented focus target rejected',()=>{const {r}=setup(),q=r.prepare('Perché?');assert.throws(()=>r.accept({...reply(q),focus_target:'bulkhead:B17'}));});
test('source path/url and owner injection rejected',()=>{const {r}=setup(),q=r.prepare('Perché?');for(const patch of [{path:'../secret'},{path:'javascript:alert(1)'},{path:'a\\b'},{owner:'other/private'},{revision:'main'}]){const v=reply(q);Object.assign(v.sources[0],patch);assert.throws(()=>r.accept(v));}});
test('unread sources cannot be presented as read',()=>{const {r}=setup(),q=r.prepare('Perché?'),v=reply(q);v.sources[0].read_state='linked_not_loaded';assert.throws(()=>r.accept(v));});
test('source URL is generated from qualified fields',()=>{const {r}=setup(),q=r.prepare('Perché?');assert.equal(sourceURL(reply(q).sources[0]),'https://github.com/GrazianoGuiducci/kernel-nautico/blob/'+ '0'.repeat(40)+'/COMPETENCE_FIELD.md');});
test('response copies cannot mutate retained result',()=>{const {r}=setup(),q=r.prepare('Perché?'),v=r.accept(reply(q));v.answer='changed';assert.equal(r.snapshot().result.answer,'Risposta di test.');});
test('show is explicit navigation and cannot apply twice',()=>{const {r,moved}=setup(),q=r.prepare('Perché?');r.accept(reply(q));assert.equal(r.show(),'kn:phase:RETURN');assert.deepEqual(moved,['kn:phase:RETURN']);assert.throws(()=>r.show());});
test('no target is a valid answer with no navigation',()=>{const {r}=setup(),q=r.prepare('Perché?');r.accept({...reply(q),focus_target:null,focus_reason:null});assert.throws(()=>r.show());});
test('captured replay requires identical current context',()=>{const {r,state,f}=setup(),q=r.prepare('Perché?');r.restoreForReplay(q);state.act='FORM';f.sync();assert.throws(()=>r.restoreForReplay(q));});
test('response oversized or malformed unknowns rejected',()=>{const {r}=setup(),q=r.prepare('Perché?');assert.throws(()=>r.accept({...reply(q),answer:'x'.repeat(64001)}));assert.throws(()=>checkResult(q,{...reply(q),unknowns:'unknown'}));});
