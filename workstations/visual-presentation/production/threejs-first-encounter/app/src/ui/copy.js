/** Public wording only. Source methods, captured cases and exchange records keep their original bytes. */
export const COMPANY_COPY = Object.freeze({
  "studio": {
    "label": "Studio",
    "title": "Il team progetta l’accesso a bordo.",
    "question": "Come cambia l’accesso a poppa se cambia il modo di usarlo?",
    "work": "Il cliente o il progettista descrive un’esigenza con una nota o uno schizzo. Il team e l’AI possono sviluppare requisiti e alternative, conservando le ragioni delle scelte.",
    "continuity": "Il progetto conserva la richiesta iniziale mentre il team precisa le soluzioni. Ogni scelta può coinvolgere anche i tecnici delle strutture, degli impianti e della costruzione.",
    "capability": "Qui puoi descrivere un caso e preparare una richiesta per il tuo assistente AI. Il progetto di poppa offre anche nota, schizzo e confronto di una variante.",
    "returns": [
      "Il progetto conserva requisiti, proposte e ragioni delle scelte",
      "Il kernel può conservare un metodo progettuale utile ad altri casi",
      "Chi progetta l’interfaccia può migliorare il modo di comprendere e usare il progetto"
    ]
  },
  "cantiere": {
    "label": "Cantiere",
    "title": "Il cantiere prepara una modifica dello yacht.",
    "question": "Quali disegni e verifiche servono prima di realizzare la modifica?",
    "work": "Il responsabile di commessa collega la modifica proposta a disegni, componenti, materiali e verifiche. Kernel Nautico può aiutare il team a ricostruire queste relazioni con chi realizza lo yacht.",
    "continuity": "Il team distingue ciò che il disegno prevede, ciò che è stato costruito e ciò che il controllo qualità ha osservato. Il motivo della modifica resta consultabile durante le lavorazioni successive.",
    "capability": "Qui puoi descrivere la lavorazione, distinguere dati e proposte e chiedere un’analisi al tuo assistente AI. I collegamenti ai processi produttivi vanno definiti con il cantiere.",
    "returns": [
      "La commessa conserva lo stato del lavoro e le attività collegate",
      "Produzione e qualità valutano il riscontro e la correzione",
      "Il kernel conserva come devono passare le informazioni tra responsabili"
    ]
  },
  "rete": {
    "label": "Rete fornitori",
    "title": "I reparti valutano un componente alternativo.",
    "question": "Che cosa deve verificare il team prima di sostituire il componente?",
    "work": "Acquisti raccoglie l’offerta del fornitore. Progettazione e produzione valutano compatibilità e conseguenze della sostituzione sullo yacht e sulle lavorazioni previste.",
    "continuity": "Il caso conserva le ragioni della sostituzione, le condizioni da verificare e le informazioni che acquisti deve condividere con progettazione, produzione e assistenza.",
    "capability": "Qui puoi descrivere il componente e preparare le domande per il confronto. Aggiungi i riferimenti del fornitore per documentare costi, disponibilità e caratteristiche.",
    "returns": [
      "Acquisti verifica documenti e disponibilità",
      "Progettazione e produzione valutano compatibilità e conseguenze",
      "L’assistenza ricostruisce il componente effettivamente installato"
    ]
  },
  "showroom": {
    "label": "Showroom",
    "title": "Il commerciale raccoglie le esigenze del cliente.",
    "question": "Come può una conversazione con il cliente far crescere il prodotto?",
    "work": "Il cliente descrive come vorrebbe usare lo yacht. Il commerciale conserva le sue parole e le porta alla progettazione, insieme alle preferenze e alle configurazioni da discutere.",
    "continuity": "Il caso distingue la richiesta del cliente dall’interpretazione del team e dalla proposta. Il commerciale può spiegare al cliente come il progetto risponde alla sua esigenza.",
    "capability": "Qui puoi registrare l’esigenza del cliente e chiedere all’AI di aiutarti a svilupparla. Il commerciale e il team tecnico definiranno le caratteristiche effettivamente offribili.",
    "returns": [
      "Il progetto conserva la richiesta del cliente",
      "Il responsabile commerciale valuta la relazione con il cliente e l’offerta",
      "Comunicazione e design migliorano la spiegazione e la rappresentazione della proposta"
    ]
  },
  "mare": {
    "label": "Navigazione",
    "title": "L’equipaggio ricostruisce un evento a bordo.",
    "question": "Quali informazioni servono all’equipaggio per comprendere l’evento?",
    "work": "Il comandante e l’equipaggio collegano l’evento al sistema interessato, alla posizione dello yacht e alle condizioni del momento. Ogni informazione mantiene la propria fonte e l’orario a cui si riferisce.",
    "continuity": "La registrazione collega l’evento allo yacht e alle condizioni d’uso, così che equipaggio e assistenza possano riprendere il caso con le stesse informazioni.",
    "capability": "Qui puoi descrivere l’evento e preparare le domande per l’AI. Il prototipo non acquisisce dati di navigazione: i collegamenti a sensori e fonti di rotta vanno progettati con l’azienda.",
    "returns": [
      "Il registro dello yacht conserva l’evento descritto dall’equipaggio",
      "L’assistenza valuta come proseguire il caso",
      "Il kernel può migliorare il metodo con cui valuta origine e attualità delle informazioni"
    ]
  },
  "service": {
    "label": "Porto e assistenza",
    "title": "L’assistenza indaga una segnalazione sullo yacht.",
    "question": "Che cosa può insegnare un riscontro sulla singola imbarcazione?",
    "work": "L’assistenza confronta la segnalazione con la configurazione dello yacht e gli interventi documentati. Il team distingue le osservazioni dalle ipotesi sulle cause.",
    "continuity": "Il team può risolvere il problema di quello yacht e ricavarne un metodo utile ad altri casi di progettazione, produzione o assistenza.",
    "capability": "Qui puoi registrare osservazioni, ipotesi e domande e preparare una richiesta per l’AI. Kernel Nautico include un metodo per individuare chi deve occuparsi delle diverse conseguenze del caso.",
    "returns": [
      "Il registro dello yacht e l’assistenza conservano lo stato del caso",
      "Progettazione e qualità valutano la correzione",
      "Il kernel può migliorare il metodo di lavoro e il modo con cui ricava nuove competenze dall’esperienza"
    ]
  }
});
export const PHASE_COPY = Object.freeze({
  "FORM": {
    "title": "Il team progetta lo yacht.",
    "text": "Il progetto collega le esigenze del cliente ai documenti e alle decisioni del team."
  },
  "BUILD": {
    "title": "Il cantiere costruisce lo yacht.",
    "text": "La scena illustra la costruzione dello yacht e il legame con le scelte di progetto."
  },
  "LIVE": {
    "title": "L’equipaggio usa lo yacht.",
    "text": "L’equipaggio e l’assistenza possono segnalare che cosa accade durante l’uso dello yacht."
  },
  "RETURN": {
    "title": "Il team migliora il progetto con l’esperienza.",
    "text": "Il team valuta una segnalazione sull’accesso a poppa e può ricavarne un criterio per i progetti successivi."
  }
});
export const RETURN_LABELS = Object.freeze({ state: 'Stato del caso', correction: 'Correzione proposta', 'reusable-method': 'Metodo riutilizzabile', 'owner-interface': 'Passaggio tra responsabili', unknown: 'Da chiarire' });
export const PHASE_LABELS = Object.freeze({ FORM: 'Progettazione', BUILD: 'Costruzione', LIVE: 'Uso dello yacht', RETURN: 'Apprendimento' });
export const contextForDisplay = context => ({ ...context, ...COMPANY_COPY[context.id] });
