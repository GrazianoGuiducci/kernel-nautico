import { cp, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { isContained } from './path-boundary.mjs';
import { createHash } from 'node:crypto';
import { MODEL } from '../src/data/story.js';
import { writeSourceBinding } from './product-source-binding.mjs';
import { writeCompanySourceBinding } from './company-source-binding.mjs';
import { execFileSync } from 'node:child_process';
const root=resolve(import.meta.dirname,'..'), out=resolve(root,'dist');
const model=await readFile(resolve(root,'public/models/yacht.glb'));
if(createHash('sha256').update(model).digest('hex')!==MODEL.sha256)throw new Error('Unverified model. Run npm run assets.');
await mkdir(out,{recursive:true});
await cp(resolve(root,'src'),resolve(out,'src'),{recursive:true});
await cp(resolve(root,'public'),out,{recursive:true});
await cp(resolve(root,'index.html'),resolve(out,'index.html'));
// Preserve one source owner for design-capture; relocate its import only in the
// offline browser distribution. Node tests import the canonical source module.
const capture=resolve(root,'../..','design-capture/capture.mjs');
await cp(capture,resolve(out,'src/product/capture.mjs'));
const contractPath=resolve(out,'src/product/contract.js');
const contract=await readFile(contractPath,'utf8');
const originalImport="../../../../design-capture/capture.mjs";
if(!contract.includes(originalImport))throw new Error('Canonical design-capture import changed: review browser relocation.');
await writeFile(contractPath,contract.replace(originalImport,'./capture.mjs'));
const sourceBinding=await writeSourceBinding(root,out);
const companySourceBinding=await writeCompanySourceBinding(root,out);
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
  vendorModules:[...visited].map(p=>relative(pkg,p)),externalRuntimeDependencies:0,
  runtimeRevision:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
  runtimeWorktreeDirty:execFileSync('git',['status','--porcelain','--untracked-files=normal','--','.','../../design-capture'],{cwd:root,encoding:'utf8'}).trim().length>0,
  sourceRevision:sourceBinding.revision,sourceContextDigest:sourceBinding.contextDigest,
  companySourceRevision:companySourceBinding.revision,companyContextDigest:companySourceBinding.contextDigest,
  companySourceAvailability:companySourceBinding.availability,
  sourceAvailability:sourceBinding.availability,designCaptureSHA256:createHash('sha256').update(await readFile(capture)).digest('hex')},null,2));
console.log(`Built ${out}: ${visited.size} Three modules, verified model, no external runtime dependencies.`);
