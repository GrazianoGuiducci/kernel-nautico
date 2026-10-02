import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { MODEL } from '../src/data/story.js';
const root=resolve(import.meta.dirname,'..'), directory=resolve(root,'public/models'), tools=resolve(import.meta.dirname,'asset-tools');
const hash=b=>createHash('sha256').update(b).digest('hex');
const output=resolve(directory,'yacht.glb');
try{if(hash(await readFile(output))===MODEL.sha256){console.log('Verified runtime model already present.');process.exit(0);}}catch{}
await mkdir(directory,{recursive:true});await mkdir(tools,{recursive:true});
const source='https://raw.githubusercontent.com/bob6664569/open-water/285b6ce32057c70191a7fe16c31d979fa383ac64/site/assets/boats/motoryacht_10.7r.glb';
const response=await fetch(source,{signal:AbortSignal.timeout(60000)});
if(!response.ok)throw new Error(`Asset source returned ${response.status}`);
const data=Buffer.from(await response.arrayBuffer());
if(hash(data)!==MODEL.sourceSha256)throw new Error('Source identity mismatch: refusing the carrier.');
const original=resolve(directory,'source.tmp.glb'), candidate=resolve(directory,'candidate.tmp.glb');
await writeFile(original,data);
const npm=process.env.npm_execpath?process.execPath:'npm';
const npmPrefix=process.env.npm_execpath?[process.env.npm_execpath]:[];
if(process.platform==='win32'&&!process.env.npm_execpath)throw new Error('On Windows, invoke this script with npm run assets.');
// Asset-build tooling is isolated from runtime dependencies. An exact output hash
// prevents silent tool/transitive drift even before a resolved tool lock is present.
try{await readFile(resolve(tools,'package-lock.json'));execFileSync(npm,[...npmPrefix,'ci','--prefix',tools,'--no-audit','--no-fund'],{stdio:'inherit'});}
catch(error){if(error.code!=='ENOENT')throw error;
 await writeFile(resolve(tools,'package.json'),JSON.stringify({name:'kn-asset-tools',private:true,dependencies:{'@gltf-transform/cli':'4.5.0'}},null,2));
 execFileSync(npm,[...npmPrefix,'install','--prefix',tools,'--no-audit','--no-fund'],{stdio:'inherit'});}
try{
 const cliRoot=resolve(tools,'node_modules/@gltf-transform/cli');
 const cliPackage=JSON.parse(await readFile(resolve(cliRoot,'package.json'),'utf8'));
 const cliEntry=typeof cliPackage.bin==='string'?cliPackage.bin:cliPackage.bin['gltf-transform'];
 execFileSync(process.execPath,[resolve(cliRoot,cliEntry),'simplify',original,candidate,'--ratio','0.18','--error','0.001'],{stdio:'inherit'});
 if(hash(await readFile(candidate))!==MODEL.sha256)throw new Error('Optimized model differs from the inspected carrier; do not adopt automatically.');
 await rename(candidate,output);console.log(`Verified ${MODEL.bytes} byte carrier. Attribution: motoryacht 35, angelo raffaele catalano, CC BY 4.0.`);
}finally{await rm(original,{force:true});await rm(candidate,{force:true});}
