# Kernel Nautico — ricezione della candidata K-UX-AI v5.4.1

10 ottobre 2026 · stato: **source handoff / implementation not selected / no integration claim**.

## Perché cambia il campo ricevente

L'operatore osserva la Griglia K-UX-AI v5.4 in Edge e la considera sufficientemente matura. Il successivo esercizio [v5.4.1](https://github.com/GrazianoGuiducci/k-ux-ai/blob/work/ux-ai-ui-library-20261008/labs/nautico-ui-v4/16-griglia-continuity-v541.html) corregge due differenze osservate nel codice e provate in Chromium: il rientro dopo la Home recupera la disposizione per contesto, un editor preserva testo, focus e caret durante la ricostruzione dovuta a un evento locale. Il precedente HTML v5.4 resta immutato.

Il candidato è su `GrazianoGuiducci/k-ux-ai`, branch `work/ux-ai-ui-library-20261008`, risultante osservato `a243a9efb7dd9e4838e34151a8fb74088ec0b212`; sorgente HTML nuova Git blob `4de649540cd10438df6f08dc971cb31b73c3a1f0`, SHA256 `7e8a35dc21bdc6940e1ad00db47fbe9327237a33c6aede5a71aaf03f7d8f9716`. Test: 97/97 correlati in Chromium headless, `page.set_content`, quattro configurazioni. Queste coordinate devono essere riverificate al successivo uso e non provano il sito reale.

## Che cosa riceve Kernel Nautico, e che cosa possiede già

L'owner `kernel-nautico` conserva i target/contesti reali, le fonti, i controller e il lifecycle. Questa stessa branch possiede già il [primo vertical Entity Desk](UX_AI_ENTITY_DESK_FIRST_VERTICAL_20261008.md) con dieci ingressi nativi e il bridge pubblico `kn.public-view-hello/command/state.v2`, oltre alla presentazione 3D e agli store del caso. La sua ricevuta originale registra 15/15 controlli statici, non una prova browser.

K-UX-AI fornisce il **medium** comune (composizione Home, card, viewport, motion, focus e gesti), non le definizioni delle dieci entità Nautico. I dieci intenti sintetici `Capire, Fare, Controllare...` del laboratorio non sono un sostituto dei dieci target `nautico-*`. L'adattatore Nautico deve qualificare quali azioni e sorgenti ogni card può proiettare; l'host non può convertire il testo della scheda in una decisione nautica.

Il ruolo/permesso è già parte della [Nautical Operational Spatial Surface](../docs/NAUTICAL_OPERATIONAL_SPATIAL_SURFACE_0_1.md): `persona/account + oggetto + stato lifecycle + capacità disponibili + autorizzazione` determina profondità e azioni effettive. Progettista, operatore, fornitore, cliente, service e bordo sono possibili proiezioni, **non account o permessi implementati** dalla demo. Il controller owner-native verifica ogni effetto; occultare un pulsante non è controllo di accesso.

## Compito Codex nel ricevente giusto

Prima identificare il sito già osservato dall'operatore e la sua **vera sorgente**: URL, host, versioni, superficie/canale di deploy, relazione con il prodotto e titolarità della chat. `maios_it` nel catalogo del 6 ottobre registra Nautico come `presentation_pending` e non va promosso a host del demo per associazione; `lab-d-nd-site` e `chatgpt_sites` hanno owner distinti. Una versione che l'operatore vede sul sito può appartenere a un altro ambiente, da verificare senza negarne l'osservazione.

Poi confrontare tre oggetti esatti: KUX v5.4.1 e contratti, questa Entity Desk Nautico e `app/index.html?public=1`, sito/host attuale. Formare l'adapter che preserva i dieci target nativi e la conferma del bridge; scegliere un unico controllo dello stato, mantenere il caso/progetto e le note esistenti, riprendere realmente la presentazione 3D e fornire un percorso di ritorno. Non unire due UI semplicemente sovrapponendo due file HTML.

