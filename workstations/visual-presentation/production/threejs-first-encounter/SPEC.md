# Kernel Nautico — Three.js First Encounter Specification

## 1. Receiver

Assume zero prior context.

Within the first encounter the receiver should be able to form these relations without knowing D-ND vocabulary:

~~~text
this is AI
+ this is Kernel Nautico
+ it is not merely a chatbot beside the work
+ it can participate across the nautical product lifecycle
+ meaningful reasons / states / consequences remain connected
+ experience can become later capability
~~~

Internal terms such as KA, FDLA, V-01, R-01, semantic kernel or enterprise incarnation must not be prerequisites for comprehension.

## 2. Dominant visual idea

**One yacht remains recognizable while both the product and the intelligence around it evolve.**

Use:

~~~text
FORM
  intent / concept / design / engineering

BUILD
  configuration / production / integration / commissioning

LIVE
  accepted vessel / operation / service / refit / lifecycle

RETURN
  consequence -> reusable difference -> later capability
~~~

The first demonstrator may compress these acts heavily. The purpose is causal legibility, not process inventory.

## 3. AI / Kernel signature

Do not represent AI as:
- brain imagery;
- generic neural networks;
- glowing omniscient core;
- chatbot bubble;
- unexplained particle swarms;
- generic app-to-app arrows.

Represent the Kernel through continuity traces whose origin and destination remain meaningful.

Examples:

~~~text
reason -> design state
design state -> configured/product state
product identity -> lifecycle event
event -> consequence
consequence -> later design / capability
~~~

## 4. Visual reference

The exact Project/Library image named `Kernel Nautico_ Intelligenza Marittima a Ciclo Continuo(1).png`, when reachable, and the repository `VISUAL_REFERENCE.md` are **visual direction references only**.

Preserve useful qualities:
- premium nautical first impression;
- dark maritime field;
- warm restrained accents;
- clear hero yacht;
- technical/engineering intelligence;
- lifecycle readability;
- enough negative space for information.

Do not treat:
- the yacht design;
- text;
- logos;
- technical values;
- apparent UI;
- layout proportions

as product specifications to reproduce literally.

## 5. Experience architecture

Preferred first form:

~~~text
single full-screen page
persistent 3D yacht
cinematic state progression
FORM / BUILD / LIVE / RETURN navigation
very small explanatory layer
optional restrained inspect/orbit mode
~~~

Default behavior should work as a guided presentation.

Manual controls should not turn it into a sandbox before the story is understood.

## 6. State behavior

### FORM
Use line/wireframe/ghosted geometry and sparse source/reason anchors.
The yacht is becoming thinkable.

### BUILD
The same object acquires material/assembly/engineering depth.
If the GLB has meaningful submeshes, selected groups may separate or ghost.
If not, use material states, section/clipping, wireframe overlays and semantic anchors rather than inventing false subsystem structure.

### LIVE
The same yacht enters a maritime environment.
Use water/environment/camera continuity; technical information quiets rather than disappearing.
Delivery is a boundary, not a reset.

### RETURN
A lifecycle/service consequence makes one relation pertinent.
Show a governed return toward a later product/engineering/capability state.
Avoid decorative circular arrows. The returned difference must have a legible destination.

## 7. Persistent scene model

Keep a semantic scene graph even if the first external asset is imperfect.

Suggested logical ownership:

~~~text
KN_ROOT
  KN_YACHT
  KN_CONTINUITY
  KN_ANCHORS
  KN_ENVIRONMENT
  KN_LABELS
  KN_CAMERAS
~~~

When imported GLB parts are identifiable, register them in a semantic map rather than renaming destructively.

Keep data/state separate from rendering where practical.

Suggested runtime state:

~~~js
currentAct: "FORM" | "BUILD" | "LIVE" | "RETURN"
progress: 0..1
selectedAnchor: null | id
mode: "guided" | "inspect"
reducedMotion: boolean
~~~

## 8. Architecture should be UI-ready, not UI-complete

