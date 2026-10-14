# Conoscere Kernel Nautico e usare le schede

Kernel Nautico collega conoscenze, strumenti e ragioni delle scelte lungo
il lavoro del cantiere e la vita dell’imbarcazione. La presentazione permette
di esplorare un caso illustrativo: un’esigenza dell’armatore sull’accesso a poppa.
Ufficio tecnico, reparti del cantiere, fornitori, equipaggio e assistenza
partecipano in momenti diversi, conservando requisiti, configurazioni e riscontri.

## Scegliere il contesto

La panoramica prepara uno spazio di lavoro per Ufficio tecnico, Cantiere,
Fornitori, A bordo o Assistenza. Le voci della pagina permettono anche di
conoscere il kernel, capire come impara, esplorare la collaborazione,
presentare il lavoro all’armatore e preparare un contributo al progetto.
Scegliendo una voce, il campo aperto viene portato in vista.

## Seguire il lavoro nelle schede

Una scheda chiarisce il contesto e i punti aperti; un’altra raccoglie una
proposta o un riscontro. Si possono esplorare alternative, confrontare due
contributi, organizzare il seguito e ritrovare ciò che era rimasto aperto.
Le schede si affiancano o si portano al centro mantenendo focus e bozze.
La presentazione e la guida restano disponibili durante l’esplorazione.

Nelle tessere iniziali icona e titolo identificano insieme l’attività.
Da Strumenti puoi scegliere Libero e adattare lo spazio delle schede:
trascina l’angolo inferiore destro, anche nel formato compatto. Sullo stesso
controllo le frecce della tastiera ridimensionano la scheda; Maiusc permette
variazioni più ampie. Il contesto e le bozze restano collegati al lavoro.

## Chiedere alla guida AI

Il dialogo della scheda conserva l’argomento del caso. La domanda inviata
esplicitamente raggiunge MAIOS AI nel sito configurato con la propria
conversazione e il contesto pubblico della scheda; le altre bozze restano
locali. La chat generale può aiutare a scegliere il percorso. Se il servizio
non è disponibile, l’interfaccia lo indica.

## Dal caso illustrativo al lavoro del cantiere

Il caso e gli eventi della presentazione sono illustrativi. Note e proposte
restano nella sessione finché vengono esportate o trasferite. Nel cantiere,
il kernel opera con documenti, persone, strumenti e sistemi collegati a quel
contesto. Il progetto e la singola imbarcazione mantengono configurazione e
storia proprie. Un riscontro può migliorare il metodo quando viene compreso
e integrato nella competenza che continua il lavoro.

La [guida di avvio](../BOOT.md) permette di partire dal proprio caso. Il
[modello operativo nautico](NAUTICAL_REFERENCE_OPERATING_MODEL_0_1.md)
approfondisce le relazioni tra le fasi e gli attori del lavoro.

## Per l’integrazione tecnica

Il profilo `workstations/public-griglia/PROFILE.json` contiene significati e
primo assetto del dominio. K-UX-AI fornisce il builder e l’adattatore; BUILD.json
registra le identità di riferimento, profilo, runtime e HTML. Con le sorgenti
K-UX-AI accanto a questo repository:

```sh
python ../k-ux-ai/tools/build_public_griglia.py --profile workstations/public-griglia/PROFILE.json --output workstations/public-griglia/demo
python -m http.server 8080 --bind 127.0.0.1
```

L’interfaccia è raggiungibile in `/workstations/public-griglia/demo/`.
Il server statico non fornisce il servizio MAIOS AI. Il collegamento AI e
le azioni sui sistemi del cantiere si configurano nell’ambiente che adotta
il kernel, con le fonti e le responsabilità proprie di quell’ambiente.
