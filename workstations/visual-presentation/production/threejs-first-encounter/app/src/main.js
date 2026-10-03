// Preserve the completed presentation; the receiver is an optional separate seam.
await import('./presentation.js');
const { mountReceiver } = await import('./receiver/panel.js');
mountReceiver(window.KN_FOCUS);
