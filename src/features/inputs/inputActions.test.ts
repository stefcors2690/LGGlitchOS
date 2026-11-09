import { describe, expect, it, vi } from 'vitest';
import { MockPlatformAdapter } from '../../platform/mock/MockPlatformAdapter';
import { activateInput, loadInputs } from './inputActions';

describe('input selection', () => {
  it('loads four demo sources and preserves activation across reads', async () => {
    const platform = new MockPlatformAdapter();
    const initial = await loadInputs(platform);
    expect(initial.status === 'ready' && initial.inputs.length).toBe(4);
    expect(await activateInput(platform, 'demo-hdmi-3')).toMatchObject({ ok: true, mode: 'demo', data: { active: true } });
    const state = await loadInputs(platform);
    expect(state.status === 'ready' && state.inputs.filter(input => input.active).map(input => input.id)).toEqual(['demo-hdmi-3']);
  });
  it('does not read sources when discovery or listing is unsupported', async () => {
    for (const options of [{ failures: { getCapabilities: 'Discovery fallita' } }, { unsupported: { inputList: 'Elenco assente' } }]) {
      const platform = new MockPlatformAdapter(options);
      const list = vi.spyOn(platform.inputSource, 'list');
      expect((await loadInputs(platform)).status).toBe('error');
      expect(list).not.toHaveBeenCalled();
    }
  });
  it('exposes activation capability without hiding readable sources', async () => {
    expect(await loadInputs(new MockPlatformAdapter({ unsupported: { inputActivate: 'Cambio assente' } }))).toMatchObject({ status: 'ready', disabledReason: 'Cambio assente' });
  });
  it('distinguishes empty sources, failures and rejected reads', async () => {
    const platform = new MockPlatformAdapter({ failures: { inputList: 'Guasto' } });
    expect(await loadInputs(platform)).toEqual({ status: 'error', message: 'Guasto' });
    const list = vi.spyOn(platform.inputSource, 'list').mockRejectedValue(new Error('offline'));
    expect((await loadInputs(platform)).status).toBe('error');
    list.mockResolvedValue({ ok: true, mode: 'demo', data: [] });
    expect(await loadInputs(platform)).toMatchObject({ status: 'ready', inputs: [] });
  });
  it('preserves the active source on errors and unknown IDs', async () => {
    const platform = new MockPlatformAdapter();
    const before = await platform.inputSource.list();
    expect((await activateInput(platform, 'missing')).ok).toBe(false);
    expect(await platform.inputSource.list()).toEqual(before);
    vi.spyOn(platform.inputSource, 'activate').mockRejectedValue(new Error('offline'));
    expect(await activateInput(platform, 'demo-tv')).toMatchObject({ ok: false, error: { code: 'UNAVAILABLE' } });
    expect(await platform.inputSource.list()).toEqual(before);
    expect((await activateInput(new MockPlatformAdapter({ failures: { inputActivate: 'Guasto' } }), 'demo-tv')).ok).toBe(false);
  });
});
