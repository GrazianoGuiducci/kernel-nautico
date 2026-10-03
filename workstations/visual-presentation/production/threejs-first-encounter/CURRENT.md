# Real receiver — candidate reentry

Updated: 2026-10-03
Status: REVIEWABLE_CANDIDATE / STOP_CONDITION_REACHED
Branch: `work/semantic-focus-field-20261003`
Latest exercised runtime: `8c36f1d842d52a830d474f93ea2551399cfbd7cd`
Task: `NEXT_MOVEMENT_REAL_AI_RECEIVER.md` — completed, not a pending launch.

## Start here after interruption

Read `REAL_AI_RECEIVER_EXECUTION_RETURN.md` for exact results and boundaries;
then `app/src/receiver/HANDOFF.md` when continuing receiver work.
`SEMANTIC_FOCUS_CONTRACT.md` remains the underlying focus contract.

One visual context can now be exported as a question, consumed by a real
source-reading assistant, and returned as a validated answer with optional
explicit navigation. This ChatGPT receiver exercised the stern-access/LIVE and
RETURN cases. Browser replay of the actual recorded answers tested their import
and focus return. Transport is manual/file-mediated, not a live browser API.

Sources in the page remain pinned links. Actual source reads belong to the
recorded receiver result; the page does not synchronize documentation or
independently authenticate imported source claims.

## Preserved stages

- First encounter: branch `work/visual-threejs-first-encounter-20261002`, head
  `e35403bcc9213a6805a03c77ca9889adbef4ecc4`; runtime `61a9b01...`;
  `EXECUTION_RETURN.md` unchanged.
- Semantic focus: runtime `1634de48c99391fbb9b8ae10b019a130d1a39187`;
  `SEMANTIC_FOCUS_EXECUTION_RETURN.md` unchanged.
- Real receiver: capture `8a088f73...`, final exercised source `8c36f1d8...`;
  60 unit and 152 browser checks passed. Actual inference and recorded browser
  replay remain separate observations.

The prior candidate, main and the earlier separate Design learning branch are
not merged or rewritten. A later source-only state commit does not alter the
executed runtime.

## Current boundary

No LLM API service, microphone, real route planning, login/authorization backend,
CAD/QMS/company data, distributed concurrency or operational product mutation.
A session-local focus is not a persistent kernel per element. Touch/voice/maps
remain alternative input possibilities of the same semantic address relation,
not reasons to build the whole platform now.

Stop here. A new user-selected movement starts from this resultant. Do not
re-execute GPT_PRO_NEXT_LAUNCH or the older first-encounter packet automatically.
