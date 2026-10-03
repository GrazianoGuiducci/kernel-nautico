# Read-only AI handoff from the current visual focus

This candidate does not connect the page to an LLM API. It exports a qualified
request for an actual assistant, then validates an imported answer against the
request and the still-current focus. No account, microphone or command runner
is installed.

## Use

Open the presentation, select a phase or the existing stern-access `+`, open
**Contesto**, then **Domanda sul focus · passaggio AI**. Write a question such as
“Cosa manca qui?” and use **Esporta domanda**. Keep this page/session and focus.
Give the resulting JSON file to an actual source-capable assistant. Its target
is already in `focus.field.address`; it should not ask you to restate it.

The assistant reads pertinent owner-native documentation, distinguishing the
pinned browser reference from the revision it actually reads. The example is
illustrative: the vessel, event and technical configuration are not real data.
Return a JSON file with the following contract (not text wrapped in Markdown):

```text
schema = kn.receiver-result.v0.1
request_id = exact request.request_id
context_revision = exact request.focus.revision
semantic_id = exact request.focus.field.address.semantic_id
receiver = actual receiver, not a claimed installed service
answered_at = actual answer time
answer = situated answer, plain text
unknowns = list of missing/unresolved relations
sources = list of {owner, path, revision, read_state, observed_at, used_for}
  owner = GrazianoGuiducci/kernel-nautico for this bounded exercise
  revision = exact 40-character commit read
  read_state = read_by_receiver only after an actual read
  used_for = source contribution, not a claim inferred from a title
focus_target = optional existing semantic ID, or null
focus_reason = reason for the navigation suggestion, or null
effect_class = none or proposal_only
```

Import that JSON using **Importa la risposta**. Import does not move the focus.
**Mostra collegamento**, when available, is a separate navigation choice, not
permission to alter the yacht/project. Changed focus, phase or representation
requires a fresh question. A new question replaces the pending request. Request
state is session-local and does not survive a page reload.

## Exact limits

The validator checks identity, structure, current context and the local effect
ceiling. It cannot authenticate the author of a file, prove its source claims,
or replace server-side authorization. All imported prose is rendered as text;
source URLs are formed from bounded owner/path/revision fields. This is not a
multi-user security implementation.

`window.KN_RECEIVER.prepare(question)`, `.accept(result)`, `.show()` and
`.snapshot()` expose the same local behavior. The existing `KN_FOCUS` remains
the context owner. No second project-state store is introduced.

Controlled tests can restore a captured request via `__KN_RECEIVER_TEST__` only
under `?test=1` and only against the same current context. This is explicitly
recorded-exchange replay, not a new AI call or an operational connection.

## Evidence

The actual receiver exercise stores captured UI request and actual assistant
answer together in `tests/receiver-records/EXCHANGE_A.json` and `EXCHANGE_C.json`.
Browser replay of those recorded answers tests import, display and navigation;
it is distinct from the earlier actual source-reading/inference event. Read the
project's `REAL_AI_RECEIVER_EXECUTION_RETURN.md` for exact identities and proof.
