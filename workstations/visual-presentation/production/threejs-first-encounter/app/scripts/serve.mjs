import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { isContained } from './path-boundary.mjs';
const root=resolve(import.meta.dirname,'../dist'), port=Number(process.env.PORT||8876);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
 '.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.md':'text/plain; charset=utf-8'};
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('PORT must be between 1024 and 65535.');
createServer(async(req,res)=>{
 try{
  const decoded=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const path=resolve(root,'.'+(decoded==='/'?'/index.html':decoded));
  if(!isContained(root,path)){res.writeHead(403);return res.end('Forbidden');}
  const info=await stat(path);if(!info.isFile())throw new Error('Not a file');
  res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Content-Length':info.size,
   'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});createReadStream(path).pipe(res);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${port} (dist only; no deployment)`));
