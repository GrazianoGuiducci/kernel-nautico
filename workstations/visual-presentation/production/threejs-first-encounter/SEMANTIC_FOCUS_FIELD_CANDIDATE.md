# Kernel Nautico — Semantic Focus Field Candidate

~~~text
formed: 2026-10-03
status: candidate architecture / exercise required
base_candidate: work/visual-threejs-first-encounter-20261002@e35403b
owner: Kernel Nautico
design_owner: D-ND Design Kernel
generic_project_substrate: MAIOS Project Kernel
external_effect_authorized: no
~~~

## Resultant

A visual element is not primarily a menu item and not automatically a persistent
mini-kernel.

It is a **semantic address** that can become the shared focus of person, AI,
Canvas, Chat, harness, CLI or another legitimate receiver.

~~~text
door / button / 3D object / map location / voice referent
-> semantic address
-> focus event
-> current context resolution
-> situated working field
-> projection / interaction appropriate to the receiver
~~~

The same semantic target can be selected by different modalities:

~~~text
pointer / mouse
touch
voice
chat language
map selection
system event
AI-generated attention request
~~~

The modality changes. The addressed relation should not.

## Shared focus relation

Candidate minimum identity:

~~~text
semantic_id
project_or_vessel_id
object_type
spatial_relation
lifecycle_state
configuration_or_version
current_event_or_question
receiver_identity_or_session
~~~

This is an address, not the full context.

A Context Resolver may then reach only what can change the current movement:

~~~text
semantic address
+ current project/vessel state
+ owner-native sources
+ relevant history
+ open issues / unknowns
+ pertinent competences
+ competence horizon
+ authority / capability ceiling
-> Focus Field
~~~

## Focus Kernel — provisional name

When the resolved field has enough local continuity to support work, it may be
treated as a **situated Focus Kernel**.

This does not require a persistent kernel per UI element.

~~~text
distributed semantic map
-> selected node / relation
-> resolve current field
-> temporary situated kernel
-> work / consequence / readback
-> cool when focus no longer requires it
~~~

A persistent sub-kernel should form only when a genuinely continuing object,
state, learning and reentry relation appears.

## Bidirectional attention

The shared coordinate system must work in both directions.

### Person -> system

~~~text
touch/click/select/say "paratia 17"
-> semantic target
-> AI receives current situated field
-> no need to restate the full verbal context
~~~

### System -> person

~~~text
source/event/result exposes issue or possibility
-> semantic target
-> visual surface highlights / frames / signals target
-> context capsule explains why
-> person can inspect / question / authorize next movement
~~~

The AI may guide attention. It does not gain authority over the object by doing
so.

## Multidimensional map

A selected element may participate simultaneously in several coordinate planes:

~~~text
space
  yacht -> deck -> frame -> component

product
  concept -> engineering -> configuration -> as-built

time
  FORM -> BUILD -> commissioning -> LIVE -> refit -> RETURN

causal relation
  requirement -> decision -> object -> event -> consequence

sources
  CAD / drawing / spec / QMS / service / manual / project record

competence
  currently pertinent owner-native capabilities + reachable horizon

project
  task / decision / open front / milestone / unresolved gap

authority
  see / inspect / propose / edit / approve / execute

possibility
  known options / missing evidence / next material movements
~~~

The 3D product is one powerful coordinate surface, not the sole ontology.

## Multimodal interaction

Voice and touch are first-class input projections of the same focus system.

Examples:

~~~text
voice:
  "mostrami la paratia 17"
  "cosa manca qui?"
  "confronta con la proposta"
  "torna al RETURN"

touch:
  select component
  drag/rotate map
  choose lifecycle state
  inspect diff
~~~

Voice should not create a second conversational state detached from the visual
focus. The active semantic target and current state remain shared.

## Map / route possibility

A geographic map can use the same pattern:

~~~text
touch/select port
-> semantic location identity
-> current vessel / voyage context
-> qualified navigation sources and constraints
-> route-planning capability where legitimately available
-> proposed route / alternatives / reasons / uncertainty
-> human or authorized system decision
~~~

This is a **capability horizon**, not a claim that the current Kernel Nautico
implements certified marine navigation.

Real route calculation requires its own qualified data, navigation rules,
freshness, safety and authority contract.

Do not infer vessel control or safety-critical autonomy from the map UI.

## Example — bulkhead issue

Architecture exercise:

~~~text
QMS / inspection / project event
-> semantic target bulkhead:B17
-> current configuration + drawing/spec/source + history
-> pertinent engineering / production / quality competences
-> bounded issue field
-> Canvas highlights B17
-> Chat can answer relative to B17 without restating context
-> candidate variant can be formed
-> visual diff current vs proposed
-> impact / unknown / evidence displayed
-> effect remains proposal until authority permits more
~~~

This is a useful test because it exercises object identity, context, sources,
competence pertinence, visual attention and authority without requiring a full
operational product.

## Focus Bus — functional requirement

Future receivers should be able to share the same focus relation without
duplicating project truth:

~~~text
Canvas
Chat
Harness
CLI
voice
map
other UI
   \
    -> Focus Bus / shared semantic target
       -> Context Resolver
       -> owner-native sources/state/competences
       -> receiver-relative projection
~~~

"Focus Bus" is provisional language for the function. Do not create a service
or event infrastructure merely to satisfy the name.

## Current technical implication for the Three.js candidate

Do not rebuild the visual.

Add a semantic layer behind the existing acts and anchors.

Candidate flow:

~~~text
SemanticRegistry
-> FocusEvent
-> ContextResolver
-> FocusField
-> Projection
~~~

FORM / BUILD / LIVE / RETURN become semantic addresses before they become richer
doors.

At least one spatial object/anchor should use the same mechanism.

The semantic layer must remain renderer-independent enough that Chat, later
harness/CLI and another projection could consume the same identity.

## Current exercise boundary

Do now:

1. define the smallest SemanticAddress / FocusEvent contract;
2. map FORM / BUILD / LIVE / RETURN into it;
3. map one spatial anchor from the existing yacht into it;
4. provide one read-only Context Resolver result;
5. expose the resulting focus in the current visual and as machine-readable
   debug/state output;
6. prove pointer/touch and a simulated language/voice intent can resolve the
   same semantic target without duplicating context;
7. preserve source / reality / authority boundaries;
8. return reusable learning to the correct owner if execution changes a method.

Do not yet build:

- real authentication/RBAC;
- live CAD/PLM/QMS integration;
- certified navigation or route planning;
- microphone/speech infrastructure if the host does not already expose it;
- vessel control;
- production effects;
- a persistent mini-kernel for every node;
- a generic platform extracted before this exercise teaches what is reusable.

## Stop condition

Stop when the same semantic identity can be reached through more than one input
surface and produces the same situated read-only focus field without the
Three.js scene becoming source of truth.

The next movement then comes from the observed consequence.
