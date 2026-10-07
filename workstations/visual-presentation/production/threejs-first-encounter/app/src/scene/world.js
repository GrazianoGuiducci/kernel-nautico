import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadCarrier } from './carrier.js';
import { makeEnvironment } from './environment.js';
import { ACTS } from '../data/story.js';
import { smooth } from '../core/timeline.js';

export async function createWorld(host, invalidate) {
  const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
  renderer.localClippingEnabled=true;
  renderer.domElement.setAttribute('aria-hidden','true');host.appendChild(renderer.domElement);
  const scene=new T.Scene();scene.name='KN_ROOT';
  const camera=new T.PerspectiveCamera(32,1,.05,400); camera.name='KN_CAMERA';
  const cameraOwner=new T.Group();cameraOwner.name='KN_CAMERAS';scene.add(cameraOwner);cameraOwner.add(camera);
  const target=new T.Vector3(-2.3,.6,0), controls=new OrbitControls(camera,renderer.domElement);
  controls.enabled=false;controls.enablePan=false;controls.enableDamping=false;
  controls.minDistance=13;controls.maxDistance=25;controls.minPolarAngle=.65;controls.maxPolarAngle=1.40;
  controls.minAzimuthAngle=-1.20;controls.maxAzimuthAngle=.10;
  controls.addEventListener('change',invalidate);
  const env=makeEnvironment(scene,renderer), yacht=await loadCarrier();scene.add(yacht.root);
  const continuum=new T.Group();continuum.name='KN_CONTINUITY';continuum.userData.semanticId='stern-access-to-design-criterion';scene.add(continuum);
  const ring=new T.Mesh(new T.TorusGeometry(.10,.014,8,32),new T.MeshBasicMaterial({color:0xe0b48a}));continuum.add(ring);
  const anchors=new T.Group();anchors.name='KN_ANCHORS';scene.add(anchors);
  const labels=new T.Group();labels.name='KN_LABELS';scene.add(labels);
  const box=new T.Box3().setFromObject(yacht.root);
  const corners=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])corners.push(new T.Vector3(x,y,z));
  let width=1,height=1,frame,inspection=false,draws=0;
  function projectedBounds(){camera.updateMatrixWorld();const points=corners.map(v=>v.clone().project(camera));
    return {left:Math.min(...points.map(v=>(v.x*.5+.5)*width)),right:Math.max(...points.map(v=>(v.x*.5+.5)*width)),
      top:Math.min(...points.map(v=>(-.5*v.y+.5)*height)),bottom:Math.max(...points.map(v=>(-.5*v.y+.5)*height))};}

  function resize(){width=host.clientWidth;height=host.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;
    // On narrow screens use a wider lens, not a cropped desktop shot.
    camera.fov=width<600?48:32;camera.updateProjectionMatrix();invalidate();}
  resize();
  const observer=new ResizeObserver(resize);observer.observe(host);
  function apply(f){frame=f;yacht.apply(f);env.apply(f);
    if(!inspection){
      const prev=ACTS[Math.max(0,f.index-1)].eye, now=f.act.eye;
      const blend=f.index===0?1:smooth(f.progress*f.act.duration/1.05);
      camera.position.set(...prev).lerp(new T.Vector3(...now),blend);
      target.set(width<600?-.1:-2.3,width<600?.75:.6,0);
      camera.position.multiplyScalar(width<600?1.60:1.07);
      camera.lookAt(target);
      // Fit the complete product, not only the DOM controls, inside the viewport.
      for(let n=0;n<12;n++){const b=projectedBounds(),margin=width<600?20:28;
        if(b.left>=margin&&b.right<=width-margin)break;
        camera.position.sub(target).multiplyScalar(1.055).add(target);camera.lookAt(target);}
      controls.target.copy(target);
    }
    const position=yacht.anchor.getWorldPosition(new T.Vector3());ring.position.copy(position);
    ring.quaternion.copy(camera.quaternion);ring.scale.setScalar(f.index===3?1.4:1);
    renderer.render(scene,camera);draws++;
  }
  return {renderer,scene,camera,resize,apply,
    setInspect(value){inspection=Boolean(value);controls.enabled=inspection;controls.target.copy(target);invalidate();},
    projectAnchor(){const p=yacht.anchor.getWorldPosition(new T.Vector3()).project(camera);return {x:(p.x*.5+.5)*width,y:(-.5*p.y+.5)*height,visible:p.z>=-1&&p.z<=1};},
    snapshot(){return {...yacht.snapshot(),act:frame?.currentAct,seconds:frame?.seconds,
      sceneGraph:scene.children.map(o=>o.name).filter(Boolean),continuityId:continuum.userData.semanticId,
      continuityUUID:continuum.uuid,inspection,camera:camera.position.toArray(),target:target.toArray(),
      viewport:[width,height],projectedProductBounds:projectedBounds(),draws,renderInfo:renderer.info.render,...env.snapshot()};},
    dispose(){observer.disconnect();controls.dispose();renderer.dispose();}
  };
}
