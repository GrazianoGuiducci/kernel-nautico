# Semantic Focus — exercised local contract

Status: candidate implementation, not a new kernel or a live AI service.
Owner: Kernel Nautico visual workstation.

## Entry and use

The original four-act presentation remains the entry. `Contesto` opens optional
read-only depth. The `+` at the existing stern-access marker selects that spatial
address. A phase button selects its phase address without forcing the panel open.
The panel supports the bounded commands `mostrami RETURN`, `FORM`, `BUILD`,
`LIVE`, `accesso a poppa` and `cosa manca qui`.

The checkbox `Trascrizione vocale simulata` exercises a transcript input path.
It does not acquire audio, call speech recognition or connect a language model.
Unknown or ambiguous commands retain the previous focus; they do not select an
invented part or run an action.

## Address, event and field are different objects

`src/focus/field.js` owns the renderer-independent local resolver. It imports
existing `ACTS`, `MODEL` and `RETURN_EXAMPLE` from `src/data/story.js` and receives
the actual local presentation act from the existing timeline. It does not create
another project-state store.

The five registered targets are:

```text
kn:phase:FORM
kn:phase:BUILD
kn:phase:LIVE
kn:phase:RETURN
kn:anchor:stern-access
```

An address contains semantic ID, illustrative project ID, object kind and the
verified visual-model SHA-256. This SHA is not an engineering configuration or
as-built identity. An input event retains modality and a local revision. The
resolved field contains current phase, representation status, relevant example,
source references, available competence references, gaps with reasons and the
read-only capability ceiling.

Equal address plus equal current context must produce an equal field across
pointer, emulated touch, keyboard, text, simulated transcript and local API input.
Event modality/revision may differ. Equal address alone does not imply equal
context after a phase or representation change. A spatial selection persists
through a phase change while its explanation is recomputed; a phase selection
follows the timeline. A schematic fallback preserves the address but explicitly
changes geometric representation, without inheriting the GLB's proof.

## What is resolved, and what is only linked

Runtime selection resolves the registry entry, current timeline act, fixed
model identity, existing story object and corresponding source references.
It does not retrieve or interpret remote repository documentation. The source
records therefore say `linked_not_loaded` and `pinned_reference_not_live`.
Links identify repository, path, section and exact revision `92b03e2...`.

Lifecycle Return Qualification v0.2 points to the real local capability in
`COMPETENCE_FIELD.md`. It is reachable knowledge, not an executed competency
inside the page. Domain source ownership remains outside the renderer.
All displayed incidents and vessel/project state remain illustrative.

## Consumer seam

After the page is ready:

```js
const current = window.KN_FOCUS.snapshot();
window.KN_FOCUS.targets();
window.KN_FOCUS.select('kn:anchor:stern-access');
window.KN_FOCUS.submit('mostrami RETURN', 'text');
window.KN_FOCUS.submit('accesso a poppa', 'voice_simulated');
document.addEventListener('kn:focus', event => {
  const projection = event.detail;
  // A future receiver can consume this qualified projection.
});
```

Snapshots and events are detached from the internal frozen field. The local API
can change selection, not project sources, vessel geometry or capabilities.
The UI adapter positions the hit target at the actual projected stern marker;
source/destination geometry is not inferred from a generic viewport location.

This seam is not an installed ChatGPT, CLI or harness adapter. No consumer gains
credentials or authority from a semantic ID, role label, event or source link.
The local revision guard rejects stale cooperative controller writes; it is not
a distributed concurrency, authentication or authorization service.

## Continuation boundary

This result is a temporary read-only focus field with reusable structure, not a
persistent mini-kernel per element. A later receiver/source integration is a new
movement with its own actual capabilities, state, source freshness and authority.
Maps, real speech, route calculation, design variants and operational actions
remain possibilities preserved in `SEMANTIC_FOCUS_FIELD_CANDIDATE.md`.

No such later movement is started by reaching the current stop condition.
