import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Capabilities, PlatformAdapter, Result } from '../contracts';
import { MockPlatformAdapter } from './MockPlatformAdapter';
import type { MockOperation } from './MockPlatformAdapter';

function data<T>(result: Result<T>): T {
  expect(result.mode).toBe('demo');
  if (!result.ok) throw new Error(result.error.message);
  return result.data;
}

const operations: Record<MockOperation, (adapter: PlatformAdapter) => Promise<Result<unknown>>> = {
  getCapabilities: adapter => adapter.deviceInfo.getCapabilities(),
  appCatalog: adapter => adapter.appCatalog.list(),
  appLaunch: adapter => adapter.appLauncher.launch('demo-cinema'),
  inputList: adapter => adapter.inputSource.list(),
  inputActivate: adapter => adapter.inputSource.activate('demo-hdmi-2'),
  smartHomeList: adapter => adapter.smartHome.listDevices(),
  smartHomeSetState: adapter => adapter.smartHome.setState('demo-light', { on: true }),
};
const capabilityKeys = Object.keys(operations).filter(
  (key): key is keyof Capabilities => key !== 'getCapabilities',
);

afterEach(() => vi.restoreAllMocks());

describe('MockPlatformAdapter', () => {
  it('identifica capability simulate e dati demo senza accedere alla rete', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Rete vietata nel mock'));
    const adapter: PlatformAdapter = new MockPlatformAdapter();
    expect(adapter.mode).toBe('demo');
    const capabilities = data(await adapter.deviceInfo.getCapabilities());
    expect(Object.values(capabilities).every(value => value.status === 'simulated')).toBe(true);
    for (const operation of Object.values(operations)) expect((await operation(adapter)).ok).toBe(true);
    for (const result of [await adapter.appCatalog.list(), await adapter.inputSource.list(), await adapter.smartHome.listDevices()]) {
      expect(data(result).every(item => item.mode === 'demo' && item.name.includes('demo'))).toBe(true);
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it('simula il lancio solo per app del catalogo', async () => {
    const adapter = new MockPlatformAdapter();
    const [app] = data(await adapter.appCatalog.list());
    expect(app).toBeDefined();
    if (!app) throw new Error('Catalogo demo vuoto');
    expect(data(await adapter.appLauncher.launch(app.id))).toEqual({ appId: app.id });
    expect(await adapter.appLauncher.launch('missing')).toMatchObject({ ok: false, error: { code: 'NOT_FOUND' } });
  });

  it('mantiene un solo ingresso attivo e non cambia stato per ID sconosciuti', async () => {
    const adapter = new MockPlatformAdapter();
    data(await adapter.inputSource.activate('demo-hdmi-2'));
    const inputs = data(await adapter.inputSource.list());
    expect(inputs.filter(input => input.active).map(input => input.id)).toEqual(['demo-hdmi-2']);
    expect(await adapter.inputSource.activate('missing')).toMatchObject({ ok: false, error: { code: 'NOT_FOUND' } });
    expect(data(await adapter.inputSource.list())).toEqual(inputs);
  });

  it('aggiorna solo il dispositivo richiesto e rifiuta stati invalidi senza mutazioni', async () => {
    const adapter = new MockPlatformAdapter();
    const before = data(await adapter.smartHome.listDevices());
    expect(data(await adapter.smartHome.setState('demo-light', { on: true })).on).toBe(true);
    const after = data(await adapter.smartHome.listDevices());
    expect(after.find(device => device.id === 'demo-socket')).toEqual(before.find(device => device.id === 'demo-socket'));
    expect(await adapter.smartHome.setState('missing', { on: true })).toMatchObject({ ok: false, error: { code: 'NOT_FOUND' } });
    // Simulate untyped input arriving from a future UI/integration boundary.
    // @ts-expect-error deliberate invalid runtime value
    expect(await adapter.smartHome.setState('demo-light', { on: 'yes' })).toMatchObject({ ok: false, error: { code: 'INVALID_STATE' } });
    expect(data(await adapter.smartHome.listDevices())).toEqual(after);
    expect(data(await adapter.smartHome.setState('demo-light', { on: false })).on).toBe(false);
  });

  it.each(capabilityKeys)('rifiuta %s se non supportata e ne espone il motivo', async key => {
    const adapter = new MockPlatformAdapter({ unsupported: { [key]: 'Non disponibile nello scenario demo' } });
    expect(data(await adapter.deviceInfo.getCapabilities())[key]).toEqual({ status: 'unsupported', reason: 'Non disponibile nello scenario demo' });
    expect(await operations[key](adapter)).toMatchObject({ ok: false, mode: 'demo', error: { code: 'UNSUPPORTED', message: 'Non disponibile nello scenario demo' } });
  });

  it.each(Object.keys(operations) as MockOperation[])('simula un errore operativo per %s', async operation => {
    const adapter = new MockPlatformAdapter({ failures: { [operation]: 'Guasto demo' } });
    expect(await operations[operation](adapter)).toEqual({ ok: false, mode: 'demo', error: { code: 'UNAVAILABLE', message: 'Guasto demo' } });
  });

  it('non muta ingressi e dispositivi quando i comandi falliscono o sono disabilitati', async () => {
    for (const adapter of [
      new MockPlatformAdapter({ failures: { inputActivate: 'Errore demo', smartHomeSetState: 'Errore demo' } }),
      new MockPlatformAdapter({ unsupported: { inputActivate: 'Non supportato', smartHomeSetState: 'Non supportato' } }),
    ]) {
      const inputs = data(await adapter.inputSource.list());
      const devices = data(await adapter.smartHome.listDevices());
      expect((await adapter.inputSource.activate('demo-hdmi-2')).ok).toBe(false);
      expect((await adapter.smartHome.setState('demo-light', { on: true })).ok).toBe(false);
      expect(data(await adapter.inputSource.list())).toEqual(inputs);
      expect(data(await adapter.smartHome.listDevices())).toEqual(devices);
    }
  });

  it('isola istanze, snapshot restituiti e opzioni ricevute', async () => {
    const options = { unsupported: { appLaunch: 'Disabilitato' } };
    const first = new MockPlatformAdapter(options);
    const second = new MockPlatformAdapter();
    options.unsupported.appLaunch = 'Modificato fuori dal mock';
    expect(await first.appLauncher.launch('demo-cinema')).toMatchObject({ error: { message: 'Disabilitato' } });
    const snapshot = data(await first.inputSource.list());
    data(await first.inputSource.activate('demo-hdmi-2'));
    expect(snapshot).toEqual(data(await second.inputSource.list()));
    const device = data(await first.smartHome.setState('demo-light', { on: true }));
    // @ts-expect-error consumers cannot mutate readonly snapshots; runtime protection is by copy
    device.on = false;
    expect(data(await first.smartHome.listDevices()).find(item => item.id === device.id)?.on).toBe(true);
    expect(data(await second.smartHome.listDevices()).every(item => !item.on)).toBe(true);
  });
});
