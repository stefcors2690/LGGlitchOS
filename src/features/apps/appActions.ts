import type { AppInfo, PlatformAdapter } from '../../platform/contracts';

export type CatalogState =
  | { readonly status: 'ready'; readonly apps: readonly AppInfo[]; readonly launchDisabledReason?: string }
  | { readonly status: 'error'; readonly message: string };

export async function loadAppCatalog(platform: PlatformAdapter): Promise<CatalogState> {
  try {
    const capabilities = await platform.deviceInfo.getCapabilities();
    if (!capabilities.ok) return { status: 'error', message: capabilities.error.message };
    if (capabilities.data.appCatalog.status === 'unsupported') {
      return { status: 'error', message: capabilities.data.appCatalog.reason };
    }
    const catalog = await platform.appCatalog.list();
    if (!catalog.ok) return { status: 'error', message: catalog.error.message };
    const launch = capabilities.data.appLaunch;
    return { status: 'ready', apps: catalog.data, launchDisabledReason: launch.status === 'unsupported' ? launch.reason : undefined };
  } catch {
    return { status: 'error', message: 'Catalogo non disponibile. Riprova.' };
  }
}

export async function launchApp(platform: PlatformAdapter, app: AppInfo): Promise<string> {
  try {
    const result = await platform.appLauncher.launch(app.id);
    if (!result.ok) return `Avvio non riuscito: ${result.error.message}`;
    return result.mode === 'demo'
      ? `Avvio simulato: ${app.name}. Nessuna applicazione reale aperta.`
      : `Richiesta di avvio inviata: ${app.name}.`;
  } catch {
    return 'Avvio non riuscito: piattaforma non disponibile.';
  }
}
