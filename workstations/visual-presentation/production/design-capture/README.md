# Design Capture — contributo visuale che continua nel progetto

Versione candidata 0.1 · 2026-10-03 · owner del caso: Kernel Nautico.
Questa cartella avvia la cattura sorgente→coder. Non modifica l'app Three.js già verificata.

## Che cosa esiste

`capture.mjs` è un modulo JavaScript senza dipendenze o rete. Conserva una cattura JSON, normalizza punti nella vista catturata, confronta le identità dichiarate di sorgente/vista e prepara una richiesta per il coder mantenendola distinta dall'interpretazione AI.

`capture.test.mjs` esercita dieci casi. Esecuzione locale su Node v22.16.0: 10 passati, 0 falliti. Identità dei file e portata sono in `PROOF.json`; log in `work/continuity/CAPTURE_TESTS_2026-10-03.tap`.

```sh
node --test workstations/visual-presentation/production/design-capture/capture.test.mjs
```

I test usano un esempio esplicitamente illustrativo. Non provano la corretta acquisizione di una foto, la disponibilità dell'asset, la comprensione del disegno, la sua corrispondenza con una superficie 3D o l'uso di un canvas nel browser. Il modulo confronta identificatori forniti: `recorded_frame_identity_matches` significa corrispondenza dichiarata, non che un file sia stato trovato o caricato.

## Relazione preservata

Un contributo ha la sua sorgente: tratti, note, foto, diagramma o una forma successiva. Il tipo del contributo resta aperto. La richiesta di lavoro e l'interpretazione del sistema non riscrivono quella sorgente.

Una nota relativa al cruiser generico resta legata alla sua vista. Se domani entra un altro modello, l'identità semantica da sola non autorizza a spostare la nota sulla nuova geometria. Si può mostrare la cattura originale, confrontare le varianti e formare un nuovo collegamento quando necessario.

## Interfaccia del modulo

- `normalizePoint(x, y, width, height)` conserva coordinate relative alla vista catturata.
- `createCapture(input)` controlla la struttura minima e restituisce una copia JSON; preserva estensioni e tipi di contributo non predefiniti.
- `assessBinding(capture, current)` rileva differenze negli identificatori di sorgente, revisione e vista. Non esegue remapping né verifica la verità degli identificatori.
- `createCoderHandoff(capture, {request, baseRevision, interpretation})` prepara dati locali; non invia, non approva e non esegue.

Lo stato della sorgente visuale e lo stato di una competenza collegata restano separati. Non ereditiamo un claim dalla parola `exercised` né dalla presenza di un record.

## Passaggio operativo a Codex — prossimo incremento

Entrare dal BOOT corrente di questa branch e da `work/PRODUCT_CONTINUUM_2026-10-03.md`. Il visual di partenza resta e026f4b2251e6a963b4518357916bf6a3c6621b4; runtime precedente efe2e081. Non modificare i candidati chiusi o main. Il lavoro eseguibile successivo usa una branch separata e prove proprie.

Risultante da rendere usabile: durante l'osservazione della scena o di un'immagine/tela, l'operatore disegna e scrive; conserva il contributo originale nel suo contesto; prepara una richiesta con cui il coder possa produrre una variante riferita a quel contributo.

### Comportamento da formare

1. Aprire un modo di annotazione con un fotogramma stabile oppure una tela/immagine locale. Il tratto non deve scorrere involontariamente su una scena in movimento. Conservare e ripristinare la relazione con tempo/fase e vista.
2. Offrire tratto libero, nota, annulla/ripristina e selezione del contributo nella forma che il Design owner ritiene adatta. Non obbligare a decidere prima se ogni segno è problema, idea, richiesta o competenza.
3. Conservare sorgente, vista, contributi e richiesta come dati recuperabili. Un file di esportazione può contenere manifest JSON, immagine catturata o riferimento locale verificabile, e tratti. Non basta esportare la sintesi testuale dell'AI.
4. Mostrare ciò che si sta preparando per il coder. L'esportazione locale è già utile. L'invio a un servizio/provider o l'invocazione del coder è un effetto distinto, da collegare soltanto con il mezzo e la selezione effettivamente disponibili.
5. Per il primo ritorno, produrre una variante locale scelta dall'operatore e collegare il risultato all'identità della cattura. Conservare originale, richiesta, eventuale interpretazione e variante. Il confronto deve restare possibile.

Questi punti specificano l'uso, non impongono una topologia software. Il modulo può essere adattato o sostituito preservando le relazioni. Preferire il riuso di unità di interazione già presenti. Il multiutente simultaneo, il backend e l'intera UI aziendale non sono prerequisiti del primo uso in riunione.

### Mezzi da verificare sul nodo esecutivo

Il nodo deve osservare il proprio browser, filesystem e renderer. La visibilità della repo non installa Blender, un modello image-to-3D o una API. È possibile sviluppare il circuito annotazione→variante senza questi strumenti; la generazione di geometria entra quando la trasformazione selezionata la richiede.

Per il cambio generico→oggetto riconoscibile, distinguere immagine di concept, asset 3D e sorgente ingegneristica. Non sono una scala obbligatoria; ciascuno deve apparire per ciò che effettivamente contiene. Nuovi asset non ereditano automaticamente annotazioni, punti semantici, prove o licenza del cruiser precedente.

### Verifica della realizzazione

Esercitare originali e richieste separate; export/import; annulla/ripristina; focus e ripristino della vista; cambio di fase e asset; ridimensionamento; fallback senza WebGL; assenza di invii impliciti. Un errore di associazione deve conservare il contributo, non perderlo o collegarlo in silenzio altrove.

Ripetere solo le prove dell'app interessate dal cambio e identificare la revisione eseguita. Il comportamento e l'aspetto vanno osservati nel browser; i dieci test di questa cartella non li sostituiscono. Un test umano può rispondere a una domanda concreta, ma non è un gate generale per poter progettare.

### Owner e ritorno

Kernel Nautico conserva il caso e la continuità del prodotto. Design conserva un eventuale metodo nuovo di acquisizione, associazione o interazione. Semantic–Causal Incarnation partecipa se cambia il modo di far continuare una relazione fra mezzi. Meta_Skill/Meta_Metodo imparano soltanto se la composizione o formazione cambia; un'implementazione riuscita di sapere già presente può lasciare i metodi invariati.

Restituire candidato, file/revisione, prove, osservazioni, differenza locale o riusabile e punto da cui continuare. Fermarsi con un circuito locale revisibile disegno/nota→richiesta→variante, oppure con la dipendenza concreta che impedisce quel circuito. Nessun merge, deploy, release, outreach, spesa o modifica automatica di sistemi aziendali.
