import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebosPlatformAdapter, systemInfoTimeoutMs } from './WebosPlatformAdapter';
import { getWebosRuntime } from './runtime';
import type { WebosRuntime } from './runtime';
import { selectPlatform } from '../selectPlatform';
import { mapRemoteKey } from '../../navigation/focusGraph';

function fixture() {
  let callbacks: Parameters<WebosRuntime['service']['request']>[1];
  const cancel = vi.fn();
  const request = vi.fn<WebosRuntime['service']['request']>((_, options) => { callbacks = options; return { cancel }; });
  const runtime: WebosRuntime = { platform: { tv: true }, service: { request }, platformBack: vi.fn() };
  return { runtime, request, cancel, callback: () => callbacks!, adapter: new WebosPlatformAdapter(runtime) };
}
afterEach(() => vi.useRealTimers());

describe('webOS public adapter boundaries', () => {
  it('selects device only with the official TV runtime; explicit Demo always wins', () => {
    const f = fixture();
    expect(getWebosRuntime({})).toBeUndefined();
    expect(getWebosRuntime({ webOS: { ...f.runtime, platform: {} } })).toBeUndefined();
    expect(getWebosRuntime({ webOS: f.runtime })).toBe(f.runtime);
    expect(selectPlatform(undefined).mode).toBe('demo');
    expect(selectPlatform(f.runtime).mode).toBe('device');
    expect(selectPlatform(f.runtime, true).mode).toBe('demo');
    expect(f.request).not.toHaveBeenCalled();
  });
  it('returns only the three requested public fields with device provenance', async () => {
    const f = fixture(); const result = f.adapter.deviceInfo.getSystemInfo();
    expect(f.request).toHaveBeenCalledWith('luna://com.webos.service.tv.systemproperty', expect.objectContaining({
      method: 'getSystemInfo', parameters: { keys: ['modelName', 'firmwareVersion', 'sdkVersion'] }, subscribe: false,
    }));
    f.callback().onSuccess({ returnValue: true, sdkVersion: 'test-sdk', serialNumber: 'must-not-leak' });
    expect(await result).toEqual({ ok: true, mode: 'device', data: { sdkVersion: 'test-sdk' } });
    expect(f.cancel).toHaveBeenCalledOnce();
  });
  it.each([null, {}, { returnValue: false }, { returnValue: true }, { returnValue: true, sdkVersion: 26 }, { returnValue: true, modelName: '' }])('rejects malformed/empty responses %j', async value => {
    const f = fixture(); const result = f.adapter.deviceInfo.getSystemInfo();
    f.callback().onSuccess(value); expect((await result).ok).toBe(false);
  });
  it('handles rejection without leaking platform payload and allows another read', async () => {
    const f = fixture(); const result = f.adapter.deviceInfo.getSystemInfo();
    f.callback().onFailure({ errorText: 'private-payload' });
    expect(JSON.stringify(await result)).not.toContain('private-payload');
    const retry = f.adapter.deviceInfo.getSystemInfo();
    f.callback().onSuccess({ returnValue: true, modelName: 'test-model' });
    expect((await retry).ok).toBe(true);
  });
  it('cancels a stalled request at 8s, ignores late callbacks, and settles even if cancel throws', async () => {
    vi.useFakeTimers(); const f = fixture(); f.cancel.mockImplementation(() => { throw new Error('cancel'); });
    const result = f.adapter.deviceInfo.getSystemInfo(); const late = f.callback();
    await vi.advanceTimersByTimeAsync(systemInfoTimeoutMs);
    expect((await result).ok).toBe(false); expect(f.cancel).toHaveBeenCalledOnce();
    late.onSuccess({ returnValue: true, sdkVersion: 'late' });
    expect((await result).ok).toBe(false); expect(vi.getTimerCount()).toBe(0);
  });
  it('handles synchronous SDK completion and request exceptions without leaked timers', async () => {
    vi.useFakeTimers(); const f = fixture();
    f.request.mockImplementation((_, options) => { options.onSuccess({ returnValue: true, sdkVersion: 'sync' }); return { cancel: f.cancel }; });
    expect((await f.adapter.deviceInfo.getSystemInfo()).ok).toBe(true); expect(f.cancel).toHaveBeenCalledOnce();
    f.request.mockImplementation(() => { throw new Error('bridge unavailable'); });
    expect((await f.adapter.deviceInfo.getSystemInfo()).ok).toBe(false); expect(vi.getTimerCount()).toBe(0);
  });
  it('marks all future integrations unavailable and never sends their commands', async () => {
    const f = fixture(); const capabilities = await f.adapter.deviceInfo.getCapabilities();
    expect(capabilities.ok && Object.values(capabilities.data).every(value => value.status === 'unsupported' && value.reason.length > 0)).toBe(true);
    const results = await Promise.all([f.adapter.appCatalog.list(), f.adapter.appLauncher.launch('x'), f.adapter.inputSource.list(), f.adapter.inputSource.activate('x'), f.adapter.smartHome.listDevices(), f.adapter.smartHome.setState('x', { on: true })]);
    expect(results.every(value => !value.ok && value.mode === 'device' && value.error.code === 'UNSUPPORTED')).toBe(true);
    expect(f.request).not.toHaveBeenCalled();
  });
  it('maps physical Back461 only in the TV app; keeps browser aliases intact', () => {
    expect(mapRemoteKey('Unidentified', 461)).toBeNull();
    expect(mapRemoteKey('Unidentified', 461, true)).toBe('back');
    expect(mapRemoteKey('Escape')).toBe('back');
    expect(mapRemoteKey('Home', 36, true)).toBeNull();
  });
});
