import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {FIELD_ID, SUBJECT, OBJECTS, RELATIONS, CONTEXTS, CONTEXT_IDS, objectById, visibleRelations} from '../src/contextual/field.mjs';
import {createReadingController, receivingStatus, comparisonRows} from '../src/contextual/model.mjs';
import {connectCompanyContext} from '../src/contextual/integration.mjs';
const fingerprint=()=>createHash('sha256').update(JSON.stringify({SUBJECT,OBJECTS,RELATIONS,CONTEXTS})).digest('hex');
const fresh=()=>createReadingController();

test('six existing company IDs map to their existing public targets',()=>{
 assert.deepEqual(CONTEXT_IDS,['studio','cantiere','rete','showroom','mare','service']);
 assert.deepEqual(CONTEXT_IDS.map(id=>CONTEXTS[id].publicTarget),['nautico-studio','nautico-cantiere','nautico-fornitori','nautico-showroom','nautico-bordo','nautico-assistenza']);
 assert.equal(new Set(CONTEXT_IDS.map(id=>CONTEXTS[id].morphology)).size,6);
});
test('all drawn objects and relations resolve to authored sources',()=>{
 for(const c of Object.values(CONTEXTS)){
  const ids=c.nodes.map(n=>n.id);assert.equal(new Set(ids).size,ids.length);
  for(const n of c.nodes){assert.ok(objectById(n.id));assert.ok(n.x>0&&n.x<100&&n.y>0&&n.y<100);}
 }
 for(const r of RELATIONS){assert.ok(objectById(r.from));assert.ok(objectById(r.to));assert.ok(r.predicate&&r.meaning&&r.source);}
});
test('source topology and nested coordinates cannot be mutated by a view',()=>{
 assert.throws(()=>{CONTEXTS.rete.nodes[0].x=999;},TypeError);
 assert.throws(()=>{OBJECTS['part-b'].state='installato';},TypeError);
 assert.throws(()=>{RELATIONS[0].predicate='approved';},TypeError);
});
test('overview starts without implying installed source state',()=>{
 const s=fresh().snapshot();assert.equal(s.contextId,'overview');assert.equal(s.selectedId,null);assert.equal(s.subject.kind,'functional_subject');
});
test('navigation without semantic change does not accumulate history',()=>{const c=fresh();c.navigate('overview');c.select(null);c.compare(false);assert.equal(c.snapshot().history.length,0);});
test('one selection crosses network, assembly, timeline without becoming installed',()=>{
 const c=fresh(),before=fingerprint();c.navigate('rete');c.select('part-b');
 for(const id of ['cantiere','service']){c.navigate(id);assert.equal(c.snapshot().selectedId,'part-b');assert.equal(c.snapshot().subject.id,SUBJECT.id);assert.match(receivingStatus('part-b',id),/Non è stabilito/);}
 assert.equal(fingerprint(),before);assert.equal(OBJECTS['part-b'].state,'Alternativa proposta');
});
test('a view without the selected object keeps it explicitly not represented',()=>{
 const c=fresh();c.select('part-b');c.navigate('showroom');assert.equal(c.snapshot().selectedId,'part-b');assert.equal(c.snapshot().represented,false);assert.match(receivingStatus('part-b','showroom'),/non è stata sostituita/i);
});
test('variant and physical installation are distinct references',()=>{assert.notEqual(OBJECTS['part-a'].id,OBJECTS['part-b'].id);assert.notEqual(SUBJECT.id,OBJECTS.asbuilt.id);assert.equal(RELATIONS.filter(r=>r.predicate==='unknown_correspondence').length,2);assert.ok(comparisonRows().some(r=>r[1]==='Non stabilita'&&r[2]==='Non stabilita'));});
test('current question survives context navigation',()=>{const c=fresh();c.question('Perché devo coinvolgere qualità?');c.navigate('studio');c.navigate('service');assert.equal(c.snapshot().question,'Perché devo coinvolgere qualità?');});
test('back restores reading, not a source or an earlier private question',()=>{const c=fresh();c.navigate('rete');c.select('part-b');c.navigate('service');c.question('domanda attuale');c.back();assert.equal(c.snapshot().contextId,'rete');assert.equal(c.snapshot().selectedId,'part-b');assert.equal(c.snapshot().question,'domanda attuale');});
test('history is bounded at forty meaningful changes',()=>{const c=fresh();for(let i=0;i<120;i++)c.navigate(CONTEXT_IDS[i%6]);assert.equal(c.snapshot().history.length,40);});
test('snapshots cannot mutate the working state',()=>{const c=fresh();const s=c.select('part-b');assert.throws(()=>{s.subject.id='different';},TypeError);assert.throws(()=>s.history.push({}),TypeError);assert.equal(c.snapshot().selectedId,'part-b');});
test('comparison can be enabled without creating an approval',()=>{const c=fresh(),before=fingerprint();c.compare(true);assert.equal(c.snapshot().compare,true);assert.equal(fingerprint(),before);});
test('bookmark has exact field and subject binding, not private question',()=>{const c=fresh();c.question('PRIVATE_SENTINEL_768');c.navigate('rete');c.select('part-b');const b=c.bookmark();assert.equal(b.fieldId,FIELD_ID);assert.equal(b.subjectId,SUBJECT.id);assert.ok(!JSON.stringify(b).includes('PRIVATE_SENTINEL'));assert.deepEqual(Object.keys(b).sort(),['fieldId','history','schema','subjectId','view']);});
test('bookmark round-trip restores selection, view, comparison and reading history',()=>{const c=fresh();c.navigate('rete');c.select('part-b');c.compare(true);c.navigate('service');const d=fresh();d.restore(JSON.stringify(c.bookmark()));assert.deepEqual(d.bookmark(),c.bookmark());});
for(const [name,mutate] of [
 ['field mismatch',b=>b.fieldId='next'],['subject mismatch',b=>b.subjectId='private-vessel'],['unknown context',b=>b.view.contextId='evil'],['unknown object',b=>b.view.selectedId='private-object'],['extra authority',b=>b.view.approved=true],['extra data',b=>b.privateCase={id:'x'}],['oversized history',b=>b.history=Array.from({length:41},()=>b.view)],['invalid historical view',b=>b.history.push({contextId:'studio',selectedId:'prototype',compare:false})],['invalid boolean',b=>b.view.compare='yes']
])test(`reject ${name} atomically`,()=>{const c=fresh();c.navigate('studio');const before=c.snapshot();const b=structuredClone(c.bookmark());mutate(b);assert.throws(()=>c.restore(b));assert.deepEqual(c.snapshot(),before);});
test('invalid JSON and null do not destroy current reading',()=>{const c=fresh(),s=c.navigate('rete');for(const b of ['{','null','[]']){assert.throws(()=>c.restore(b));assert.deepEqual(c.snapshot(),s);}});
test('unknown selection and prototype property are rejected',()=>{const c=fresh();for(const id of ['__proto__','constructor','toString','unknown']){assert.throws(()=>c.select(id));assert.throws(()=>c.navigate(id));}});
test('question type and size validation preserve state on rejection',()=>{const c=fresh(),s=c.snapshot();assert.throws(()=>c.question('x'.repeat(1201)));assert.throws(()=>c.question({text:'x'}));assert.deepEqual(c.snapshot(),s);});
test('public context never contains object or privately authored text',()=>{const c=fresh();c.question('PRIVATE_SENTINEL_768');c.navigate('rete');c.select('part-b');assert.deepEqual(c.publicContext(),{target:'nautico-fornitori',label:'Fornitori',scope:'public_context_only'});assert.ok(!JSON.stringify(c.publicContext()).includes('PRIVATE_SENTINEL'));});
test('prepared prompt is authored-public projection, not hidden free-text transfer',()=>{const c=fresh();c.question('PRIVATE_SENTINEL_768');c.navigate('rete');c.select('part-b');assert.match(c.publicPrompt(),/Componente B/);assert.match(c.publicPrompt(),/Fornitori/);assert.ok(!c.publicPrompt().includes('PRIVATE_SENTINEL'));});
test('visible edges never project absent endpoints',()=>{for(const id of CONTEXT_IDS){const nodes=new Set(CONTEXTS[id].nodes.map(n=>n.id));for(const r of visibleRelations(id)){assert.ok(nodes.has(r.from)&&nodes.has(r.to));}}});
function adapterFixture(){
 const controller=fresh(),events=new EventTarget();let handler=null,current='studio',calls=0;
 const surface={controller,observeContext:id=>controller.navigate(id),setNavigationHandler:fn=>{handler=fn;}};
 const company={context:()=>current,openContext(id){calls++;current=id;events.dispatchEvent(new CustomEvent('kn:company-context',{detail:{contextId:id,effect:'presentation_only'}}));}};
 return {controller,events,surface,company,get calls(){return calls;},request:id=>handler(id),setCurrent:id=>{current=id;}};
}
test('integration enters from host observation, not a new case store',()=>{const f=adapterFixture(),dispose=connectCompanyContext(f.surface,f.company,{eventTarget:f.events});assert.equal(f.controller.snapshot().contextId,'studio');assert.equal(f.calls,0);dispose();});
test('outgoing context is confirmed by host readback without recursive calls',()=>{const f=adapterFixture(),dispose=connectCompanyContext(f.surface,f.company,{eventTarget:f.events});const r=f.request('rete');assert.equal(r.contextId,'rete');assert.equal(f.controller.snapshot().contextId,'studio');f.controller.navigate(r.contextId);assert.equal(f.controller.snapshot().contextId,'rete');assert.equal(f.calls,1);dispose();});
test('spoofed or stale host event cannot confirm a different controller state',()=>{const f=adapterFixture(),dispose=connectCompanyContext(f.surface,f.company,{eventTarget:f.events});f.events.dispatchEvent(new CustomEvent('kn:company-context',{detail:{contextId:'service',effect:'presentation_only'}}));assert.equal(f.controller.snapshot().contextId,'studio');dispose();});
test('failed host request does not optimistically change reading',()=>{const f=adapterFixture(),dispose=connectCompanyContext(f.surface,f.company,{eventTarget:f.events});f.company.openContext=()=>{};assert.throws(()=>f.request('service'),/non confermato/);assert.equal(f.controller.snapshot().contextId,'studio');dispose();});
test('local orientation does not pretend to be a public host target',()=>{const f=adapterFixture(),dispose=connectCompanyContext(f.surface,f.company,{eventTarget:f.events});assert.equal(f.request('overview').scope,'local_orientation_only');assert.equal(f.calls,0);dispose();});
test('adapter disposal stops later host updates',()=>{const f=adapterFixture(),dispose=connectCompanyContext(f.surface,f.company,{eventTarget:f.events});dispose();f.company.openContext('service');assert.equal(f.controller.snapshot().contextId,'studio');});

test('unexpected host result is observed but never confirms requested target',()=>{const f=adapterFixture(),dispose=connectCompanyContext(f.surface,f.company,{eventTarget:f.events});f.company.openContext=()=>f.setCurrent('cantiere');assert.throws(()=>f.request('service'));assert.equal(f.controller.snapshot().contextId,'cantiere');dispose();});
