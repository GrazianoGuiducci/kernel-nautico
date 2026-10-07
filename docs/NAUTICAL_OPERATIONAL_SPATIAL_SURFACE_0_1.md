# Kernel Nautico — Nautical Operational Spatial Surface 0.1

~~~text
formed: 2026-10-02
status: candidate product/interaction surface / first nautical incarnation
owner: GrazianoGuiducci/kernel-nautico
design_owner: GrazianoGuiducci/d-nd-ux-ai-seed
authority_owner: receiving runtime / policy / company or vessel authority model
renderer: unresolved
~~~

## Identity

The 3D product representation can become more than presentation.

It can become a **semantic-operational coordinate system** through which a
person understands, navigates and acts in the nautical product field.

~~~text
product / vessel model
+ lifecycle state
+ source / configuration / event relations
+ current role
+ current task
+ authority / permissions
-> role-relative operational surface
~~~

The surface does not own the underlying product truth, permissions or actions.
It makes those relations perceptible and reachable.

## Why this follows from the current kernel

Kernel Nautico already carries:

- V-01 Causal Product Continuity;
- Nautical Reference Operating Model 0.1;
- enterprise-kernel vs vessel-instance distinction;
- Public Kernel 3D Visual Presentation;
- FORM -> BUILD -> LIVE -> RETURN;
- source/reason/configuration/event/consequence continuity.

The same 3D/spatial grammar that explains the kernel publicly can therefore be
tested as a navigable operational surface.

~~~text
presentation object
-> explorable semantic product map
-> task / source / state navigation
-> bounded action surface
~~~

Do not assume the public hero animation and the operational UI are the same
artifact. They can share product identity, visual grammar and scene assets while
having different state, interaction and authority contracts.

## Core invariant — the product is the coordinate system

Do not begin from a generic dashboard taxonomy.

Begin from the object and its causal/lifecycle relations.

~~~text
whole yacht
-> zone / deck / system
-> subsystem
-> component / interface
-> requirement / reason / source
-> configuration / state
-> task / event / consequence
-> competence / next movement
~~~

The current object remains visible while depth changes.

This is semantic zoom, not only geometric zoom.

## Role-relative views

The same product truth can be projected differently without duplicating the
truth owner.

### Design / concept

Possible visible relations:

- intent / requirement;
- alternatives / variants;
- general arrangement;
- design rationale;
- source and decision history;
- concept-to-engineering transitions;
- open questions / pending decisions.

Possible actions depend on authority:

- inspect;
- compare;
- propose variant;
- annotate;
- request analysis;
- submit a design decision.

### Engineering

Possible visible relations:

- system architecture;
- interfaces;
- engineering definition;
- configuration / BOM;
- change lineage;
- technical sources;
- calculations / checks;
- class/conformity relations when applicable.

### Programme / project

Possible visible relations:

- current product state;
- milestones;
- unresolved dependencies;
- work-package relations;
- decision ownership;
- change impact;
- commissioning readiness.

### Procurement / supply / logistics

Possible visible relations:

- part/system identity;
- supplier;
- approval / qualification;
- expected/actual availability;
- dependency on production operations;
- substitution/change relation;
- receiving / warehouse / staging state where integrated.

### Production

Possible visible relations:

- physical build state;
- work package;
- required material/component;
- production instruction;
- dependency / predecessor;
- installed vs planned state;
- blocked / ready / completed conditions;
- configuration discrepancy.

### Quality

Possible visible relations:

- inspection point;
- approved source/specification;
- non-conformity;
- evidence;
- affected component/system;
- corrective action;
- closure / acceptance state.

### Commissioning / trials

Possible visible relations:

- system readiness;
- commissioning checklist;
- dock-test state;
- trial result;
- unresolved issue;
- product-instance activation boundary;
- as-built reconciliation.

### Service / refit

Possible visible relations:

- actual as-built configuration;
- manuals/certificates;
- service history;
- maintenance state;
- event / fault / intervention;
- replaced component;
- refit/change lineage;
- consequence / learning candidate.

### Bridge / crew / owner

Possible visible relations must be much more constrained.

Candidate functions:

- vessel orientation;
- system knowledge;
- manuals/procedures;
- maintenance/status information;
- contextual assistant;
- service communication;
- authorized operational information;
- owner/crew experience relation.