Today's demonstrator should make later evolution possible through:
- stable state machine;
- semantic scene ownership;
- GLB asset isolation;
- camera presets;
- editable labels/data;
- clean event boundaries;
- reusable renderer/scene modules.

Do not build:
- roles and permissions;
- operational dashboards;
- enterprise data adapters;
- vessel bridge controls;
- work-order flows;
- PLM/BOM/QMS interfaces.

## 9. Technical stack

Preferred:

~~~text
vanilla JavaScript ES modules
Three.js
Vite or equivalent simple local dev environment
GLTFLoader
OrbitControls only when inspect mode is enabled
CSS2DRenderer for editable labels where needed
official Water / current Three.js water primitive if visually sufficient
~~~

Avoid dependency accumulation.

Use custom lightweight interpolation/state transitions unless a dependency is materially justified.

## 10. Asset strategy

First proof optimizes for comprehension and visual credibility, not proprietary yacht geometry.

Order:

~~~text
1. inspect legally reusable existing GLB candidates
2. select the smallest asset that gives a credible premium yacht silhouette
3. preserve attribution/provenance
4. adapt materials/camera/semantic presentation non-destructively
5. replace later only if the field proves an original asset is worth the cost
~~~

No CC BY-NC / non-commercial asset for the intended encounter path.

## 11. Reality boundary

Do not imply:
- an existing Ferretti/Pershing relationship;
- access to their internal data or systems;
- that a depicted yacht is their product;
- autonomous navigation or safety-critical control;
- a deployed vessel kernel;
- unrestricted telemetry;
- automatic learning across vessels;
- ROI not evidenced by a real company field.

## 12. Performance / resilience

The first version is desktop-first but should resize cleanly.

Provide:
- loading state;
- graceful asset-load failure;
- static/reduced-motion path;
- no console errors;
- deterministic state transitions;
- screenshot-capable FORM, BUILD, LIVE and RETURN states.

Do not trade comprehension for shader complexity.

## 13. Deliverables

The execution pass should create inside this folder (or a clearly named `app/` subfolder):

~~~text
package.json
index.html
src/
  main.js
  scene/
  states/
  ui/
  data/
public/
  models/
  media/
ASSET_PROVENANCE.md (updated with actual chosen runtime assets)
FORM.png / BUILD.png / LIVE.png / RETURN.png evidence where runtime capture permits
EXECUTION_RETURN.md
~~~

Exact internal layout may differ if the executor has a materially cleaner structure.

## 14. Acceptance

The demo is ready for review when:
- the yacht remains recognizably the same object;
- all four acts are intelligible;
- AI is legible through continuity rather than cliché;
- the first viewport looks like a serious premium nautical system;
- the artifact makes the zero-context relation available for later receiver testing; external comprehension is not claimed without an actual receiver;
- the architecture remains capable of becoming a richer spatial surface later;
- no unsupported company/product claim is introduced.


## 15. Proof and validation contract

`VALIDATION_AND_LEARNING_CONTRACT.md` is part of this specification.

Before closure:

- apply the temporary-yacht carrier gate;
- capture all four matched states;
- run the silent visual test before using final copy;
- validate the same runtime yacht/root across all four acts;
- state proof claims explicitly;
- separate perceptual continuity from engineering/data continuity;
- report actual runtime/browser evidence only.

## 16. Minimum editorial layer

The 3D relation carries the transformation.

The editable HTML/2D layer may orient the receiver with only the minimum needed
to establish:

~~~text
AI
Kernel Nautico
whole-life nautical product relation
FORM / BUILD / LIVE / RETURN
~~~

Editoriali owns consequential wording.

Do not repair weak visual causality by adding explanatory paragraphs.

## 17. Learning return

The execution is allowed to expose and return reusable learning.

Use the owner map in `GPT_PRO_BOOTSTRAP.md`.

A real reusable difference may update an owner-native competence/method on a
dedicated branch. An API trick, temporary asset workaround or tool preference
does not automatically become competence.

If existing knowledge was sufficient, return `no_change`.
