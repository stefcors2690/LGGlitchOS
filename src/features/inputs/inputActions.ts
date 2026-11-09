import type { InputInfo, PlatformAdapter, Result } from '../../platform/contracts';

export type InputsState =
  | { readonly status: 'ready'; readonly inputs: readonly InputInfo[]; readonly disabledReason?: string }
  | { readonly status: 'error'; readonly message: string };

export async function loadInputs(platform: PlatformAdapter): Promise<InputsState> {
  try {
    const capabilities = await platform.deviceInfo.getCapabilities();
    if (!capabilities.ok) return { status: 'error', message: capabilities.error.message };
    const list = capabilities.data.inputList;
    if (list.status === 'unsupported') return { status: 'error', message: list.reason };
    const result = await platform.inputSource.list();
    if (!result.ok) return { status: 'error', message: result.error.message };
    const activate = capabilities.data.inputActivate;
    return { status: 'ready', inputs: result.data, disabledReason: activate.status === 'unsupported' ? activate.reason : undefined };
  } catch {
    return { status: 'error', message: 'Ingressi non disponibili. Riprova.' };
  }
}

export async function activateInput(platform: PlatformAdapter, id: string): Promise<Result<InputInfo>> {
  try { return await platform.inputSource.activate(id); }
  catch { return { ok: false, mode: platform.mode, error: { code: 'UNAVAILABLE', message: 'Piattaforma non disponibile.' } }; }
}
