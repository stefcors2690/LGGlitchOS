import type { SmartHomeDevice, PlatformAdapter, Result } from '../../platform/contracts';

export type DevicesState =
  | { readonly status: 'ready'; readonly devices: readonly SmartHomeDevice[]; readonly disabledReason?: string }
  | { readonly status: 'error'; readonly message: string };

export async function loadDevices(platform: PlatformAdapter): Promise<DevicesState> {
  try {
    const capabilities = await platform.deviceInfo.getCapabilities();
    if (!capabilities.ok) return { status: 'error', message: capabilities.error.message };
    const list = capabilities.data.smartHomeList;
    if (list.status === 'unsupported') return { status: 'error', message: list.reason };
    const result = await platform.smartHome.listDevices();
    if (!result.ok) return { status: 'error', message: result.error.message };
    const activate = capabilities.data.smartHomeSetState;
    return { status: 'ready', devices: result.data, disabledReason: activate.status === 'unsupported' ? activate.reason : undefined };
  } catch {
    return { status: 'error', message: 'Dispositivi non disponibili. Riprova.' };
  }
}

export async function setDeviceState(platform: PlatformAdapter, id: string, on: boolean): Promise<Result<SmartHomeDevice>> {
  try { return await platform.smartHome.setState(id, { on }); }
  catch { return { ok: false, mode: platform.mode, error: { code: 'UNAVAILABLE', message: 'Piattaforma non disponibile.' } }; }
}
