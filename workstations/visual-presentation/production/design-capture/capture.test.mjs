import test from 'node:test';
import assert from 'node:assert/strict';
import {createCapture, createCoderHandoff, assessBinding, normalizePoint} from './capture.mjs';
const fixture = () => ({
  id:'illustrative-capture-01',
  source:{id:'KN_YACHT',revision:'efe2e08188a9f8a8b5545993b073c250f31c727a',state:'illustrative_not_observed',assetRef:'motoryacht-35'},
  view:{id:'return-snapshot-01',width:1440,height:900,lifecycle:'RETURN',time:44.6},
  contributions:[
    {id:'mark-01',kind:'sketch',coordinateSpace:'normalized-captured-view',points:[[.2,.4],[.3,.5]]},
    {id:'note-01',kind:'operator-note',text:'Mostriamo il collegamento fra questa osservazione e il prossimo progetto.'}
  ],
  semanticRelation:{id:'kn.lifecycle.return-qualification',state:'exercised',scope:'owner_native_repository_and_reentry'},
});
test('capture preserves original source wording and leaves input untouched',()=>{
  const input=fixture(), before=JSON.stringify(input), capture=createCapture(input);
  assert.equal(JSON.stringify(input),before); assert.deepEqual(capture.contributions,input.contributions);
  capture.contributions[0].points[0][0]=.8; assert.equal(input.contributions[0].points[0][0],.2);
});
test('illustration and documented competence keep their own evidence states',()=>{
  const c=createCapture(fixture()); assert.equal(c.source.state,'illustrative_not_observed');
  assert.equal(c.semanticRelation.state,'exercised'); assert.equal(c.semanticRelation.scope,'owner_native_repository_and_reentry');
});
test('matching recorded identities do not claim that an asset was loaded',()=>{
  const c=createCapture(fixture()); assert.equal(assessBinding(c,c).state,'recorded_frame_identity_matches');
});
test('same semantic name does not remap marks to replacement geometry',()=>{
  const c=createCapture(fixture()), other=structuredClone(c); other.source.revision='replacement-yacht';
  assert.deepEqual(assessBinding(c,other).reasons,['source_revision_changed']);
});
test('camera or view change requires an explicit new relation',()=>{
  const c=createCapture(fixture()), other=structuredClone(c); other.view.id='different-camera';
  assert.equal(assessBinding(c,other).state,'needs_explicit_remapping');
});
test('normalized drawing coordinates preserve the original frame relation',()=>{
  assert.deepEqual(normalizePoint(288,360,1440,900),[.2,.4]);
  assert.throws(()=>normalizePoint(1,1,0,900));
});
test('handoff separates source, operator request, and AI interpretation',()=>{
  const h=createCoderHandoff(fixture(),{request:'Prepara una variante',baseRevision:'e026f4b',interpretation:{status:'proposal',text:'Possibile collegamento visuale'}});
  assert.equal(h.capture.contributions[1].kind,'operator-note'); assert.equal(h.interpretation.status,'proposal');
  assert.equal(h.effect.executionAuthorizedByRecord,false); assert.equal(h.effect.disposition,'prepared_only');
});
test('export and import preserve the whole capture, including future contribution kinds',()=>{
  const input=fixture();input.contributions.push({id:'later-01',kind:'future-spatial-gesture',payload:{source:'operator',relation:'still-open'}});
  const c=createCapture(input); assert.deepEqual(createCapture(JSON.parse(JSON.stringify(c))),c);
});
test('unknown schema version is not silently rewritten',()=>{
  assert.throws(()=>createCapture({...fixture(),schema:'kn.design-capture.future'}));
});
test('ambiguous contribution identities and non-finite coordinates are rejected',()=>{
  const duplicate=fixture();duplicate.contributions.push(duplicate.contributions[0]);assert.throws(()=>createCapture(duplicate));
  const nonfinite=fixture();nonfinite.contributions[0].points[0][0]=NaN;assert.throws(()=>createCapture(nonfinite));
});
