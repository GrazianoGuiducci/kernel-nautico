# Kernel Nautico — First Encounter (review candidate)

One licensed GLB, one persistent product identity, FORM → BUILD → LIVE → RETURN.
This is a perceptual demonstrator, not an AI runtime, engineering model, bridge UI or company integration.

## Run the built delivery (no download needed)

The delivery ZIP includes `dist/` with the verified model, source modules and the required Three.js modules.
With Node.js 22 or later, from `app/`:

```sh
npm start
```

Open `http://127.0.0.1:8876`. Keep this terminal open. Ctrl+C stops it.
The server binds only to localhost. Opening `index.html` directly with `file://` is not supported.

## Rebuild from the repository

```sh
npm ci
npm run assets
npm test
npm run build
npm start
```

`npm run assets` verifies an existing carrier or obtains the exact pinned original, reduces it with isolated asset tools, then checks the inspected output hash. It never accepts a different result silently. Network is needed only during setup, not during the presentation. The temporary files are removed after processing. The root project license is not changed; third-party notices remain separate.

## Controls / evidence

Guided autoplay, pause, replay, phase selection and a time scrubber. Inspection pauses the narrative and enables bounded orbit. Reduced motion disables autoplay. An unavailable/unverified model or missing WebGL produces an explicit static alternative.

`?test=1` exposes deterministic evidence controls under `window.__KN_DEBUG__`. `?static=1` exercises the static alternative. No external requests, telemetry or AI service calls occur at runtime. “Fonti e limiti” contains visible authorship and reality boundaries.

```sh
# Additional tooling, used only for browser evidence:
python -m pip install playwright==1.57.0
python -m playwright install chromium
python tests/browser.py
```

The test assumes the local server is already running. Evidence is written to `evidence/`, or `KN_EVIDENCE`. Software rendering on a CI runner is not a claim of performance on a real user's GPU. The strict silent captures remove text and navigation before visual review. The browser recording is an actual autoplay capture, not interpolated keyframes.

## Replaceable carrier / honest BUILD

The temporary “motoryacht 35” by angelo raffaele catalano is CC BY 4.0. It is a compact cruiser, not the reference superyacht or a Ferretti/Pershing vessel. It has material-oriented meshes, not a validated engineering hierarchy. BUILD therefore uses an X-plane material reveal and edges from the actual geometry, not an invented exploded assembly.

RETURN's stern-access example is invented: source observation → human qualification → proposed future criterion. The vessel geometry is not changed. Read `../ASSET_PROVENANCE.md` and `../EXECUTION_RETURN.md` for evidence and limitations.