Il primo risultato effettivo che Codex deve mostrare all'operatore è una **preview verificata**: apertura source-confirmed dei dieci ingressi, Home→card→operatività→Home, rientro, layout/dock, input senza perdita di focus, fallback quando view/ACK non arrivano, desktop/mobile, tastiera/zoom/reduced motion, presentazione 3D. Chat host e due viste contemporaneamente scrivibili vanno attivate solo se il receiver possiede già il controller e la coerenza della loro persistenza. Account e permessi reali richiedono identity/policy nell'host e non si inventano nel frontend.

## Owner e confini degli effetti

- `k-ux-ai` governa il medium generico; cambia solo ciò che è riusabile.
- `kernel-nautico` governa dati del dominio, entità native, lifecycle, conferme e adapter.
- Il vero `site host` governa route/bundle, chat propria, configurazione e pubblicazione quando sarà identificato.
- Codex è il receiver che può leggere, comporre, implementare e provare nei rispettivi checkout, mantenendo ognuno nel proprio owner. Non diventa l'autorità sui permessi o il responsabile semantico del dominio.
- La selezione dell'operatore riguarda prima il candidato integrato; **merge, release, deploy e account sono effetti successivi distinti**.

L'ingresso reciproco nella sorgente K-UX-AI è [NAUTICO_RECEIVER_INTEGRATION_20261010.md](https://github.com/GrazianoGuiducci/k-ux-ai/blob/work/ux-ai-ui-library-20261008/docs/ui-library/NAUTICO_RECEIVER_INTEGRATION_20261010.md).

**Stop condition di questa preparazione:** raccordo letto e conservato nell'owner Nautico. Nessun aggiornamento del sito, merge su main, modifica al bridge, provider o account.

## 10 ottobre 2026 — host MAIOS candidato realmente raggiunto

Alla prima preparazione la sede del sito era ancora una relazione da identificare. La nuova lettura ha trovato il ramo sorgente `GrazianoGuiducci/maios_it/codex/nautico-integrated-20261006` (head iniziale `cbc325adb8a42c5d6d64ca709462d584f3d1531a`) con `kernel-nautico.html`, chat del sito, `kernel-nautico-demo/` e sei rappresentazioni già collegate mediante bridge v2. Il [raccordo site-owner](https://github.com/GrazianoGuiducci/maios_it/blob/codex/nautico-integrated-20261006/docs/NAUTICAL_KUX_V541_RECEIVER_HANDOFF_20261010.md) è stato conservato in quel ramo con nuova revisione documentale `78dc579ac06b2f09c0299e4e1a64fd9ab8c31694`.

La candidate site incorpora già capacità e prove differenti dal nostro ramo Entity Desk: **non è una destinazione vuota**. Le dieci entità/ACK Nautico e la vera pagina ospitante devono quindi essere riconciliate con i comportamenti K-UX-AI v5.4.1 attraverso il ricevente Codex, evitando controller duplicati. L'ultimo stato sito conserva un **blocco all'export e alla pubblicazione** per il primo incontro pubblico (racconto 3D e caso illustrativo, con profondità operativa distinta e materiali non pubblici esclusi). Il readback storico del 6 ottobre riporta 404 per la rotta pubblica `/kernel-nautico.html`; la versione vista dall'operatore resta da associare a URL/runtime tramite prova corrente. `maios_it/main` e il ramo candidato divergono; non è stato effettuato alcun merge.

L'antecedente `kernel-nautico/codex/nautico-integrated-20261006` citato nel materiale del sito **non è più un branch raggiungibile** nell'elenco GitHub osservato. Non ricrearlo per nome: conservare commit esatti quando recuperabili e far qualificare a Codex il checkout realmente disponibile. Il nostro ramo `work/ux-ai-entity-desk-20261008` rimane un risultato separato.
