/** Authored public study. These records are an illustrative field, not company data.
 * Identity, source and relation type are kept separate from layout and selection.
 */
export const FIELD_ID = 'kn.contextual-study.20261006.v1';
export const SUBJECT = Object.freeze({ id: 'cvs-01/accesso-poppa', label: 'Accesso di poppa', kind: 'functional_subject', scenario: 'Esempio illustrativo CVS-01' });
const source = 'CVS-01 · scenario redatto per questo prototipo';
const item = (id, label, kind, state, meaning, next, owner) => ({ id, label, kind, state, meaning, next, owner, source });
export const OBJECTS = Object.freeze(Object.fromEntries([
  item('intent','Esigenza del cliente','intento','Dichiarazione illustrativa','La persona chiede un accesso a bordo più agevole. Il desiderio è il punto da chiarire, non una specifica tecnica già completa.','Precisare le condizioni d’uso con la persona.','Cliente e progettazione'),
  item('access','Accesso di poppa','funzione','Oggetto della domanda','È il riferimento funzionale che tiene insieme le viste. Non identifica da solo un disegno, un componente o una singola installazione.','Esplorare la stessa questione da un altro contesto.','Kernel Nautico · campo del caso'),
  item('design-a','Progetto A','progetto','Riferimento dello scenario','La soluzione A è il riferimento del confronto illustrativo. Non è un progetto approvato dal cantiere.','Raggiungere il disegno e la revisione pertinenti nel caso reale.','Progettazione'),
  item('design-b','Variante B','proposta','Proposta da valutare','Una possibile variante mantiene l’esigenza originaria ma può cambiare componenti, ingombri e uso. Non sostituisce la soluzione A.','Confrontare le conseguenze prima di decidere.','Progettazione con le persone coinvolte'),
  item('part-a','Componente A','componente','Riferimento documentale','È la parte di riferimento dello scenario. La sua presenza in una distinta non prova che sia installata a bordo.','Verificare il collegamento tra riferimento e configurazione effettiva.','Progettazione e configurazione'),
  item('part-b','Componente B','componente','Alternativa proposta','È un oggetto distinto da A. Un’offerta o una disponibilità dichiarata non ne provano compatibilità, approvazione o installazione.','Collegare documenti e verifiche tecniche ai responsabili.','Acquisti e responsabili tecnici'),
  item('supplier','Fornitore','partecipante','Ruolo dello scenario','Può fornire una proposta e i documenti del componente. Non decide da solo la compatibilità con il progetto.','Richiedere identificazione e documentazione pertinenti.','Rete fornitori'),
  item('offer','Offerta di B','fonte','Documento illustrativo','L’offerta è una fonte sulla proposta del fornitore, non una decisione del cantiere. Qui non sono inseriti prezzi, misure o tempi aziendali.','Rendere esplicite revisione e condizioni dell’offerta reale.','Fornitore e acquisti'),
  item('interface','Ingombri e fissaggi','verifica','Da qualificare','La sostituzione può interessare interfacce, installazione e uso. La rappresentazione non esegue il confronto ingegneristico.','Far partecipare chi possiede disegni e criteri di verifica.','Progettazione e produzione'),
  item('work','Lavorazione','attività','Applicazione da definire','Una modifica di progetto può cambiare il lavoro in cantiere. Non è un ordine di produzione e nessuna lavorazione è avviata qui.','Collegare la configurazione scelta alle istruzioni applicabili.','Produzione'),
  item('quality','Riscontro e verifica','evidenza','Evidenza da acquisire','Il riscontro riguarda un oggetto, una revisione e condizioni precise. La selezione di questo nodo non equivale a una verifica superata.','Conservare esito, fonte e condizioni della verifica reale.','Qualità e responsabile della verifica'),
  item('asbuilt','Configurazione a bordo','configurazione','Non stabilita nello scenario','Non sappiamo quale parte sia effettivamente installata. Questo vuoto resta visibile anche quando B viene selezionato nelle altre viste.','Identificare imbarcazione, parte e revisione effettive.','Cantiere e assistenza'),
  item('use','Esperienza a bordo','evento','Situazione illustrativa','Un riscontro nell’uso può rendere pertinente una zona, un componente o un requisito. Non proviene da sensori o da una barca connessa.','Collegare la segnalazione a fonte, condizioni e configurazione.','Equipaggio e assistenza'),
  item('service','Intervento','proposta','Da definire con il caso','Prima di intervenire occorre capire la configurazione e ciò che è accaduto. Nessun intervento o sostituzione viene autorizzato dalla mappa.','Formare il seguito con il responsabile del caso.','Assistenza'),
  item('learning','Metodo per il seguito','metodo','Proposta di apprendimento','Una conseguenza può cambiare un metodo o il passaggio tra reparti. Il ritorno a una competenza richiede una differenza riusabile: archiviare la segnalazione non basta.','Individuare che cosa dovrà cambiare e chi possiede quel modo di lavorare.','Competenza o relazione tra owner pertinente'),
].map(o => [o.id, Object.freeze(o)])));
export const KINDS = Object.freeze({ intento:'Intento', funzione:'Funzione', progetto:'Progetto', proposta:'Proposta', componente:'Componente', partecipante:'Persona / ruolo', fonte:'Fonte', verifica:'Verifica', attività:'Lavoro', evidenza:'Evidenza', configurazione:'Configurazione', evento:'Esperienza', metodo:'Metodo' });
const relation = (from,to,predicate,label,meaning) => ({ from,to,predicate,label,meaning,source });
export const RELATIONS = Object.freeze([
  relation('intent','access','motivates','orienta','L’esigenza orienta la comprensione dell’accesso.'),
  relation('access','design-a','represented_by','si rappresenta in','La funzione può avere una definizione progettuale.'),
  relation('design-b','design-a','alternative_to','alternativa a','Le due proposte restano oggetti distinti.'),
  relation('design-a','part-a','refers_to','riferisce','Il progetto cita una parte; non prova la sua installazione.'),
  relation('design-b','part-b','may_use','può richiedere','Relazione progettuale ipotizzata, da verificare.'),
  relation('supplier','offer','supplies','presenta','Il fornitore è fonte della proposta.'),
  relation('offer','part-b','describes','descrive','La proposta identifica B come alternativa.'),
  relation('part-b','part-a','alternative_to','alternativa a','B non diventa A e non ne eredita lo stato.'),
  relation('part-b','interface','requires_check','richiede confronto','La disponibilità non dimostra la compatibilità.'),
  relation('interface','work','may_affect','può cambiare','La verifica può cambiare il seguito in produzione.'),
  relation('work','quality','requires_evidence','richiede riscontro','Un’attività e la prova del suo esito sono distinti.'),
  relation('quality','asbuilt','can_qualify','può qualificare','Solo evidenze pertinenti possono qualificare lo stato effettivo.'),
  relation('use','asbuilt','must_reference','va riferita a','La segnalazione ha senso rispetto a una configurazione identificata.'),
  relation('asbuilt','part-a','unknown_correspondence','corrispondenza non verificata','Non è stabilito che A sia installato.'),
  relation('asbuilt','part-b','unknown_correspondence','corrispondenza non verificata','Non è stabilito che B sia installato.'),
  relation('use','service','can_open','può aprire','L’esperienza può avviare un caso, non decide l’intervento.'),
  relation('service','quality','requires_evidence','richiede verifica','La conclusione dell’intervento richiede il riscontro pertinente.'),
  relation('quality','learning','possible_return','può insegnare','Una differenza riusabile può cambiare un metodo; non ogni evento lo fa.'),
  relation('learning','intent','possible_return','torna al progetto','L’esperienza può cambiare i requisiti del lavoro successivo.'),
].map(Object.freeze));
const node = (id,x,y) => ({id,x,y});
export const CONTEXTS = Object.freeze({
  studio: { label:'Studio', short:'Intento e progetto', publicTarget:'nautico-studio', morphology:'layers',
    title:'Un’esigenza, più modi di darle forma.', question:'Quali relazioni cambia una variante dell’accesso?',
    explanation:'Seleziona requisito, progetto o parte. Il confronto conserva la ragione della proposta senza scambiarla per una decisione.',
    participants:'Cliente · progettazione · ingegneria', system:'Brief, disegni e revisioni · da collegare nel caso aziendale',
    nodes:[node('intent',15,22),node('access',47,17),node('design-a',26,49),node('design-b',69,49),node('interface',75,80)],
    takeAway:'Il desiderio può diventare specifica attraverso il lavoro; non occorre conoscere tutto prima di iniziare.' },
  cantiere: { label:'Cantiere',short:'Definizione e realizzazione',publicTarget:'nautico-cantiere',morphology:'assembly',
    title:'Il disegno incontra ciò che viene realizzato.',question:'Che cosa deve concordare prima di cambiare una parte?',
    explanation:'La sezione mette in relazione parte, lavorazione e riscontro. Una proposta non colora automaticamente lo stato dell’installazione.',
    participants:'Commessa · produzione · qualità',system:'Disegni, distinta, istruzioni e riscontri · da collegare',
    nodes:[node('design-a',14,20),node('part-a',35,48),node('part-b',70,48),node('work',16,80),node('quality',50,80),node('asbuilt',83,80)],
    takeAway:'Previsto, proposto, realizzato e verificato restano stati diversi, anche quando riguardano la stessa zona.' },
  rete: { label:'Fornitori',short:'Parte e dipendenze',publicTarget:'nautico-fornitori',morphology:'network',
    title:'Un’alternativa non è ancora una sostituzione.',question:'La proposta di B che cosa cambia per il resto del lavoro?',
    explanation:'Segui il componente dall’offerta alle verifiche. Confronta A e B senza attribuire all’alternativa lo stato della parte di riferimento.',
    participants:'Acquisti · fornitore · progettazione · produzione',system:'Offerta, schede tecniche, interfacce e configurazione · da collegare',
    nodes:[node('supplier',14,19),node('offer',14,49),node('part-b',47,49),node('part-a',47,18),node('interface',82,30),node('work',82,72),node('asbuilt',47,83)],
    takeAway:'La rete mostra passaggi e responsabilità, non una catena automatica di approvazioni.' },
  showroom: { label:'Showroom',short:'Persona e possibilità d’uso',publicTarget:'nautico-showroom',morphology:'experience',
    title:'Il desiderio del cliente resta nel progetto.',question:'Che cosa vuole poter fare la persona a bordo?',
    explanation:'Si parte dall’esperienza desiderata, poi si esplorano le proposte. Le opzioni qui non sono caratteristiche già vendibili.',
    participants:'Cliente · commerciale · progettazione',system:'Brief cliente, configurazioni e caratteristiche verificate · da collegare',
    nodes:[node('intent',16,22),node('use',80,22),node('access',48,49),node('design-a',24,81),node('design-b',75,81)],
    takeAway:'Una richiesta commerciale può diventare un contributo al progetto senza essere persa nella presentazione.' },
  mare: { label:'A bordo',short:'Oggetto e situazione',publicTarget:'nautico-bordo',morphology:'scales',
    title:'La barca e la situazione si leggono insieme.',question:'Quali fonti rendono comprensibile ciò che accade a bordo?',
    explanation:'Due scale coordinate: il sistema della barca e la situazione d’uso. La carta è schematica; qui non ci sono rotta, posizione o telemetria reali.',
    participants:'Comandante · equipaggio · assistenza',system:'Configurazione, manuali e fonti situate · integrazioni non presenti',
    nodes:[node('access',23,26),node('asbuilt',24,74),node('use',74,28),node('quality',75,76)],
    takeAway:'Fonte, tempo e copertura precedono ogni uso dell’informazione. Una UI non attribuisce autorità di navigazione.' },
  service: { label:'Assistenza',short:'Evento, configurazione e seguito',publicTarget:'nautico-assistenza',morphology:'timeline',
    title:'Un evento continua oltre l’intervento.',question:'Che cosa deve rimanere collegato quando il caso prosegue?',
    explanation:'Leggi l’evento insieme alla configurazione e al possibile seguito. La storia non prova che l’alternativa B sia stata installata.',
    participants:'Equipaggio · assistenza · qualità · progettazione',system:'Segnalazione, configurazione as-built, interventi e verifiche · da collegare',
    nodes:[node('use',14,22),node('asbuilt',48,22),node('part-b',82,22),node('service',14,72),node('quality',48,72),node('learning',82,72)],
    takeAway:'Conservare la storia e cambiare il metodo sono due risultati diversi. La differenza riusabile torna a chi dovrà lavorare diversamente.' },
});
// Freeze authored topology as well as semantic records; UI state never edits it.
for(const context of Object.values(CONTEXTS)){context.nodes.forEach(Object.freeze);Object.freeze(context.nodes);Object.freeze(context);}
export const CONTEXT_IDS = Object.freeze(Object.keys(CONTEXTS));
export const SOURCE_LINKS = Object.freeze([
  ['Superficie operativa e identità', 'docs/NAUTICAL_OPERATIONAL_SPATIAL_SURFACE_0_1.md'],
  ['Formazione delle viste', 'docs/NAUTICAL_OPERATIONAL_SPATIAL_SURFACE_0_1.md'],
  ['Contesti del lavoro nautico', 'docs/NAUTICAL_REFERENCE_OPERATING_MODEL_0_1.md'],
  ['Continuità del prodotto', 'docs/PUBLIC_PURPOSE.md'],
]);
export function objectById(id) { return typeof id==='string' && Object.hasOwn(OBJECTS,id) ? OBJECTS[id] : null; }
export function contextById(id) { return typeof id==='string' && Object.hasOwn(CONTEXTS,id) ? CONTEXTS[id] : null; }
export function visibleRelations(id) { const ids=new Set(contextById(id)?.nodes.map(n=>n.id)||[]); return RELATIONS.filter(r=>ids.has(r.from)&&ids.has(r.to)); }
export function relatedContexts(objectId) { return CONTEXT_IDS.filter(id=>CONTEXTS[id].nodes.some(n=>n.id===objectId)); }
