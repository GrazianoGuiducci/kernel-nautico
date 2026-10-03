import { RETURN_EXAMPLE } from './story.js';

// Qualified knowledge, its visual projection and the receiving context have
// separate identities. A renderer can consume this relation without owning it.
function freeze(value) {
  for (const child of Object.values(value)) {
    if (child && typeof child === 'object' && !Object.isFrozen(child)) freeze(child);
  }
  return Object.freeze(value);
}
const revision = 'e35403bcc9213a6805a03c77ca9889adbef4ecc4';
const repository = 'https://github.com/GrazianoGuiducci/kernel-nautico';
const source = (path, title, description) => ({
  path, title, description, revision, url: `${repository}/blob/${revision}/${path}`,
});

export const RETURN_RELATION = freeze({
  semanticId: 'kn.lifecycle.return-qualification',
  owner: { name: 'Kernel Nautico', repository },
  knowledge: {
    name: 'Lifecycle Return Qualification', version: '0.2', state: 'exercised',
    scope: 'owner_native_repository_and_reentry',
    sources: [
      source('COMPETENCE_FIELD.md', 'La competenza e il suo stato',
        'Definizione di Lifecycle Return Qualification v0.2, metodo e stato degli esercizi.'),
      source('traversals/I2_EXERCISE_01_WHEELYBOAT_DISTRIBUTED_RETURN_2026-10-02.md',
        'Il secondo esercizio: Wheelyboat 123',
        'Come un caso diverso ha reso visibili più ritorni causali e le relazioni fra i soggetti coinvolti.'),
    ],
  },
});

export const RETURN_PROJECTION = freeze({
  semanticId: RETURN_RELATION.semanticId,
  mode: 'public_presentation',
  example: RETURN_EXAMPLE,
  capabilities: ['inspect', 'deepen', 'open_source'],
});

// This capsule is a situated public contraction, not the domain's full body.
export const RETURN_CONTEXT = freeze({
  receiver: 'first_encounter_client_or_funder',
  title: 'Quando l’esperienza diventa capacità.',
  depths: [
    {
      id: 'meaning', label: 'Significato', title: 'L’esperienza può cambiare il prossimo lavoro.',
      paragraphs: [
        'Ciò che accade nella vita dello yacht può tornare al progetto insieme alle sue ragioni. Una valutazione del contesto riconosce quale differenza può diventare utile.',
        'Il Kernel mantiene questa relazione raggiungibile: il lavoro successivo può iniziare con un criterio o una competenza che prima mancava.',
      ],
    },
    {
      id: 'mechanism', label: 'Meccanismo', title: 'Il ritorno conserva ciò che cambia.',
      paragraphs: [
        'L’osservazione conserva prodotto, fase, fonte e incertezza. La valutazione riconosce cause, conseguenze e soggetti coinvolti. La differenza utile raggiunge chi può correggere il prodotto, il processo o il sapere del lavoro seguente.',
        'Una stessa esperienza può richiedere ritorni diversi: chi mantiene, chi usa, chi progetta e chi governa possono dover imparare cose diverse. Anche una relazione fra questi soggetti può richiedere una correzione.',
      ],
    },
    {
      id: 'source', label: 'Fonte', title: 'Il sapere dietro RETURN.',
      paragraphs: [
        'La competenza v0.2 è stata esercitata nel Kernel Nautico: un primo attraversamento nel campo Ferretti e un secondo, non identico, sul caso Wheelyboat 123. Le fonti conservano metodo, conseguenze e rientro.',
        'Questo stato riguarda gli esercizi documentati. L’efficacia in un’organizzazione prende forma attraverso l’uso nel suo campo.',
      ],
    },
  ],
  projectionNote: 'L’accesso di poppa è un esempio inventato: illustra un criterio che torna al progetto attraverso una valutazione umana.',
  knowledgeNote: 'La funzione rappresentata è già stata esercitata nel Kernel Nautico. Le fonti ne mostrano il percorso.',
});
