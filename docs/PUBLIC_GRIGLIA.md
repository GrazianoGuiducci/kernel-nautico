# Discover Kernel Nautico and use the cards

The visual-identity candidate uses one colour and a nautical image per activity.
That identity follows the activity into the rail and its open card header.
The rail distinguishes open, minimized and focused cards; a separate marker
signals a pending event in the current context. Icons, labels and accessible
state descriptions complement colour. Work content stays plain; unavailable
images and forced colours retain the usable interface.

The ten images are original synthetic illustrations, not photographs of an
observed vessel, actual shipyard or engineering evidence. Their provenance and
prompt set are distributed with the profile assets. This candidate awaits
operator review before production publication.

Kernel Nautico connects knowledge, tools and the reasons for decisions throughout
shipyard work and vessel life. Its presentation explores an illustrative case:
an owner's requirement for stern access. The engineering office, shipyard teams,
suppliers, crew and service participate at different times while retaining
requirements, configurations and observations.

English is the default interface and guide language. [Italiano](PUBLIC_GRIGLIA.it.md)
is supported. Page, embedded UI and dialogue use the selected language;
drafts retain the words entered by their author.

## Adopt with MPK; add a visual interface when useful

Kernel Nautico can combine with [MAIOS Project Kernel (MPK)](https://github.com/GrazianoGuiducci/maios-project-kernel)
for project startup, context, sources and continuity. The marine knowledge and
method remain with Kernel Nautico; the shipyard provides its own configuration,
people, documents and tools. These sources compose during adoption.

The visual workspace is optional. An AI assistant can use the kernel through
conversation and the tools already available in the adopting environment.
K-UX-AI adds visual guidance, cards and workspace interaction when they serve
the work. The interactive presentation illustrates this additional possibility.

## Select the context

Overview prepares a workspace for the Engineering office, Shipyard, Suppliers,
On board or Service. Page options also introduce the kernel, its learning and
collaboration, presentation to the owner and contributions to the project.
Selecting an option brings the opened work into view.

## Follow the work through cards

One card explains context and open points; another receives a proposal or
observation. Explore alternatives, compare contributions, organise continuation
and retrieve what remains open. Cards can sit alongside each other or move into
focus while retaining drafts. Presentation and guidance stay available.

Initial tiles identify activities through an icon and title. In Tools, select
Free and drag the bottom-right corner to resize a card, including compact cards.
The handle also supports arrow keys; Shift makes larger adjustments. Context
and drafts remain attached to the work.

## Ask the AI guide

Each card dialogue retains the case subject. An explicitly submitted question
reaches MAIOS AI on a configured site with its own conversation and the card's
public context; other drafts stay local. The general assistant helps select a
path. The interface reports when the service is unavailable.

## From the illustrative case to shipyard work

The case and presentation events are illustrative. Notes and proposals remain
in the session until exported or transferred. In a shipyard, the kernel operates
with connected documents, people, tools and systems. The project and individual
vessel retain their own configurations and histories. An observation improves
the method when it is understood and integrated into the competence continuing
the work.

The [entry guide](../BOOT.md) starts from your case. The [marine operating
model](NAUTICAL_REFERENCE_OPERATING_MODEL_0_1.md) explains relationships between
phases and participants.

## Technical integration

`workstations/public-griglia/PROFILE.json` holds the English domain profile;
`PROFILE.it.json` provides Italian support with the same semantic IDs. K-UX-AI
supplies the builder and adapter. Each BUILD.json records reference, profile,
runtime, locale and HTML identities. With K-UX-AI sources beside this repository:

```sh
cd ../k-ux-ai
npm ci --ignore-scripts
cd ../kernel-nautico
python ../k-ux-ai/tools/build_public_griglia.py --profile workstations/public-griglia/PROFILE.json --output workstations/public-griglia/demo
python ../k-ux-ai/tools/build_public_griglia.py --profile workstations/public-griglia/PROFILE.json --output workstations/public-griglia/demo/it --locale it
python -m http.server 8080 --bind 127.0.0.1
```

English is available at `/workstations/public-griglia/demo/`, Italian at
`/workstations/public-griglia/demo/it/`. The static server does not provide MAIOS
AI. AI connections and shipyard actions are configured in the adopting
environment with its own sources and responsibilities.

The bilingual workspace is built from K-UX-AI `73b059d875234d3e283b81d4b36a95d46a839035`.
Each locale BUILD records the exact profile, catalogues, runtime and artifact.

The shared dialogue display correction follows K-UX-AI `6076603eb9fa406ff893f9db2016dd3e008acf75`.

## Operator and system participate together

While you follow revisions, contribute or guide work on the vessel, the system can show requirements, changes, relationships and proposals in the same workspace. Both activities can take place at the same time. Presentation includes an optional possibility for interactive visual content during vessel inspection; the current demo follows the illustrative stern-access case through cards, tools and dialogue.

The visual candidate includes a quiet original hull/waterline drawing when no
cards are visible in the current workspace. This is decorative line art,
separate from the illustrative case and from any real vessel specification.
The existing invitation to open an activity remains visible; opening a card
hides the drawing. Assets and source identities are recorded in each BUILD.

Use **Exit demo** in the top bar to return to the Kernel Nautico product page.
The control is available in Overview and work, including the full-page demo.
