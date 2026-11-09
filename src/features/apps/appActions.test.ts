import { describe, expect, it, vi } from 'vitest';
import { MockPlatformAdapter } from '../../platform/mock/MockPlatformAdapter';
import { launchApp, loadAppCatalog } from './appActions';

const app = { id: 'demo-cinema', name: 'Cinema demo', mode: 'demo' as const };

describe('catalog and launch flow', () => {
  it('loads demo data and identifies successful launch as simulation', async () => {
    const platform = new MockPlatformAdapter();
    const catalog = await loadAppCatalog(platform);
    expect(catalog.status).toBe('ready');
    if (catalog.status !== 'ready') throw new Error('Catalog unavailable');
    expect(catalog.apps).toContainEqual(app);
    expect(catalog.launchDisabledReason).toBeUndefined();
    expect(await launchApp(platform, app)).toContain('Avvio simulato: Cinema demo');
    expect(await launchApp(platform, app)).toContain('Nessuna applicazione reale aperta');
  });
  it('does not load a catalog when discovery or catalog capability fails', async () => {
    for (const options of [{ failures: { getCapabilities: 'Errore discovery' } }, { unsupported: { appCatalog: 'Catalogo non consentito' } }]) {
      const platform = new MockPlatformAdapter(options);
      const list = vi.spyOn(platform.appCatalog, 'list');
      expect((await loadAppCatalog(platform)).status).toBe('error');
      expect(list).not.toHaveBeenCalled();
    }
  });
  it('keeps catalog readable and exposes the reason when launching is unsupported', async () => {
    const catalog = await loadAppCatalog(new MockPlatformAdapter({ unsupported: { appLaunch: 'Avvio non supportato' } }));
    expect(catalog).toMatchObject({ status: 'ready', launchDisabledReason: 'Avvio non supportato' });
  });
  it('reports catalog errors and rejected promises without fake empty success', async () => {
    const platform = new MockPlatformAdapter({ failures: { appCatalog: 'Catalogo offline' } });
    expect(await loadAppCatalog(platform)).toEqual({ status: 'error', message: 'Catalogo offline' });
    vi.spyOn(platform.appCatalog, 'list').mockRejectedValue(new Error('transport'));
    expect((await loadAppCatalog(platform)).status).toBe('error');
  });
  it('keeps valid empty catalogs distinct from errors', async () => {
    const platform = new MockPlatformAdapter();
    vi.spyOn(platform.appCatalog, 'list').mockResolvedValue({ ok: true, mode: 'demo', data: [] });
    expect(await loadAppCatalog(platform)).toMatchObject({ status: 'ready', apps: [] });
  });
  it('never presents failed or thrown launch calls as success', async () => {
    const platform = new MockPlatformAdapter({ failures: { appLaunch: 'Guasto demo' } });
    expect(await launchApp(platform, app)).toBe('Avvio non riuscito: Guasto demo');
    vi.spyOn(platform.appLauncher, 'launch').mockRejectedValue(new Error('transport'));
    expect(await launchApp(platform, app)).toContain('Avvio non riuscito');
  });
});
