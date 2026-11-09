import { describe, expect, it, vi } from 'vitest';
import { MockPlatformAdapter } from '../../platform/mock/MockPlatformAdapter';
import { setDeviceState, loadDevices } from './deviceActions';

describe('smart-home commands', () => {
  it('loads two demo switches and preserves activation across reads', async () => {
    const platform = new MockPlatformAdapter();
    const initial = await loadDevices(platform);
    expect(initial.status === 'ready' && initial.devices.length).toBe(2);
    expect(await setDeviceState(platform, 'demo-light', true)).toMatchObject({ ok: true, mode: 'demo', data: { on: true } });
    const state = await loadDevices(platform);
    expect(state.status === 'ready' && state.devices.filter(device => device.on).map(device => device.id)).toEqual(['demo-light']);
    expect(await setDeviceState(platform, 'demo-light', false)).toMatchObject({ ok: true, data: { on: false } });
    expect(await setDeviceState(platform, 'demo-socket', true)).toMatchObject({ ok: true, data: { on: true } });
    const updated = await loadDevices(platform);
    expect(updated.status === 'ready' && updated.devices.filter(device => device.on).map(device => device.id)).toEqual(['demo-socket']);
  });
  it('does not read devices when discovery or listing is unsupported', async () => {
    for (const options of [{ failures: { getCapabilities: 'Discovery fallita' } }, { unsupported: { smartHomeList: 'Elenco assente' } }]) {
      const platform = new MockPlatformAdapter(options);
      const list = vi.spyOn(platform.smartHome, 'listDevices');
      expect((await loadDevices(platform)).status).toBe('error');
      expect(list).not.toHaveBeenCalled();
    }
  });
  it('exposes command capability without hiding readable devices', async () => {
    expect(await loadDevices(new MockPlatformAdapter({ unsupported: { smartHomeSetState: 'Cambio assente' } }))).toMatchObject({ status: 'ready', disabledReason: 'Cambio assente' });
  });
  it('distinguishes empty devices, failures and rejected reads', async () => {
    const platform = new MockPlatformAdapter({ failures: { smartHomeList: 'Guasto' } });
    expect(await loadDevices(platform)).toEqual({ status: 'error', message: 'Guasto' });
    const list = vi.spyOn(platform.smartHome, 'listDevices').mockRejectedValue(new Error('offline'));
    expect((await loadDevices(platform)).status).toBe('error');
    list.mockResolvedValue({ ok: true, mode: 'demo', data: [] });
    expect(await loadDevices(platform)).toMatchObject({ status: 'ready', devices: [] });
  });
  it('preserves the device state on errors and unknown IDs', async () => {
    const platform = new MockPlatformAdapter();
    const before = await platform.smartHome.listDevices();
    expect((await setDeviceState(platform, 'missing', true)).ok).toBe(false);
    expect(await platform.smartHome.listDevices()).toEqual(before);
    vi.spyOn(platform.smartHome, 'setState').mockRejectedValue(new Error('offline'));
    expect(await setDeviceState(platform, 'demo-light', true)).toMatchObject({ ok: false, error: { code: 'UNAVAILABLE' } });
    expect(await platform.smartHome.listDevices()).toEqual(before);
    expect((await setDeviceState(new MockPlatformAdapter({ failures: { smartHomeSetState: 'Guasto' } }), 'demo-light', true)).ok).toBe(false);
  });
});
