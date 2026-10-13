# Kernel Nautico nella Griglia K-UX-AI

La UI presenta il kernel del settore e rimane una guida nel lavoro.
Ufficio tecnico, cantiere, fornitori, bordo e assistenza partecipano al primo
caso illustrativo di accesso a poppa. Requisiti dell'armatore, configurazioni,
proposte e riscontri restano collegati. La funzione determina il tipo di
scheda: presentazione, guida, contributo, verifica, confronto, organizzazione,
monitoraggio, scenario, ripresa e dialogo.

## Composizione delle sorgenti

`workstations/public-griglia/PROFILE.json` è il profilo del kernel nautico.
K-UX-AI fornisce il riferimento GPT invariato, l'adattatore pubblico e il
builder. Nautico conserva il proprio kernel, competenze e significati di
dominio. L'azienda, un programma/progetto e una singola imbarcazione hanno
contesto, configurazione e continuità propri.

Con un checkout K-UX-AI accanto a questo repository:

```sh
python ../k-ux-ai/tools/build_public_griglia.py --profile workstations/public-griglia/PROFILE.json --output workstations/public-griglia/demo
python -m http.server 8080 --bind 127.0.0.1
```

Apri `http://127.0.0.1:8080/workstations/public-griglia/demo/`.
La Home prepara un campo di schede complementari. I gesti e le bozze
continuano nel campo. La distribuzione porta anche `BUILD.json`, con
l'identità dei file che hanno formato questa derivata.

## Dialoghi e continuazione

Su un host MAIOS configurato, la domanda inviata esplicitamente raggiunge
il servizio AI con la propria storia e il contesto pubblico della scheda.
Le altre bozze restano locali. Nel server statico semplice il servizio manca
e la UI lo rende percepibile. Una fixture verifica il trasporto senza LLM.
Una proposta può essere conservata ed esportata per chi continua il caso:
quel trasferimento permette al kernel di comprendere il contributo e farne
evolvere il metodo; il salvataggio locale da solo non realizza assimilazione.

Il caso e gli eventi sono illustrativi. Fonti del cantiere, strumenti,
ruoli, strumentazione di bordo e azioni si compongono nell'adozione reale.
La guida si può adattare al nuovo contesto senza perdere il nucleo di dominio.
Plancia e collaborazione tra postazioni, automazioni e altri mezzi sono
possibilità che quell'ambiente può rendere operative.

## Revisione del mezzo condiviso

La Home presenta «Kernel Nautico — Interazione intelligente per il ciclo di
vita del progetto». Il testo dell'operatore collega MAIOS Project Kernel,
fonti del cantiere, progetto e singola imbarcazione. Il canvas configurabile
rispondendo a notifiche descrive un potenziale da situare nell'adozione;
questa demo non attiva notifiche tra postazioni. L'introduzione compatta
lascia spazio alle attività e mantiene i testi della guida raggiungibili.
Nel sito, le voci di presentazione e contesto portano al campo aperto dopo
la conferma. Gli schermi più piccoli conservano lo scorrimento e schede leggibili.

La derivata corrente usa K-UX-AI `c83bafe306848343b7f91a409bcb2d51b325e5a2`, versione
0.2.0-alpha.3. BUILD.json conserva SHA di riferimento, profilo, runtime e
HTML. La sorgente del mezzo resta in K-UX-AI; il profilo e le competenze di
dominio appartengono a questo prodotto. Il receiver 3D separato è costruito
dal checkpoint Nautico `bb2b3f9d5e6020bbc5291a1c7c5e5002013f99fd`.
