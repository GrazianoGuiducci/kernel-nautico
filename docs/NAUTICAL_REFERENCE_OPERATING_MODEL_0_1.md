# Kernel Nautico — Nautical Reference Operating Model 0.1

~~~text
formed: 2026-10-02
status: advanced domain reference model / not company-specific truth
owner: GrazianoGuiducci/kernel-nautico
relation: V-01 Causal Product Continuity operating substrate
first_pressure_field: Pershing / Ferretti
~~~

## Purpose

Provide Kernel Nautico with a technically credible nautical product-development
and lifecycle baseline **before** entering a specific company.

The model is not a claim that every yard works identically.

~~~text
domain reference model
+ production profile
+ class / conformity profile
+ company overlay
+ vessel instance
-> situated operating model
~~~

The reference model gives the kernel enough domain structure to understand
what it encounters, ask better questions, preserve V-01 continuity and begin
useful work immediately. The real company supplies its own organization,
systems, responsibilities, logistics, suppliers, procedures and exceptions.

## Source basis

The current reference model is grounded in:

- Pershing GTX public development narrative;
- Ferretti Group current production-centre and Digital Production material;
- Ferretti Group production-cycle and quality-system disclosures;
- Ferretti Group composite-material / lamination descriptions;
- RINA newbuilding classification and yacht rules;
- EU Recreational Craft Directive 2013/53/EU where its scope applies.

These sources are evidence for the domain model, not a complete description of
any one company's internal operating system.

## Public visual compression

The public visual master remains:

~~~text
FORM
-> BUILD
-> LIVE
-> RETURN
~~~

The operating model below supplies the technical depth inside those four
recognizable movements.

## Reference lifecycle

### N0 — Intent / owner need / product opportunity

Possible inputs:
- owner/customer need;
- brand/product strategy;
- market or use opportunity;
- prior product/lifecycle learning;
- performance, experience or sustainability target.

Kernel relation:
preserve why the product movement exists and what could revise that intent.

### N1 — Concept / feasibility

Typical relations:
- concept definition;
- preliminary general arrangement;
- naval-architecture direction;
- performance/space/use hypotheses;
- technical feasibility;
- major system and production implications.

Pershing's GTX source describes a movement from new owner needs and Project TØ
toward an engineering/design challenge and then physical production.

### N2 — Naval architecture / preliminary engineering

Depending on product class and yard:
- hull / superstructure geometry;
- hydrodynamic parameters;
- stability / trim;
- propulsion architecture;
- weight / centre-of-gravity development;
- general layouts;
- technical spaces;
- preliminary structural/system architecture.

### N3 — Detailed engineering / design authority

Typical relations:
- detailed drawings/models;
- structures;
- machinery;
- electrical;
- fluid systems;
- HVAC;
- control/electronics;
- interiors/interfaces;
- configuration/BOM development;
- design reviews;
- class/conformity plan approval where applicable.

Engineering can overlap later production in custom/superyacht work. Do not
model the lifecycle as strictly serial.

### N4 — Industrial planning / supply / material qualification

Typical relations:
- make/buy decisions;
- supplier qualification;
- material/component approval;
- procurement and delivery sequencing;
- production planning;
- tooling/mould readiness;
- work packages;
- pre-installation quality checks.

Ferretti's published quality system explicitly includes supplier approval,
product approval and production checks before/through installation.

### N5 — Primary structure production

Profile-dependent.

Composite example:
- mould/model preparation;
- glass/carbon reinforcement;
- hand lay-up or infusion lamination;
- curing/polymerisation validation;
- hull/deck/superstructure components.

Metal/alloy example:
- plate cutting;
- welding and block fabrication;
- section assembly;
- structural joining;
- inspection/NDT as required.

### N6 — Machinery / systems / below-deck installation

Typical relations:
- engine room;
- main engines;
- generators;
- propulsion machinery;
- tanks / piping;
- electrical distribution;
- plumbing;
- HVAC;
- pumps;
- controls / electronics;
- below-deck technical environments.

