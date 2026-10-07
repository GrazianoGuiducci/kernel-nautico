/** Editorial projection of Kernel Nautico and the situated product.
 * These scenes explain possible work; they do not record connected company systems.
 */
export const SCENES = Object.freeze([
  { id: 'intent', act: 'FORM', seconds: 11, label: 'Esigenza', title: 'Kernel Nautico collega\npersone, AI e conoscenza.',
    text: 'Il cliente chiede un accesso a bordo più agevole. Kernel Nautico aiuta il team e l’AI a collegare questa esigenza alle informazioni necessarie per progettare.',
    change: 'La richiesta del cliente diventa il punto di partenza del progetto.', roles: ['Cliente', 'Team di progetto', 'AI'],
    detail: 'Questo prototipo mostra come conservare una richiesta e svilupparla con un assistente AI. Il team può iniziare anche prima di conoscere tutte le misure e le specifiche.' },
  { id: 'design', act: 'FORM', seconds: 11, label: 'Progettazione', title: 'Il team confronta\nle soluzioni di progetto.',
    text: 'Il progettista annota la pianta di poppa e chiede una variante all’AI. Kernel Nautico conserva l’originale, la proposta e il motivo della scelta.',
    change: 'Il progettista può ricostruire perché il team ha scelto una soluzione.', roles: ['Progettista', 'Assistente AI', 'Responsabile del progetto'],
    detail: 'Nel progetto di poppa puoi scrivere una nota, disegnare, esportare la richiesta e importare una variante. La decisione viene registrata in questa copia del lavoro; il CAD aziendale resta separato.' },
  { id: 'build', act: 'BUILD', seconds: 11, label: 'Costruzione', title: 'Una modifica coinvolge\npiù reparti del cantiere.',
    text: 'Un fornitore propone un componente diverso. Acquisti, progettazione e produzione devono capire che cosa cambia prima di usarlo sullo yacht.',
    change: 'Kernel Nautico aiuta a collegare la proposta alle verifiche e ai responsabili.', roles: ['Acquisti', 'Progettazione', 'Produzione'],
    detail: 'La scena presenta un possibile impiego del kernel. L’azienda e il nostro team dovranno definire insieme i collegamenti con i gestionali, i disegni e i dati di produzione.' },
  { id: 'experience', act: 'LIVE', seconds: 11, label: 'Uso e assistenza', title: 'L’equipaggio segnala\nche cosa accade a bordo.',
    text: 'L’assistenza collega una segnalazione alla configurazione dello yacht e agli interventi precedenti. Il team può così indagare il problema a partire dal caso concreto.',
    change: 'La segnalazione conserva il legame con lo yacht e con le condizioni d’uso.', roles: ['Equipaggio', 'Assistenza', 'Progettazione'],
    detail: 'Lo yacht 3D serve a illustrare questi passaggi. Il prototipo non riceve dati da sensori di bordo e non rappresenta la configurazione di un’imbarcazione reale.' },
  { id: 'learning', act: 'RETURN', seconds: 13, label: 'Apprendimento', title: 'Il kernel conserva\nciò che il team impara.',
    text: 'Un caso può insegnare al team e all’AI quali verifiche servono e chi deve partecipare. Il metodo viene aggiornato perché quel sapere sia disponibile nel lavoro successivo.',
    change: 'Un nuovo caso permette di osservare se il metodo appreso viene usato.', roles: ['Team aziendale', 'Kernel Nautico', 'Assistente AI'],
    detail: 'La sezione «Come impara il kernel» mostra un esempio illustrativo di evoluzione del metodo e del suo uso successivo. Conservare il metodo lo rende disponibile; il suo uso va osservato nei casi reali.' },
]);
export const TOTAL_SECONDS = SCENES.reduce((n, scene) => n + scene.seconds, 0);
export const LEARNING = Object.freeze({
  title: 'Come il kernel impara\na coinvolgere i reparti.',
  before: 'Nell’esempio, un metodo iniziale indirizza il seguito di una segnalazione al responsabile più vicino al problema. Questa scelta poteva lasciare fuori altri reparti coinvolti.',
  difference: 'L’esempio mostra che una segnalazione può richiedere azioni diverse da più responsabili. Anche un’informazione persa nel passaggio tra reparti può richiedere una correzione.',
  after: 'Il metodo aggiornato chiede all’AI di distinguere le conseguenze del caso, individuare chi deve occuparsene e spiegare quale informazione deve passare da un reparto all’altro.',
  state: 'Esempio illustrativo · ritorno distribuito tra reparti',
  source: 'docs/LEARNING.md',
  newCase: 'In un secondo scenario illustrativo, un fornitore propone un componente alternativo. Il metodo permette per distinguere i contributi dei reparti: la disponibilità del componente, da sola, non ne dimostra la compatibilità con lo yacht.',
  paths: [
    ['Acquisti verifica l’offerta', 'Il reparto identifica il componente proposto e verifica la disponibilità dichiarata dal fornitore. La compatibilità richiede il confronto tecnico.'],
    ['Progettazione e produzione valutano la sostituzione', 'I tecnici confrontano requisiti, ingombri, fissaggi e conseguenze sulla configurazione dello yacht.'],
    ['L’assistenza ricostruisce ciò che è installato', 'Il reparto identifica il componente a bordo e la sua revisione, così che il confronto riguardi la configurazione effettiva.'],
    ['I reparti condividono le ragioni della scelta', 'Il passaggio da disponibilità a compatibilità e approvazione conserva i documenti usati e il responsabile di ogni valutazione.'],
  ],
});
export const FIELD_SESSION = Object.freeze({
  title: 'Lavoriamo insieme\nsu un caso del cantiere.',
  introduction: 'Proponiamo un incontro tra il vostro team e chi sviluppa Kernel Nautico. Scegliamo un problema concreto e valutiamo come l’AI possa aiutare le persone a usare informazioni, decisioni ed esperienza già disponibili.',
  bring: ['Il prototipo Kernel Nautico, da esplorare insieme.', 'Un esempio che collega la richiesta iniziale, le fonti, la risposta dell’AI e la decisione della persona.', 'Il metodo per conservare ciò che il team impara e renderlo utilizzabile nei casi successivi.'],
  company: ['Un problema o un’opportunità su cui desidera lavorare.', 'Le persone che conoscono il caso e possono valutarne le proposte.', 'I documenti e le informazioni che sceglie di condividere per quel caso.'],
  together: ['Una prima analisi del caso, con le domande e le proposte da valutare.', 'Le informazioni che devono passare fra persone, reparti e fasi del lavoro.', 'Una possibile sperimentazione comune, precisando risultato atteso, responsabilità e condizioni.'],
});