Do not infer navigation/control authority, safety-critical control, telemetry
access or autonomous operation from the existence of the UI.

## Three main surface families

### 1. Product Development Surface

~~~text
FORM + BUILD
-> concept / engineering / configuration / production / quality / commissioning
~~~

Primary users:
design, engineering, programme, procurement, production, quality, commissioning.

### 2. Enterprise Operations Surface

~~~text
company field
+ product/programme state
+ roles / decisions / work / sources / competences
-> situated operating workspace
~~~

This can cross several yachts/projects without collapsing them into one product
instance.

### 3. Vessel / Bridge Surface

~~~text
specific vessel instance
+ legitimate onboard/local sources
+ crew/owner/service role
+ vessel authority profile
-> product-local operational / knowledge surface
~~~

This surface has a distinct authority and privacy boundary from the enterprise
kernel.

## Spatial selection -> context

A 3D selection should not simply open a popover.

It should be able to form a bounded context capsule.

~~~text
selected object / region
+ current vessel/project
+ lifecycle state
+ current role
+ source freshness
+ related configuration
+ active task / event
+ permitted capabilities
-> contextual working surface
~~~

From there the kernel can expose only the sources, competences and actions that
can materially change the current object.

## Authority model

The interface displays authority; it does not create it.

Keep distinct:

~~~text
see
inspect depth
comment / annotate
propose
create / edit
approve
execute / command
publish / release
override
administer permissions
~~~

A role alone should not grant action. Resolve authority from the actual
receiving system, object, state and policy.

Candidate relation:

~~~text
identity / role
+ active object
+ current lifecycle state
+ capability manifest
+ policy / authority ceiling
-> visible actions
-> preview / validation / recovery relation
~~~

Selection, confirmation, execution and publication remain different meanings.

## Permission-sensitive information depth

Permissions can change both **action** and **visible information depth**.

Examples:

~~~text
visitor / client
  product-level explanation only

production operator
  assigned work / relevant component / instruction / quality state

engineer
  technical sources / interfaces / configuration / change impact

programme lead
  cross-system dependencies / milestones / decision state

service technician
  as-built / maintenance / intervention history

crew
  operational knowledge relevant to assigned duties

owner
  selected vessel / service / experience information

administrator / authorized technical owner
  broader configuration / policy / system-management depth
~~~

These are example projections. Real company roles and access rules must be
mapped from the adopting organization.

## Temporal navigation

The spatial product also has time.

The UI should be able to move between:

~~~text
design intent
planned configuration
production state
as-built state
commissioned state
current vessel state
historical event
post-service state
later design consequence
~~~

This is critical for V-01: the same relation can remain understandable while
its carrier and state change.

## Source / truth relation

The 3D scene is not the source of truth.

Possible underlying owners include:

- CAD / PLM / PDM;
- ERP / procurement;
- MES / work management;
- QMS / non-conformity;
- document / manual sources;
- class / conformity sources;
- CRM / owner relation;
- service / maintenance system;
- vessel-local state;
- Kernel Nautico competence and causal relations.

The spatial surface composes their relevant projections around the selected
object.

~~~text
3D node / product region
-> semantic identity
-> owner-native source links
-> current state
-> permitted actions
~~~

Do not duplicate or silently overwrite source systems.

## From visual asset to operational asset

Reusable 3D assets can potentially serve several surfaces:

~~~text
hero / public presentation
collaboration deck
technical explanation
engineering/product navigation
production navigation
service navigation
vessel/bridge UI
~~~

But the representation level may differ.

A cinematic concept model is not automatically sufficient for engineering or
as-built operation.

Possible asset maturity:

~~~text
concept visual asset
-> semantically tagged product model
-> configuration-linked model
-> as-built vessel model
-> lifecycle-linked operational model
~~~

Do not claim digital-twin status solely from a 3D model. A full digital-twin
relation would require current state, source binding, synchronization/readback
and a defined operational scope.

## Interaction principles inherited from Design Kernel

Use D-ND Design Kernel / Interaction Quality:

- action meaning before component choice;
- selection != authorization;
- current object remains recognizable;
- state transitions preserve focus/origin/recovery;
- responsive meaning rather than simple geometric shrinking;
- Canvas/WebGL is not the only access path;
- keyboard/accessibility alternatives remain available;
- motion explains state change rather than simulating activity.

