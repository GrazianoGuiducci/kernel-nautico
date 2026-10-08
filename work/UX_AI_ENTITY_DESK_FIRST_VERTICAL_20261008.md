# Kernel Nautico / K-UX-AI — Entità, card e spazio operativo

**8 ottobre 2026 · source-bound product handoff / candidato privato**

```text
selected_product: GrazianoGuiducci/kernel-nautico
first_receiver: existing public local demonstration and its containing site
ux_semantic_owner: GrazianoGuiducci/Meta_Skill / ux-ai-kernel-design
design_construction_owner: GrazianoGuiducci/d-nd-ux-ai-seed
public_medium_owner: GrazianoGuiducci/k-ux-ai
narrative_owner: GrazianoGuiducci/Editoriali
effect: private branch only; no merge/deploy/site publication
target_result: functioning demo + promotional presentation, before broader kernel platform
```

## 1. Fonte dell'operatore e determinazione presente

L'operatore seleziona **Kernel Nautico come primo prodotto** con la UI K-UX-AI integrata nella demo del sito, compreso l'uso *Presentazione* per la promozione; rinvia l'estensione alla galassia di kernel a dopo un primo prodotto realmente riconoscibile e funzionante.

L'idea UI descritta in questa continuazione:

- Chat/assistente come finestra mobile, ridimensionabile e chiudibile ad avatar; contenuto di moduli/form, espandibile a pagina piena.
- Home iniziale con circa **dieci voci d'uso/avatar** riconoscibili, ordinabili manualmente o ridisposti situatamente dal lavoro/focus.
- Livello di card/entity con titolo, attività e identità propria, anche visualizzazioni differenti; segni di nuova attività o attenzione soltanto quando provengono da uno stato qualificato.
- Un avatar trascinato nel focus può diventare una card operativa e far emergere relazioni/strumenti pertinenti, come accade nella composizione di competenze.
- Dieci card in un campo complessivo tipo **griglia Mondrian a pesi variabili**; ciascun accesso può aprire una UI interna completa relativa a quell'uso.
- Finestre che si possono muovere e ridimensionare, agganciare magneticamente come sidebar o riposizionare come uno spazio da lavoro (analogia Windows 11, non requisito software).
- Possibile schermo diviso in due, senza perdere identità e risorse di ciò che si stava facendo.
- Mutazioni/navigazioni consequenziali vicine al focus; ridurre al minimo nidificazioni e modali dentro modali.

Questo elenco è una **fonte progettuale dell'operatore**, non un'autorità per trasformare ogni evento in un segnale animato, ogni card in un kernel nuovo o l'intero prodotto in un layout fisso.

## 2. Una convergenza già nel codice Nautico

Il Nautico corrente a `main@82896de01829752614d04cfa6e3ffacbd9544a0a` possiede `app/src/public-controls.js` con **dieci target pubblici esatti** e un `public-bridge.js` che li riconosce:

| Target pubblico owner-native | Etichetta corrente | Famiglia |
| --- | --- | --- |
| `nautico-presentazione` | Scopri Kernel Nautico | encounter/story |
| `nautico-apprendimento` | Come impara il kernel | encounter/learning |
| `nautico-collaborazione` | Collaborare con un cantiere | encounter/session |
| `nautico-studio` | Studio di progettazione | company/studio |
| `nautico-cantiere` | Cantiere | company/cantiere |
| `nautico-fornitori` | Fornitori e logistica | company/rete |
| `nautico-showroom` | Showroom e relazione con il cliente | company/showroom |
| `nautico-bordo` | A bordo | company/mare |
| `nautico-assistenza` | Assistenza | company/service |
| `nautico-progetto` | Progetto di poppa | product/stern |

Questi **non equivalgono a dieci kernel né dieci applicazioni indipendenti**. Sono dieci **ingressi già reali alla demo**, con modalità e contesti operativi differenti. L'idea può quindi essere esercitata su oggetti esistenti anziché inventare contenuti per riempire dieci riquadri.

Il prodotto attuale contiene inoltre:
- presentazione tridimensionale `FORM/BUILD/LIVE/RETURN`, con controlli attuali e fallback;
- sei modalità nel navigatore integrato, contesti aziendali e store locali per caso/progetto;
- caso e progetto come due owner distinti con sorgenti/revisioni/effetti confinati;
- `public-bridge.js`: handshake di sessione, target pubblico e conferma di vista, senza trasmettere note, schizzi o dati del caso alla chat host;
- layout Atlas a tre colonne, responsive, con resize e disciplina focus/inert.

Tutti questi elementi restano attribuiti e conservati. Il futuro desk non può cancellarli senza osservare cosa cambia nel lavoro.

## 3. La relazione entity/card e il suo limite

La card è una **incarnazione percettiva di una funzione/vista/oggetto raggiungibile**, non il database dell'entity.

```text
identità owner-native
+ stato pubblico e contesto del lavoro
+ selezione/gesto operatore
+ mezzi reali del ricevente
-> avatar | card | finestra | dock | vista ampia
-> intervento osservabile
-> owner-native evento/risultante
```

Il medium può conservare posizione, priorità percettiva, dock, forma e preferenza manuale; **non acquisisce** verità del dominio, authority, letture private o revisioni di caso.

Un evento di attenzione può diventare segnale, colore, pulsazione, tooltip, notifica o `no_change` soltanto se il **source owner** fornisce un evento/status realmente pertinente. Nessuna badge di attività inventata. L'utente può mettere a tacere, minimizzare, ancorare e correggere; una disposizione manuale prevale sul riordino automatico salvo diverso evento realmente materiale o rilascio volontario.

## 4. Presentazione e lavoro condividono il prodotto, non il contratto di effetto

