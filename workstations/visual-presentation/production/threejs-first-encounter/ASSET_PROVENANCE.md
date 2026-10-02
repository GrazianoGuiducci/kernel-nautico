# Asset Provenance — First Encounter candidate

Observed: 2026-10-02. Scope: the unmerged local/controlled visual demonstrator.
This selects a temporary runtime carrier, not the final public yacht asset.

## Operator visual reference

The operator-supplied `Kernel Nautico_ Intelligenza Marittima a Ciclo Continuo(2).png`
was available in the resumed conversation. The packet's exact `(1).png` was also
retrieved from the Library and visually inspected. `VISUAL_REFERENCE.md` remains
the repository-readable source. No exact raster is stored in this repository.

Adopted relations: one recognizable yacht, dark maritime field, restrained warm
metal/cyan accents, FORM/BUILD/LIVE/RETURN, experience returning to later design.
Not adopted as truth: depicted engineering decomposition, autonomous onboard
functions, company involvement, guaranteed benefits or photorealistic likeness.
The raster is visual-direction evidence, not a geometry source, technical
specification, approved public final or Ferretti/Pershing asset.

## Selected runtime carrier

- Asset: `app/public/models/yacht.glb`; copied to `app/dist/models/yacht.glb` by the build.
- Work: **motoryacht 35**.
- Creator: **angelo raffaele catalano**.
- Creator source: https://sketchfab.com/3d-models/motoryacht-35-0bdd7a0de7254426890bb5745bb7da6d
- Distributed original: `bob6664569/open-water@285b6ce32057c70191a7fe16c31d979fa383ac64`, `site/assets/boats/motoryacht_10.7r.glb`.
- Distributor notice: https://github.com/bob6664569/open-water/blob/285b6ce32057c70191a7fe16c31d979fa383ac64/THIRD_PARTY_NOTICES.md
- License: **CC BY 4.0**, https://creativecommons.org/licenses/by/4.0/ . The GLB's embedded author/license/source/title and the distributor notice agree.
- Observation/acquisition date: 2026-10-02.
- Original SHA-256: `f3272a5c660705b0c4c1a0dca4195a7f60822f0d09d290a1a37ff6fa0677985b`.
- Adapted SHA-256: `ea70c4d14ac31eb90d0dd2aee5a44b2e606ddd71dfd82aed97d82ee195f63d96`.
- Adapted bytes: **4,134,868**; 35 meshes, 23 materials, 57 nodes, 146,708 triangles, no texture images in the adapted GLB.

Local changes: geometry simplification (`--ratio 0.18 --error 0.001`), scale and
orientation normalization, presentation materials and lighting. The build tool
entry pins `@gltf-transform/cli` 4.5.0; the resulting GLB records glTF-Transform
4.5.1 in its generator metadata. The exact output hash gates adoption. The
resolved asset-tool lock is included in the execution artifact; repository
setup currently resolves that tool lock on first acquisition. A different
result fails rather than silently becoming the carrier.

The illustrative access criterion is not a physical modification or a technical
finding about this boat. The compact cruiser is not the reference superyacht,
a Ferretti/Pershing vessel or an original Kernel Nautico yacht design.

## Carrier decision

| Gate | Decision | Evidence / limit |
| --- | --- | --- |
| G1 Commercial-use compatibility | PASS | CC BY 4.0 source and metadata; attribution and adaptation notice retained. No endorsement implied. |
| G2 Premium / credible silhouette | PASS_WITH_LIMIT | Credible modeled motor yacht, complete and recognizable; compact-cruiser morphology and simple materials fall below the reference superyacht finish. Suitable only as a replaceable concept carrier. |
| G3 Mesh / material quality | PASS_WITH_LIMIT | Inspected actual GLB and rendered four states; clean enough for this proof, but material grouping is not engineering semantics. |
| G4 Segmentation / BUILD | PASS_WITH_LIMIT | No invented explosion. X-plane materialization and edges derive from actual geometry. No claim of manufacturing assembly. |
| G5 Reproducible provenance | PASS | Pinned source commit, original/adapted hashes, preserved GLB metadata, attribution in runtime and documentation. |
| G6 Browser weight | PASS_WITH_LIMIT | Original acquisition log approximately 17.44 MB; adapted 4.13 MB. Offline distribution about 6.53 MB uncompressed. Software WebGL is not a target-device performance certificate. |

Overall: **PASS_WITH_LIMIT**, temporary first-encounter carrier.

`frickies_yacht.glb` was rejected at the license gate: the source notice states
CC BY-NC 4.0. It was not acquired or rendered for this demonstrator. No broader
asset search or uninspected alternative is represented as evaluated.

## Attribution and distribution

Visible runtime attribution is under **Fonti e limiti**. `app/public/MODEL_NOTICE.md`
and its distributed copy preserve creator, source, license and modifications.
Keep them, including the CC BY link, with any authorized later distribution.

Three.js is pinned to **0.186.1**. The build includes only the required modules
and its MIT license at `dist/vendor/three/LICENSE`. Environment, water normals
and schematic overlays are procedural; no external photographs, HDRI, audio or
remote font files are included. Runtime fetches stay on the local origin.

The downloadable delivery includes the verified GLB and built dependencies, so
viewing it does not require model acquisition, npm installation or a CDN.
Rebuilding from the repository requires the documented setup commands.

## Replacement horizon and license boundary

For public-facing premium work, replace the cruiser with an original or
appropriately licensed superyacht with a validated, useful component hierarchy;
repeat source, silhouette, build/reveal, framing, causal-anchor and weight checks.
Do not transfer the present carrier's proof to a replacement asset automatically.

Kernel Nautico's own license remains unselected/unchanged. Third-party asset
permission does not license the surrounding product or authorize publication,
deployment, commercial commitment or company contact. No non-commercial-only
asset enters this company/funding-oriented field.
