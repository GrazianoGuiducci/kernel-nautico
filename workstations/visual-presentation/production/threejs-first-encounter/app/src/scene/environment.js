import * as T from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { smooth } from '../core/timeline.js';

/** Procedural presentation environment; no photographed location or external media. */
export function makeEnvironment(scene, renderer) {
  const group = new T.Group(); group.name = 'KN_ENVIRONMENT'; scene.add(group);
  const pmrem = new T.PMREMGenerator(renderer), room = new RoomEnvironment();
  const environmentMap = pmrem.fromScene(room, .06);
  scene.environment = environmentMap.texture; scene.environmentIntensity = .55;
  room.dispose(); pmrem.dispose();
  scene.add(new T.HemisphereLight(0xbfd9ef, 0x1a2c36, 1.05));
  const warm = new T.DirectionalLight(0xffd6a8, 2.1); warm.position.set(2,8,-5); scene.add(warm);
  const fill = new T.DirectionalLight(0xb6d9f2, 1.2); fill.position.set(-8,4,9); scene.add(fill);
  const skyMat = new T.ShaderMaterial({ side:T.BackSide, depthWrite:false, uniforms:{ life:{value:0} },
    vertexShader:'varying vec3 vP; void main(){vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`varying vec3 vP; uniform float life;
    void main(){vec3 d=normalize(vP); float h=smoothstep(-.10,.52,d.y);
      vec3 top=vec3(.018,.042,.072), horizon=mix(vec3(.045,.10,.145),vec3(.235,.235,.245),life);
      vec3 c=mix(horizon,top,h); float warm=pow(max(0.,dot(d,normalize(vec3(-.65,.075,-1.)))),22.);
      c+=vec3(.27,.125,.039)*warm*life; gl_FragColor=vec4(c,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }` });
  const sky = new T.Mesh(new T.SphereGeometry(180,32,16), skyMat); group.add(sky);
  // Deterministic normal field. Water is the official WebGL Water primitive.
  const N=64, pixels=new Uint8Array(N*N*4);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const i=4*(x+y*N), a=Math.sin(x*.53+y*.27)+.35*Math.sin(y*1.17-x*.23);
    const b=Math.cos(y*.41+x*.13)+.25*Math.cos(x*1.31+y*.36);
    pixels[i]=128+a*25;pixels[i+1]=128+b*25;pixels[i+2]=248;pixels[i+3]=255;
  }
  const normals=new T.DataTexture(pixels,N,N,T.RGBAFormat);
  normals.wrapS=normals.wrapT=T.RepeatWrapping;normals.magFilter=T.LinearFilter;normals.needsUpdate=true;
  const water=new Water(new T.PlaneGeometry(350,350),{textureWidth:256,textureHeight:256,
    waterNormals:normals,sunDirection:new T.Vector3(-.65,.3,-1).normalize(),
    sunColor:0xe0bd8c,waterColor:0x071c2b,distortionScale:1.3,alpha:1});
  water.rotation.x=-Math.PI/2; water.position.y=-.42; water.name='KN_WATER'; group.add(water);
  const grid=new T.GridHelper(34,34,0x456c7d,0x284554); grid.position.y=-.72;
  grid.material.transparent=true;grid.material.opacity=.36; group.add(grid);
  // Sparse construction bounds ground FORM/BUILD, without dimensions or engineered values.
  const positions=[-5,-.68,-1.6, 5,-.68,-1.6, 5,-.68,-1.6,5,-.68,1.6,
     5,-.68,1.6,-5,-.68,1.6,-5,-.68,1.6,-5,-.68,-1.6];
  const bounds=new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(positions,3)),
    new T.LineBasicMaterial({color:0x8bcde7,transparent:true,opacity:.4})); group.add(bounds);
  return {group,apply(frame){const life=frame.index<2?0:frame.index===2?smooth(frame.progress/.13):1;
    skyMat.uniforms.life.value=life;water.visible=life>.001;water.material.uniforms.alpha.value=life;
    water.material.uniforms.time.value=frame.seconds*.055;
    grid.visible=life<.98;grid.material.opacity=.32*(1-life);bounds.visible=frame.index<2;},
    snapshot(){return {water:'Three.js Water / procedural normals / 256px reflection',externalMedia:0};}};
}