### N7 — Superstructure / structural integration

Typical relations:
- hull/deck/superstructure joining;
- major structural modules;
- deck equipment;
- penetrations/interfaces;
- alignment and integration checks.

### N8 — Outfitting / interiors / finishes

Typical relations:
- carpentry / joinery;
- cabins and furniture;
- flooring / ceilings / wall systems;
- glass;
- stone / fabrics / leather;
- lighting;
- painting/coating;
- teak;
- masts / antennas;
- exterior fittings.

Several N6–N8 activities may proceed in parallel. The kernel should preserve
dependencies and configuration, not force a single linear schedule.

### N9 — Integration quality / correct assembly checks

Typical relations:
- installed-component verification;
- mechanical/electrical functional checks;
- correct-assembly checks;
- interface verification;
- closure of manufacturing defects/non-conformities;
- configuration reconciliation.

### N10 — Commissioning / dock trials

Typical relations:
- system start-up;
- dock-side functional testing;
- shipyard checklists;
- operational verification;
- readiness for launch/sea trials.

Kernel significance:

~~~text
project-configured object
-> commissioning / acceptance
-> candidate product instance
~~~

### N11 — Launch / sea trials / conformity / acceptance

Typical relations:
- launch;
- sea trials;
- performance verification;
- system trials;
- class/conformity evidence where applicable;
- punch-list closure;
- final acceptance/delivery readiness;
- as-built configuration.

RINA's newbuilding classification model uses design appraisal, construction
surveillance, sea-trial attendance and class-certificate issuance where class
is applicable.

### N12 — Delivery / vessel-instance activation

At this point the object is no longer only a project configuration.

Typical vessel-instance relations:
- actual as-built configuration;
- serial/product identity;
- manuals/certificates;
- warranty/service baseline;
- owner/crew handover;
- maintenance plan;
- outstanding recommendations / controlled deviations where legitimate;
- product-specific knowledge state.

### N13 — Operation / service / warranty / refit

Typical relations:
- operational events;
- maintenance;
- warranty;
- service intervention;
- parts/configuration change;
- refit / upgrade;
- inspection/survey where applicable;
- owner/crew feedback;
- performance / reliability observations.

Ferretti's current service material evidences scheduled checks, official service
relations and continuing owner support beyond delivery.

### N14 — RETURN / competence / later product

Kernel Nautico adds the explicit learning-return relation:

~~~text
event / service / operating consequence
-> understand what changed and why
-> one-off vessel state | reusable difference
-> reusable difference changes the correct competence
-> later process / design / product movement starts differently
~~~

Do not attribute this complete RETURN mechanism to a company merely because it
has after-sales or service data. The actual company return process must be
observed.

## Quality-gate reference

Ferretti's published quality model provides a useful domain baseline:

~~~text
Q1 supplier approval
Q2 product/material approval
Q3 production check / pre-installation verification
Q4 operation and correct-assembly checks
Q5 commissioning and dock trials
Q6 sea trials before final delivery
~~~

Kernel Nautico should map company-specific quality gates onto these functions
rather than assume identical names, departments or documents.

## Production profiles

### P1 — Composite / serial or semi-serial

Ferretti's disclosed standard composite cycle can be abstracted as:

~~~text
hull production
-> systems + machinery + below-deck assembly
-> superstructure assembly
-> furnishings / outfitting
-> launch + sea trials
~~~

Ferretti also describes one-piece-flow production for composite yachts.

### P2 — Made-to-measure composite

Reference characteristics:
- predefined/model hull architecture;
- deeper owner customization;
- extensive interior/layout/furnishing decisions;
- stronger configuration and change-control pressure;
- longer production cycle than serial composite.

### P3 — Alloy / full-custom / superyacht

Reference characteristics:
- customer-request feasibility;
- preliminary and detailed design;
- hydrodynamic / stability / trim work;
- hull/superstructure and technical-space definition;
- class involvement;
- metal block/section fabrication;
- machinery and systems;
- interiors/paint/finish in overlapping workstreams;
- extended commissioning/testing/delivery.

