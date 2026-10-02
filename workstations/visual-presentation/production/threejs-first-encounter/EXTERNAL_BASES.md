# External Bases — Three.js First Encounter

~~~text
observed: 2026-10-02
purpose: implementation acceleration, not semantic authority
~~~

Use external sources to avoid reinventing solved rendering/loading mechanics.
Do not import their product story or visual ontology.

## 1. Three.js official — primary technical authority

### Package

Observed npm release on 2026-10-02:

~~~text
three 0.186.0
license: MIT
~~~

Confirm current package state when executing if material.

### GLTFLoader

https://threejs.org/docs/pages/GLTFLoader.html

Use for browser-native glTF/GLB loading.

Relevant capability:
- glTF 2.0;
- animation clips;
- modern material extensions;
- Draco / KTX2 / Meshopt integration when needed.

### CSS2DRenderer

https://threejs.org/docs/pages/CSS2DRenderer.html

Use when a small editable HTML information layer should track 3D anchors.

### Animation System

https://threejs.org/manual/pages/animation-system.html

Three.js can animate transforms, visibility, material properties, morph targets and imported clips.

### Water

https://threejs.org/docs/pages/Water.html

Start with official water capability before adopting a complex external ocean simulation.

### Official glTF example

https://github.com/mrdoob/three.js/blob/dev/examples/webgl_loader_gltf.html

Useful implementation pattern:
load -> compile -> add -> frame model.

## 2. Open Water — strong reference implementation

Repository:

https://github.com/bob6664569/open-water

Current public description:
browser-based 3D powerboat simulation using vanilla Three.js.

Useful for studying:
- GLB vessel loading;
- camera composition;
- maritime environment;
- water/sky;
- modular Three.js organization;
- adaptive quality;
- asset provenance.

Source-code license:
MIT.

Important:
the repository is mixed-license for media. Do not copy media blindly.

Third-party notices:

https://github.com/bob6664569/open-water/blob/main/THIRD_PARTY_NOTICES.md

### Potential temporary yacht carrier

`site/assets/boats/motoryacht_10.7r.glb`

Source:
"motoryacht 35" by angelo raffaele catalano.

Recorded license:
CC BY 4.0.

This makes it a possible development/demo carrier **if** exact attribution and license obligations are preserved.

It is not Kernel Nautico identity and should not become the final proprietary asset by inertia.

### Explicitly exclude

`site/assets/boats/frickies_yacht.glb`

Recorded license:
CC BY-NC 4.0.

Do not use it for the current path because the demonstrator is intended to support possible commercial/funding/company conversations.

## 3. Alternative CC BY visual candidates

Use only after checking the live license/download state at execution time.

### Luxury yacht study

https://sketchfab.com/3d-models/yacth-ba98e1465c9844709b30f24b3ec886e0

Observed:
- modern luxury yacht;
- downloadable;
- CC Attribution.

### Low-poly yacht

https://sketchfab.com/3d-models/yacht-0dd451f295d049cea20c17d3ffa87ee3

Observed:
- yacht/motoryacht;
- downloadable;
- CC Attribution.

These are candidate carriers only. Verify rights and download conditions before use.

## 4. Model-viewer architecture reference

https://github.com/mahiAlqiama/threejs-gltf-model-visualizer

Useful ideas:
- `ModelLoader`;
- `CameraController`;
- `SceneManager`;
- model stats/inspection;
- replaceable GLB source.

Do not copy code until its actual license is verified.

## 5. What to reuse versus what to form

Reuse/assimilate:
- GLB loading;
- model framing;
- camera control;
- water/environment mechanics;
- label anchoring;
- transition/animation mechanics;
- performance/provenance patterns.

Form specifically for Kernel Nautico:
- FORM -> BUILD -> LIVE -> RETURN state semantics;
- continuity trace;
- zero-context cognitive entry;
- current/direction/horizon boundaries;
- lifecycle consequence -> later capability relation;
- premium nautical presentation grammar.

External code is a means. It is not the source of the Kernel Nautico story.
