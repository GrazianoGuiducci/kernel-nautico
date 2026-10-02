import { cp, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { isContained } from './path-boundary.mjs';
import { createHash } from 'node:crypto';
import { MODEL } from '../src/data/story.js';
const root=resolve(import.meta.dirname,'..'), out=resolve(root,'dist');
const model=await readFile(resolve(root,'public/models/yacht.glb'));
if(createHash('sha256').update(model).digest('hex')!==MODEL.sha256)throw new Error('Unverified model. Run npm run assets.');
await mkdir(out,{recursive:true});
await cp(resolve(root,'src'),resolve(out,'src'),{recursive:true});
await cp(resolve(root,'public'),out,{recursive:true});
await cp(resolve(root,'index.html'),resolve(out,'index.html'));
const pkg=resolve(root,'node_modules/three'), vendor=resolve(out,'vendor/three');
const visited=new Set();
async function copyModule(path){
  const absolute=resolve(pkg,path);
  if(!isContained(pkg,absolute))throw new Error('Invalid dependency path');
  if(visited.has(absolute))return;visited.add(absolute);
  const text=await readFile(absolute,'utf8'), destination=resolve(vendor,relative(pkg,absolute));
  await mkdir(dirname(destination),{recursive:true});await writeFile(destination,text);
  for(const match of text.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g))await copyModule(relative(pkg,resolve(dirname(absolute),match[1])));
}
for(const path of ['build/three.module.js','examples/jsm/loaders/GLTFLoader.js','examples/jsm/controls/OrbitControls.js',
 'examples/jsm/objects/Water.js','examples/jsm/environments/RoomEnvironment.js'])await copyModule(path);
await cp(resolve(pkg,'LICENSE'),resolve(vendor,'LICENSE'));
await writeFile(resolve(out,'BUILD.json'),JSON.stringify({three:'0.186.1',modelSHA256:MODEL.sha256,modelBytes:model.length,
  vendorModules:[...visited].map(p=>relative(pkg,p)),externalRuntimeDependencies:0},null,2));
console.log(`Built ${out}: ${visited.size} Three modules, verified model, no external runtime dependencies.`);