These are profiles, not separate kernels.

## Advanced digital-production thread

Ferretti's 2026 Convergence material describes a Digital Production system that
integrates engineering design processes with physical shipyard production.

Kernel Nautico should therefore preserve a reference digital thread:

~~~text
intent / requirement
-> design decision
-> approved engineering definition
-> configuration / BOM
-> production work package / physical state
-> inspection / test
-> commissioning state
-> as-built product instance
-> lifecycle event / service action
-> consequence
-> competence / next movement
~~~

This thread is a high-value carrier of V-01.

## Minimum Kernel-ready information model

A company can map its own PLM/ERP/MES/QMS/CRM/document/service systems onto
these neutral relations:

~~~text
Need / Intent
Requirement / Reason
Design Decision
Engineering Definition
Part / System Identity
Configuration / BOM
Supplier / Material Qualification
Production Operation / Work Package
Inspection / Non-conformity
Commissioning Test
Sea-trial Result
As-built Configuration
Certificate / Class / Conformity State
Handover / Manual
Lifecycle Event
Service Action
Observed Consequence
Learning Candidate
Competence Delta
Next Product / Process Movement
~~~

Company systems remain owners of their own data. Kernel Nautico owns the
semantic/causal continuity it forms from legitimate access to those relations.

## Class / conformity profile

Do not use one regulatory model for all yachts.

Examples:

- EU Directive 2013/53/EU covers recreational craft of hull length 2.5–24 m
  placed on the EU market for recreational use, with design/construction
  conformity procedures depending on design category and length;
- larger yachts, commercial use, flag-state requirements and class can require
  different profiles;
- RINA publishes distinct rules for pleasure yachts and yachts designed for
  commercial use.

Therefore:

~~~text
domain reference model
+ vessel size / use / market / flag / class conditions
-> applicable class / conformity profile
~~~

Compliance/class is a material product relation when it applies, not the
semantic owner of the whole kernel.

## Company overlay

When Kernel Nautico enters a real yard, map rather than overwrite:

~~~text
reference function
<-> company department / role
<-> company source/system
<-> company artifact/status
<-> company authority
<-> company timing / logistics
~~~

Typical company-specific overlays include:
- organization and responsibility;
- design authorities;
- project/programme structure;
- PLM/PDM/CAD;
- ERP/procurement;
- MES/work orders;
- QMS/non-conformity;
- supplier network;
- warehouses/logistics;
- production layout;
- commissioning/test procedures;
- CRM/owner relation;
- after-sales/service systems;
- refit/yacht-management organization.

The overlay can refine or invalidate the baseline.

## Vessel-instance overlay

Each delivered yacht may instantiate:

~~~text
model / variant
+ as-built configuration
+ installed systems/components
+ certificates / manuals
+ operational state
+ maintenance/service history
+ legitimate local/private knowledge
-> vessel instance
~~~

Do not merge vessel-local state back into company/domain state without an
explicitly legitimate return relation.

## V-01 alignment

V-01 now has a concrete domain substrate:

~~~text
N0–N4
  intent/source -> engineering/configuration

N5–N9
  physical realization / integration

N10–N12
  commissioning -> accepted product instance

N13
  lifecycle event / consequence

N14
  reusable competence -> later product/process
~~~

R-01 can be chosen later as one bounded subsystem carrier through this model.

## Immediate use

Use this reference model to:
- make the kernel technically realistic before company access;
- structure V-01 exercises;
- deepen visual FORM/BUILD/LIVE/RETURN without overloading the public film;
- identify what company-specific knowledge is missing;
- map real systems when an enterprise incarnation begins;
- support an advanced demonstration that is useful immediately but still
  correctable by the adopting company.

## Stop / evolution

This is version 0.1, not a frozen nautical ontology.

Real company work, qualified naval/yacht sources, production execution and
later non-identical cases should change the model where they expose reusable
differences.