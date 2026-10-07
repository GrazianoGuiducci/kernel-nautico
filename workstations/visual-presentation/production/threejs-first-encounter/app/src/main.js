// Preserve the completed presentation; the receiver is an optional separate seam.
await import('./presentation.js');
const { mountReceiver } = await import('./receiver/panel.js');
mountReceiver(window.KN_FOCUS);
const { mountProduct } = await import('./product/panel.js');
mountProduct(window.KN_FOCUS);
const { mountCompany } = await import('./company/panel.js');
await mountCompany();

const { mountEncounter } = await import('./encounter/panel.js');
mountEncounter();
const { mountProductNavigation } = await import('./product-navigation.js');
await mountProductNavigation();
const { mountPublicBridge } = await import('./public-bridge.js');
mountPublicBridge();
