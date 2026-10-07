import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MODEL } from '../data/story.js';
import { smooth } from '../core/timeline.js';

/** One verified carrier. Acts change presentation, never replace product identity. */
export async function loadCarrier() {
  const response = await fetch(MODEL.path);
  if (!response.ok) throw new Error(`Modello non disponibile (${response.status}).`);
  const bytes = await response.arrayBuffer();
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2,'0')).join('');
  if (digest !== MODEL.sha256) throw new Error('Identità del modello non verificata. Ripristina gli asset originali del pacchetto.');
  const { scene: imported } = await new GLTFLoader().parseAsync(bytes, '');
  const root = new T.Group(); root.name = MODEL.identity;
  root.userData = { semanticId: MODEL.identity, sha256: digest, carrierOnly: true };
  root.add(imported);
  imported.rotation.y = -Math.PI / 2;
  const box = new T.Box3().setFromObject(imported), center = box.getCenter(new T.Vector3());
  const scale = 10 / box.getSize(new T.Vector3()).x;
  imported.scale.setScalar(scale);
  imported.position.set(-center.x * scale, -box.min.y * scale - .65, -center.z * scale);
  imported.updateMatrixWorld(true);
  const records = [], edges = [], meshes = [];
  imported.traverse(o => { if (o.isMesh) meshes.push(o); });
  const clip = new T.Plane(new T.Vector3(-1,0,0), -6);
  const ghost = new T.MeshBasicMaterial({ color: 0x18394b, transparent: true, opacity: .18, depthWrite: false });
  const lineMaterial = new T.LineBasicMaterial({ color: 0x8bcde7, transparent: true, opacity: .62, depthWrite: false });
  for (const mesh of meshes) {
    const old = mesh.material, originalName = old.name;
    let color = old.color.clone(), metalness = .08, roughness = .4;
    if (['fiancate','chiglia1','blinn5'].includes(originalName)) color.set('#d3dadb');
    if (originalName === 'phongE2') color.set('#d1c8b7');
    if (originalName === 'blinn2') { color.set('#637781'); metalness = .7; roughness = .26; }
    if (originalName === 'lambert1') color.set('#102430');
    if (['blinn6','blinn7','blinn13'].includes(originalName)) { color.set('#1c3545'); metalness=.45; roughness=.20; }
    const material = new T.MeshStandardMaterial({ name: originalName, color, metalness, roughness,
      side: T.DoubleSide, clippingPlanes: [clip] });
    mesh.userData.originalMaterial = originalName;
    mesh.material = material;
    if (['fiancate','chiglia1','blinn5','coperta1','blinn6','blinn7'].includes(originalName)) {
      const wire = new T.LineSegments(new T.EdgesGeometry(mesh.geometry, 32), lineMaterial);
      wire.name = `${mesh.name}:presentation-edges`; wire.renderOrder = 2; mesh.add(wire); edges.push(wire);
    }
    records.push({ name: mesh.name, originalMaterial: originalName,
      triangles: (mesh.geometry.index?.count || mesh.geometry.attributes.position.count) / 3 });
    old.dispose();
  }
  // This coordinate is an illustrative visible stern-access witness, not a BOM part.
  const anchor = new T.Object3D(); anchor.name = 'stern-access'; anchor.position.set(-4.25,.58,.8); root.add(anchor);
  return {
    root, anchor, records, clip,
    apply(frame) {
      const { index, progress: p } = frame;
      const start = index === 0 ? (.25 + .75 * smooth((p + .04) / .35)) : 1;
      const wireOpacity = index === 0 ? .65 * start : index === 1 ? .49 : 0;
      lineMaterial.opacity = wireOpacity;
      for (const edge of edges) edge.visible = wireOpacity > .04;
      // A single plane reveals *existing* geometry; there are no fabricated assemblies.
      if (index === 0) {
        clip.constant = -6; ghost.opacity = .13 * start;
        for (const mesh of meshes) { if (!mesh.userData.solid) mesh.userData.solid = mesh.material; mesh.material = ghost; }
      } else {
        for (const mesh of meshes) if (mesh.userData.solid) mesh.material = mesh.userData.solid;
        clip.constant = index === 1 ? -5.2 + 10.6 * smooth(p) : 6;
      }
    },
    snapshot() { return { root: root.name, uuid: root.uuid, modelSHA256: digest,
      meshes: records, meshCount: meshes.length, triangleCount: records.reduce((s,r)=>s+r.triangles,0),
      manipulatedSubmeshes: [], technique: 'whole-carrier materialization + actual geometry edges + X clipping; no explosion',
      clipX: clip.constant, anchor: anchor.name }; }
  };
}
