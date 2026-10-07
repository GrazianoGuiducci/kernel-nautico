/** Public source distribution. No historical AI results or private meeting kit. */
import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const app=resolve(import.meta.dirname,'..');
const git=(...args)=>execFileSync('git',args,{cwd:app,encoding:'utf8'}).trim();
const root=git('rev-parse','--show-toplevel'), revision=git('rev-parse','HEAD');
const out=resolve(app,'dist');
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const paths=['KERNEL.md','COMPETENCE_FIELD.md','docs/PUBLIC_PURPOSE.md','docs/COMPETENCE_FORMATION.md','docs/SEMANTIC_OPERATING_RELATION.md','docs/LEARNING.md','docs/NAUTICAL_REFERENCE_OPERATING_MODEL_0_1.md','docs/NAUTICAL_OPERATIONAL_SPATIAL_SURFACE_0_1.md','docs/NAUTICAL_DESIGN_PROPOSAL_CONTINUITY_0_1.md','docs/ENTERPRISE_BOOTSTRAP_AND_KERNEL_TOPOLOGY_0_1.md','src/data/story.js'];
const manifest=[];
for(const path of paths){
 const source=path.startsWith('src/')?resolve(app,path):resolve(root,path);
 const target=resolve(out,'public-receiver/sources',path.startsWith('src/')?'workstations/visual-presentation/production/threejs-first-encounter/app/'+path:path);
 await mkdir(dirname(target),{recursive:true});await cp(source,target);
 manifest.push({path:'sources/'+(path.startsWith('src/')?'workstations/visual-presentation/production/threejs-first-encounter/app/'+path:path),sha256:sha256(await readFile(source)),revision});
}
await mkdir(resolve(out,'encounter'),{recursive:true});
await cp(resolve(root,'docs/COLLABORATION.md'),resolve(out,'encounter/COLLABORATION.md'));
await cp(resolve(root,'docs/LEARNING.md'),resolve(out,'encounter/LEARNING.md'));
await cp(resolve(root,'docs/PUBLIC_RECEIVER_ENTRY.md'),resolve(out,'public-receiver/START.md'));
await writeFile(resolve(out,'public-receiver/MANIFEST.json'),JSON.stringify({schema:'kn.public-source-pack.v1',revision,files:manifest,examples:'illustrative',aiInferencePerformed:false},null,2)+'\n');
console.log('Curated public sources built. No private kit or historical AI records.');
