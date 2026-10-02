/** Situated illustrative story. No telemetry, inference or company integration. */
export const MODEL = Object.freeze({
  path: './models/yacht.glb',
  sha256: 'ea70c4d14ac31eb90d0dd2aee5a44b2e606ddd71dfd82aed97d82ee195f63d96',
  bytes: 4134868,
  sourceSha256: 'f3272a5c660705b0c4c1a0dca4195a7f60822f0d09d290a1a37ff6fa0677985b',
  identity: 'KN_YACHT',
});
export const ACTS = Object.freeze([
  { id:'FORM', number:'01', duration:10, label:'Dall’intento alla forma',
    title:'Il progetto prende forma.',
    text:'Intenti, fonti e decisioni restano legati allo yacht che sta nascendo.',
    anchor:'INTENTO · ACCESSO A BORDO', eye:[8.5,6.0,13.5] },
  { id:'BUILD', number:'02', duration:10, label:'Dalla forma alla materia',
    title:'Le decisioni diventano materia.',
    text:'La stessa geometria si materializza, senza perdere il filo delle scelte.',
    anchor:'GEOMETRIA · STESSA SCELTA', eye:[8.5,4.4,13.5] },
  { id:'LIVE', number:'03', duration:12, label:'Dalla consegna alla vita',
    title:'La consegna non chiude la storia.',
    text:'La vita a bordo e il servizio aprono nuove occasioni di comprensione.',
    anchor:'ESPERIENZA · STESSO YACHT', eye:[8.5,3.5,13.5] },
  { id:'RETURN', number:'04', duration:14, label:'Dall’esperienza al progetto',
    title:'L’esperienza torna al progetto.',
    text:'Un’osservazione, valutata nel suo contesto, può diventare un nuovo criterio.',
    anchor:'OSSERVAZIONE · ACCESSO DI POPPA', eye:[8.5,5.0,13.5] },
]);
export const RETURN_EXAMPLE = Object.freeze({
  id: 'illustrative-stern-access-01', status: 'illustrative_not_observed',
  sourceAnchor:'stern-access', sourceContext:'same product / use phase / stern access',
  observation:'Un passaggio percepito come poco agevole durante l’uso.',
  qualifier:'Valutazione umana del contesto, delle cause e del responsabile.',
  returnedDifference:'Inserire una verifica dell’accessibilità nelle scelte di progetto successive.',
  destination:'FORM / design-criterion',
  automaticApplication:false, physicalModification:false,
});
