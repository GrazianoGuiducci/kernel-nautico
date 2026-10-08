# Kernel Nautico — entity desk, first candidate return

**8 ottobre 2026 · CANDIDATE_IN_SOURCE / NOT_DEPLOYED / NOT_BROWSER_VERIFIED**

## Present position

Operator first-product selection: form a functioning Kernel Nautico demo UI, including the existing 3D promotional presentation, **before** extending the wider galaxy of domain kernels.

The complete user idea and the exact product/source boundary are preserved in
[UX_AI_ENTITY_DESK_FIRST_VERTICAL_20261008.md](UX_AI_ENTITY_DESK_FIRST_VERTICAL_20261008.md).

The current alternative entry is:

```text
workstations/visual-presentation/production/threejs-first-encounter/app/entity-desk.html
```

It is additive, not a replacement for the existing `index.html` / Atlas source.

### Added

- `entity-desk.html`: optional ten-entity Mondrian-style homepage plus dockable window host.
- `src/entity-desk.css`: responsive card field, drag and window states, focus and reduced-motion equivalents.
- `src/entity-desk-model.mjs`: owner-native public target mapping, bounded manual/opt-in order, appearance-only state, edge docking.
- `src/entity-desk.mjs`: 10 real target cards, opening each existing owner-native view through the `public-bridge.js` handshake, confirmation status, manual reorder, drag into focus, moveable/resizable/minimizable left/right/full host, local usage order.
- `tests/entity-desk.test.mjs`: new Node source-contract cases, **not yet executed** in a complete Node checkout.
- `scripts/build.mjs`: copies the alternative entry into `dist`; existing entry remains unchanged.

### Existing code reused

The exact **ten public targets** come from `app/src/public-controls.js`, not a new list of fake domain applications. All real view content stays inside `index.html?public=1` and original `KN_ENCOUNTER`, `KN_COMPANY`, `KN_PRODUCT`, `KN_CONTEXTUAL` controllers.

The outer desk's source-bound requests are:

```text
kn.public-view-available.v2
-> kn.public-view-hello.v2 (same-origin session)
-> kn.public-view-command.v2 (requestId/target whitelist)
-> kn.public-view-state.v2 (confirmed target/status)
```

No case notes, sketches or private text are sent across this public bridge.
The user retains source control inside the original case and product UIs.

## Exact exercise when an owned checkout is available

```sh
cd workstations/visual-presentation/production/threejs-first-encounter/app
npm ci --ignore-scripts --no-audit --no-fund
npm run assets
npm test
npm run build
npm start
```

Open:

- `http://127.0.0.1:8876/entity-desk.html` — alternative desk candidate.
- `http://127.0.0.1:8876/index.html?public=1` — unchanged source view.

### Browser readback that still has to happen

1. Every one of the ten cards should open **the named actual view**, confirmed by the bridge rather than the click itself.
2. Card drag reorder and keyboard `Sposta` should persist appearance only.
3. Dropping a card into focus should open it without changing domain state.
4. Moving a floating window should stay within viewport; drag toward edge should dock. Dock/full/floating/minimize/restore/close should preserve the receiver and focus.
5. Test desktop, laptop, narrow/mobile, reduced motion, keyboard, zoom and touch. Check overlap with 3D/frames and actual performance.
6. Open the genuine case/project in the iframe, enter/export a local contribution, minimize/restore/reopen; verify the user data is unchanged by desk preference or view selection.
7. Exercise unavailable iframe, non-matching origin, delayed view, stale acknowledgement, unknown target, and repeated state receipt: never claim a view or AI action that was not confirmed.
8. Inspect presentation quality for an unaffiliated visitor; do not treat navigation success as evidence that the product became understandable.

A bounded source-level V8 review passed **15/15 structural and contract checks**. This is described in
[UX_AI_ENTITY_DESK_EVIDENCE_20261008.json](UX_AI_ENTITY_DESK_EVIDENCE_20261008.json);
it is **not** Chromium QA, a completed npm build, an installation or site runtime evidence.

## Unfinished relationships

**Chat MAIOS** is managed by the containing site, not by the Nautico iframe. Docking that real chat, rendering its forms inside a window/card and exposing source-grounded notification/recommendation state need an owned host contract and its separate authority. None was invented here.

**Two fully working side-by-side panes** are not implemented: existing Nautico controller instances open/close one another and independent iframes may share client-side persistence without concurrency/revision coordination. The first slice offers one actual operable view, dockable against the remaining desk. Dual work remains a later receiving-state problem to solve from owner-native requirements, not a decorative split claim.

**Automatic focus/priority** is not a learned prediction or kernel routing. The `Organizza per uso` action explicitly ranks local desk access counts; manual order can then change it. Real semantic activity indicators, pulse, tooltip or low-interruption chat presence must be grounded in events emitted by the respective owners.

**No AI model calls** were added by this branch. K-UX-AI and owner-native semantic learning can deepen after the integrated domain/UI behavior is actually exercised.

## Next owner-native movement

When Codex/Work has a checkout/browser and the kernel's actual site host, it can:
- exercise and improve this candidate, preserving the existing Atlas and public view contract;
- return rendered screenshots/interaction findings;
- decide with the product/UX-AI/Design/Editoriali owners what can faithfully become the public first encounter;
- build the real host-chat docking seam and simultaneous writable workspaces only after their actual controller and state boundaries are observed;
- stop before merge/deploy/publication unless separately selected.

No new kernel, central orchestrator or other domain product was created by this movement.