Use Cognitive Motion when zoom, focus, state or surface transitions become
material.

## MAIOS operating-form relation

MAIOS already supplies useful portable distinctions:

~~~text
current objective / object
workflow state
missing decisions
proposed action
affected objects
permissions
validation
receipt
recovery
~~~

The nautical spatial surface can project those relations around the product
rather than around a generic panel stack.

## Candidate interaction example

~~~text
production operator selects starboard machinery zone
-> product model resolves installed/planned subsystem identity
-> current work package becomes visible
-> only pertinent drawings / instruction / material / quality status appear
-> operator records observation
-> system classifies it as state | anomaly | learning candidate
-> authorized next action is proposed
-> effect generates receipt
-> consequence can update work state or competence
~~~

The example is illustrative; it is not a claim that such integration currently
exists.

## Candidate bridge example

~~~text
crew selects an onboard system
-> vessel-instance identity and authorized knowledge resolve
-> current manual / status / maintenance relation appears
-> contextual question can be asked
-> only permitted vessel/service actions are exposed
-> event can enter lifecycle history
-> reusable consequence may later return to enterprise competence if explicitly
   legitimate
~~~

Again, this is product architecture, not current deployed capability.

## Implementation boundary

Do not choose the renderer from this architecture.

Possible carriers may include:

- WebGL / Three.js;
- Unreal;
- native 3D/CAD viewer;
- desktop/web hybrid;
- tablet/touch surface;
- AR/VR later if materially useful;
- non-3D accessible fallback.

The correct carrier follows the real workstation, asset source, performance,
security and interaction requirements.

## Proof sequence

Do not build the full platform first.

Recommended evidence progression:

~~~text
P1  visual 3D model with semantic object identity
P2  semantic zoom + object inspector
P3  role-relative information projection
P4  one bounded read-only V-01 path across design -> build -> product instance
P5  one human-gated write/action with permission/receipt/recovery
P6  service/lifecycle event + consequence return
P7  vessel-instance / bridge projection with separate authority boundary
~~~

Each stage should teach the kernel and Design owner what the next surface
actually requires.

## Cross-kernel learning

This work may deepen the Public Kernel 3D Visual Presentation relation.

Do not generalize the operational-spatial UI to every public kernel yet.

Kernel Nautico is the first physical-product case. A non-physical kernel may
need a completely different operational coordinate system.

## Current disposition

This is a candidate product/interaction architecture.

It should now participate in:

- V-01 exercise;
- visual-master development;
- technical demonstrator planning;
- enterprise-incarnation design;
- later vessel/bridge product architecture.

Promote or split it only after execution exposes a reusable continuing
capability that existing Kernel Nautico + Design + MAIOS owners cannot carry.

## Context-specific visual morphology — operator selection 2026-10-06

The operator deepens the spatial-surface relation: each company/work context can
have its own visual representation functioning as a UI, rather than only
switching labels or panels around one unchanged scene.

~~~text
same yacht / product identity when useful
+ context-specific question
+ materially participating relations
-> context-specific visual morphology
-> selection / focus / comparison / source access when useful
~~~

This is compatible with the invariant that the product is a coordinate system,
but it corrects a possible over-literal reading: **the same coordinate system
does not require the same geometry in every context**.

The integrated demo explores these candidate morphologies:

- design: layered product / requirement / variant relation;
- build: sectional or assembly state with planned/installed/checked relations;
- supply: component path and supplier/dependency network anchored to the yacht;
- showroom: use/configuration/intention field;
- navigation: coordinated vessel/system and route/environment scales;
- service: as-built object plus event/intervention/verification/return history.

The yacht may be dominant, transformed, sectional, peripheral or only an anchor
depending on the visual question. A network or timeline can carry the primary
meaning when forcing a 3D hull into the centre would reduce understanding.

A context-specific surface remains a projection. It does not infer a connected
enterprise system, company authority, live telemetry or digital-twin state.
Accessible linear/static parity remains required.

This refinement is domain/product-specific and is already supportable by the
existing Design owners (Perceptual Composition, Source-Grounded Infographic,
Cognitive Motion and Interaction Quality). No new generic Design competence is
formed until execution exposes a residual reusable function those owners cannot
carry.