La card `nautico-presentazione` è il primo punto di ingresso riconoscibile per un visitatore e conserva la presentazione già costruita. Deve spiegare con esempi cosa Kernel Nautico rende possibile, entrare nell'esplorazione e nel lavoro reale della demo, e poter tornare all'ingresso.

La **Presentazione** è una forma di incontro promozionale, non un pannello che conferma una capacità aziendale connessa. Il demo case attuale resta illustrativo. Un visitatore può sperimentare le azioni locali e i passaggi di visione/caso; non ottiene controllo di impianti, supply aziendale, chat AI invocata dalla demo, approvazioni o una barca reale.

Quando la presentazione rende pertinente un'attività, la card associata può avvicinarsi o diventare primaria; l'operatore può invece restare in presentazione, interromperla o seguire un'altra direzione.

## 5. Progressione minima della demo integrata

La sorgente presente rende ragionevole un primo slice, non una distribuzione completa di dieci processi indipendenti:

### Primo slice effettivamente realizzabile senza riscrivere gli owner

- home Mondrian dei **dieci target** derivati dall'elenco nativo, con anteprima testuale, proporzioni diverse e riduzione responsive;
- apertura di ognuno tramite **il bridge già qualificato**, ricevendo l'ACK della vista reale;
- una sola vista operativa primaria alla volta; finestra del workspace flottante, ridimensionabile, trascinabile, minimizzabile e agganciabile a sinistra/destra o a tutto schermo;
- navigazione fra card che preserva il receiver esistente (case/progetto), evitando copie di sorgenti o un nuovo store di dominio;
- ordinamento manuale tramite drag/keyboard e riordino automatico **esplicito** su uso locale; niente riordini nervosi al solo hover;
- ritorno alla home e ripresa senza annullare gli effetti locali del caso;
- motion di continuità adeguato e alternativa reduced-motion, focus/keyboard/touch, contrasto e testo leggibile;
- eventuale slot assistente che **non finge una chat reale** se la pagina contenitore non ne fornisce il controller.

### Due lavori che richiedono un secondo confine concreto

**Chat reale.** La chat galleggiante è posseduta dalla pagina contenitore; `public-bridge.js` attualmente trasferisce solo target e ACK senza case data. Dock, contenuto/form e gestione dell'attenzione di quella chat richiedono un contratto owner-native con la host page. Un bottone che copia un prompt non equivale a invocare l'agente.

**Affiancamento di due spazi operativi scrivibili.** `window.KN_ENCOUNTER`, `window.KN_COMPANY` e `window.KN_PRODUCT` hanno oggi logiche di apertura/chiusura mutuamente esclusive. Due iframe in parallelo condividerebbero potenzialmente persistenza browser, senza un modello dimostrato di sincronizzazione delle revisioni. Prima di presentare split-view come operazione completa va formato e verificato un ricevente che preservi gli owner e lo stato. Un secondo spazio di sola lettura è ammissibile se dichiarato.

## 6. Capacità e controllo

- Stato presentazione/viste: dal target pubblico con ACK esatto del receiver.
- Stato caso/progetto: dagli store Nautico, non dal layout della card.
- Stato finestra/avatar/dock/ordine: locale al medium, serializzato separatamente dal caso; `reset` delle preferenze non cancella il lavoro.
- Attività/notifiche: eventi realmente esposti dall'owner e identificati; non inferite dalla frequenza dei render o da dati privati.
- Attività dell'assistente: soltanto se un controller autorizzato è realmente raggiungibile; nessuna autorità acquisita dal drag o dal docking.
- Confronto/azione: `visualizzare != proporre != approvare != eseguire`.

## 7. Osservazioni sul campo da esercitare

Il criterio non è 'abbiamo costruito dieci belle card', ma se la UI rende il lavoro **più riconoscibile, comprensibile e continuabile**.

1. **Primo visitatore:** entra dalla Home, apre Presentazione, capisce il ciclo e raggiunge Esplorazione o il caso senza cercare l'architettura interna; può fermare/uscire senza perdere orientamento.
2. **Operatore sul caso:** seleziona un contesto, crea/rivede un contributo reale della demo, cambia layout/dock e ritrova il caso e l'originale senza che la card inventi un'altra revisione.
3. **Osservazione concorrente:** una fonte cambia/stale oppure una vista non è disponibile; lo status deve essere visibile senza mascherare il problema con un'animazione. Un render uguale non è un nuovo evento.
4. **Controllo manuale:** drag/card e aggancio prevalgono su suggerimento automatico; movimento interrotto non porta a stallo, perdita focus o UI non applicabile.
5. **Accessibilità e sistemi riceventi:** mobile/touch, tastiera, zoom, reduced motion e fallback leggibile. Non proiettare nei nodi fittizi ciò che l'utente non può effettivamente raggiungere.

## 8. Destinazioni e stop condition

Il presente branch **non modifica** il Site pubblico, il package K-UX-AI, Meta_Skill, gli altri kernel o il prodotto stabile. Il programma parte da un'istanza Nautico reale e conserva la baseline Atlas.

I primi file costruibili sono un **ingresso alternativo nel medesimo app bundle**, con cartelle e componenti owner-native esistenti, senza duplicare il modello nautico. Quando sarà esercitato, il Codex/Work owner del prodotto potrà integrare la forma selezionata e, separatamente, il Site owner potrà consegnarla nel proprio contenitore con la chat reale.

Non fare merge, deploy, pubblicazione, nuovi account o contatti esterni. Fermarsi quando la lane lascia una candidata esercitabile con ragioni, limiti, prove e rientro ricostruibile. La galassia dei kernel rimane orizzonte, non nuova quota di lavoro.
