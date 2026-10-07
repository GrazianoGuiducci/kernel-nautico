// Owner-authored company projections. They describe possible work; they are
// neither a company directory nor connected operational data.
export const FIELD_SOURCE = Object.freeze({
  owner: 'GrazianoGuiducci/kernel-nautico',
  revision: 'public-documentation',
  path: 'docs/PUBLIC_PURPOSE.md',
});

const source = (id, label, path) => Object.freeze({
  id, label, path, reference: `./public-receiver/sources/${path}`,
  owner: 'Kernel Nautico', revision: FIELD_SOURCE.revision, status: 'supplied_not_read',
});
const domain = source('nautical-model', 'Modello operativo nautico', 'docs/NAUTICAL_REFERENCE_OPERATING_MODEL_0_1.md');
const topology = source('company-topology', 'Azienda, progetto e singola imbarcazione', 'docs/ENTERPRISE_BOOTSTRAP_AND_KERNEL_TOPOLOGY_0_1.md');
const proposal = source('design-continuity', 'Contributi e specifiche progressive', 'docs/NAUTICAL_DESIGN_PROPOSAL_CONTINUITY_0_1.md');
const competence = source('nautical-competences', 'Competenze nautiche e ritorno dal service', 'COMPETENCE_FIELD.md');

export const COMPANY_CONTEXTS = Object.freeze([
  Object.freeze({
    id: 'studio', label: 'Studio', title: 'Dal desiderio alla proposta.',
    question: 'Come cambia l’accesso a poppa se cambia il modo di usarlo?',
    people: 'Armatore, designer, architetto navale e ingegneri',
    work: 'Una nota o uno schizzo apre il progetto. Persone e AI possono formare requisiti e alternative, rendendo leggibili ragioni, dipendenze e decisioni.',
    continuity: 'Il contributo originale resta riconoscibile mentre cresce la definizione del prodotto. Una scelta può rendere pertinenti strutture, impianti e costruzione.',
    capability: 'Qui puoi formare un caso e continuarlo con un ricevente reale. Il progetto di poppa offre anche nota, schizzo e confronto di una variante.',
    method: 'Parti dall’intento e dal contributo originale. Distingui un requisito d’uso da una misura osservata o una specifica proposta. Collega la proposta a persone, parti, fonti e verifiche che possono cambiarla. Forma i dettagli progressivamente; non richiedere una specifica completa per iniziare.',
    sampleTitle: 'Un accesso a poppa da ripensare',
    sample: 'Vorrei rendere più leggibile il passaggio centrale verso l’accesso a poppa. Partiamo dall’uso che desideriamo e formiamo le specifiche con il team.',
    sampleQuestion: 'Quale uso deve essere reso possibile o più agevole?',
    sources: Object.freeze([proposal, domain, topology]),
    returns: Object.freeze(['Progetto → requisiti, proposte e ragioni', 'Kernel Nautico → metodo progettuale riusabile', 'Design → comprensione e interazione']),
    designEntry: true,
  }),
  Object.freeze({
    id: 'cantiere', label: 'Cantiere', title: 'La scelta incontra la costruzione.',
    question: 'Che cosa deve continuare quando una proposta entra in lavorazione?',
    people: 'Commessa, produzione, allestimento e qualità',
    work: 'Una revisione può mettere in relazione disegni, parti, materiali, montaggio e verifiche. Il kernel aiuta a formare il quadro utile con chi realizza il prodotto.',
    continuity: 'Configurazione prevista, stato realizzato e riscontro di qualità conservano la propria identità. Il motivo di una modifica resta raggiungibile nel lavoro successivo.',
    capability: 'Qui puoi raccogliere una situazione, distinguere dati e proposte e preparare il contributo per il ricevente. I processi reali si collegano con il cantiere.',
    method: 'Riconosci l’oggetto, la revisione nota, la lavorazione e il riscontro effettivamente disponibile. Distingui previsto, realizzato e osservato. Cerca il passaggio fra owner che cambia il lavoro prima di attribuire una causa a una parte. Proponi il più piccolo prossimo contributo utile; non inventare avanzamenti, tempi o approvazioni.',
    sampleTitle: 'Una revisione da accompagnare in allestimento',
    sample: 'Stiamo valutando una modifica all’accesso a poppa. Vorrei capire quali disegni, lavorazioni e verifiche devono accompagnarla prima di portarla in allestimento.',
    sampleQuestion: 'Quale revisione sta usando il team per questa parte?',
    sources: Object.freeze([domain, topology, competence]),
    returns: Object.freeze(['Commessa → stato e dipendenze', 'Produzione / qualità → riscontro e correzione', 'Kernel Nautico → passaggi fra responsabilità']),
    designEntry: false,
  }),
  Object.freeze({
    id: 'rete', label: 'Rete fornitori', title: 'Una parte collega più decisioni.',
    question: 'Quali relazioni cambiano se cambia un componente?',
    people: 'Acquisti, fornitori, logistica e responsabili di commessa',
    work: 'Disponibilità, alternative e consegne acquistano significato rispetto alla parte, alla configurazione e alle persone che ne dipendono.',
    continuity: 'Una sostituzione porta con sé ragioni e condizioni. I passaggi verso progettazione, produzione e service possono restare riconoscibili.',
    capability: 'Qui puoi formare la domanda e le dipendenze da discutere. Dati del fornitore, costi e disponibilità entrano attraverso fonti dichiarate.',
    method: 'Parti dall’identità della parte e dalla ragione che rende pertinente un’alternativa. Distingui disponibilità riferita, compatibilità da qualificare e scelta approvata. Collega gli owner interessati senza inventare prezzi, tempi o equivalenze tecniche. L’assenza di dati può aprire una domanda utile a una persona o fonte precisa.',
    sampleTitle: 'Valutare l’alternativa a un componente',
    sample: 'Per il progetto stiamo considerando un componente alternativo. Vorrei chiarire che cosa deve essere confrontato e a chi serve il risultato prima di decidere.',
    sampleQuestion: 'Quale proprietà o vincolo rende il componente sostituibile?',
    sources: Object.freeze([domain, topology]),
    returns: Object.freeze(['Acquisti → fonti e disponibilità', 'Progetto / produzione → compatibilità e conseguenze', 'Service → configurazione effettiva']),
    designEntry: false,
  }),
  Object.freeze({
    id: 'showroom', label: 'Showroom', title: 'Un desiderio entra nel progetto.',
    question: 'Come può una conversazione con il cliente far crescere il prodotto?',
    people: 'Cliente, commerciale, marketing, dealer e progettazione',
    work: 'Un’esperienza desiderata può diventare un contributo situato. Configurazioni, profili d’uso e preferenze aprono il confronto con chi progetta.',
    continuity: 'Le parole del cliente restano distinte dall’interpretazione e dalla proposta. Il seguito può tornare alla persona con ragioni comprensibili.',
    capability: 'Qui puoi conservare una preferenza e formare un caso. Le caratteristiche offerte e gli impegni commerciali si definiscono con i loro responsabili.',
    method: 'Conserva la richiesta della persona prima di tradurla in caratteristiche. Collega esperienza desiderata, oggetto e uso. Distingui preferenza, proposta e configurazione effettivamente offerta. La rappresentazione può aiutare il dialogo senza costituire una promessa commerciale.',
    sampleTitle: 'Dall’esperienza desiderata a una proposta',
    sample: 'Il cliente immagina un uso dello spazio a poppa diverso da quello mostrato. Vorrei conservare il suo desiderio e capire come discuterlo con la progettazione.',
    sampleQuestion: 'Quale esperienza sta cercando la persona?',
    sources: Object.freeze([proposal, topology]),
    returns: Object.freeze(['Progetto → contributo del cliente', 'Business Manager → relazione e offerta', 'Editoriali / Design → spiegazione e rappresentazione']),
    designEntry: false,
  }),
  Object.freeze({
    id: 'mare', label: 'Navigazione', title: 'La situazione prende contesto.',
    question: 'Quali informazioni cambiano la comprensione della situazione?',
    people: 'Comandante, equipaggio e supporto operativo',
    work: 'Barca, perimetro e traversata aprono scale diverse. Le informazioni diventano utili insieme a compito, tempo, origine e copertura.',
    continuity: 'Un evento può restare legato alla nave e alle condizioni in cui è stato compreso, per il seguito a bordo e il ritorno al service.',
    capability: 'Qui puoi formare un caso informativo e le domande pertinenti. Sensori, sistemi di bordo e fonti di rotta richiedono un collegamento situato.',
    method: 'Riconosci nave, compito e natura della fonte. Per dati che dipendono dal tempo conserva osservazione, copertura e attualità quando disponibili. Distingui situazione riferita e scenario proposto. Forma supporto alla comprensione; nessuna animazione o risposta concede controllo della nave o prova l’accesso a sensori.',
    sampleTitle: 'Preparare il contesto di un evento a bordo',
    sample: 'Vorrei organizzare le informazioni utili a comprendere un evento a bordo, collegando il sistema interessato, la situazione della nave e le fonti disponibili.',
    sampleQuestion: 'Quale compito e quale intervallo temporale rendono utile il dato?',
    sources: Object.freeze([domain, topology, competence]),
    returns: Object.freeze(['Vessel / equipaggio → evento nel suo contesto', 'Service → seguito pertinente', 'Kernel Nautico → metodo di qualificazione delle fonti']),
    designEntry: false,
  }),
  Object.freeze({
    id: 'service', label: 'Porto e service', title: 'L’esperienza cambia il prossimo lavoro.',
    question: 'Che cosa può insegnare un riscontro sulla singola imbarcazione?',
    people: 'Equipaggio, marina, assistenza, manutentori e progettazione',
    work: 'Un intervento o un evento d’uso può essere letto insieme alla configurazione dello yacht, alle revisioni e alle persone coinvolte.',
    continuity: 'Il caso può produrre una correzione locale e, quando la relazione è riusabile, un cambiamento nel metodo di progettazione, produzione o service.',
    capability: 'Qui puoi separare osservazioni, ipotesi e domande, e preparare un ritorno al ricevente. La competenza nautica conserva già un metodo per qualificare questo passaggio.',
    method: 'Parti dal riscontro e dalla configurazione effettivamente nota. Non dedurre una causa dalla vicinanza temporale a un intervento. Distingui correzione del caso, ritorno al progetto e metodo riusabile. Cerca anche i passaggi tra service, fornitore, produzione e progettazione. Robot o sensori partecipano quando un compito concreto ne rende pertinente la capacità.',
    sampleTitle: 'Un riscontro dopo un intervento',
    sample: 'In questo esempio una segnalazione di infiltrazione arriva dopo un intervento. Vorrei distinguere che cosa sappiamo, quali ipotesi considerare e quale informazione cambia il seguito.',
    sampleQuestion: 'A quale configurazione e intervento si riferisce la segnalazione?',
    sources: Object.freeze([competence, domain, topology]),
    returns: Object.freeze(['Vessel / service → stato del caso', 'Progetto / qualità → correzione pertinente', 'Kernel Nautico → metodo; Meta_Skill → modo di apprendere']),
    designEntry: false,
  }),
]);

export function contextById(id) {
  const context = COMPANY_CONTEXTS.find(item => item.id === id);
  if (!context) throw new RangeError('Contesto di lavoro non riconosciuto.');
  return context;
}

export const DEFINITION_KINDS = Object.freeze([
  Object.freeze({ id: 'observed', label: 'Osservato', description: 'Un fatto riferito da una persona o fonte, con la sua provenienza.' }),
  Object.freeze({ id: 'proposed', label: 'Proposto', description: 'Una definizione da discutere, che può crescere nel progetto.' }),
  Object.freeze({ id: 'decided', label: 'Deciso', description: 'Una decisione dichiarata, con persona e ragione; non un’autenticazione aziendale.' }),
  Object.freeze({ id: 'unknown', label: 'Da chiarire', description: 'Una relazione aperta che può essere formata con persone e fonti.' }),
]);

export function methodForContext(id) {
  const context = contextById(id);
  return `Contesto: ${context.label}.\n${context.method}\n\nRitorni pertinenti:\n${context.returns.join('\n')}`;
}
