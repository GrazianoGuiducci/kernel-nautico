import test from 'node:test';import assert from 'node:assert/strict';import path from 'node:path';
import {isContained} from '../scripts/path-boundary.mjs';
for(const [name,p,root] of [['POSIX',path.posix,'/app/dist'],['Windows',path.win32,'C:\\app\\dist']]) {
  test(name+' includes a descendant',()=>assert.equal(isContained(root,p.join(root,'src','main.js'),p),true));
  test(name+' rejects parent traversal',()=>assert.equal(isContained(root,p.resolve(root,'../private.json'),p),false));
  test(name+' rejects sibling prefix collision',()=>assert.equal(isContained(root,p.resolve(root+'-private','file'),p),false));
}
test('Windows rejects another drive',()=>assert.equal(isContained('C:\\app','D:\\app\\index.html',path.win32),false));
