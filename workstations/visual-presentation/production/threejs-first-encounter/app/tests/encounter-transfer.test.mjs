import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareProjection,validateProjectionWork} from '../src/encounter/model.js';
test('actual transfer bytes survive validated local-draft reentry', async () => {
  const snapshot={case:{id:'illustrative-private-case',events:[]},revision:{id:'revision-1'},request:null,result:null,sourceStatus:{state:'current'}};
  const form={scope:'public_candidate',kind:'reusable-method',owner:'Nautico',title:'Conservare una distinzione',method:'Confrontare le fonti prima di unire due stati.',reason:'Potrebbero descrivere tempi diversi.',nextUse:'Quando cambia la fonte applicabile.',limits:'Esempio meccanico, non una prova di inferenza.',reviewed:true};
  const work=await prepareProjection(snapshot,form);
  const encode=value=>JSON.stringify(value,null,2)+'\n';
  const restored=await validateProjectionWork(snapshot,encode(work));
  assert.equal(encode(restored.candidate),encode(work.candidate));
  assert.equal(encode(restored),encode(work));
});
