import type { Capabilities, PlatformAdapter, Result, SystemInfo } from '../contracts';
import type { WebosRuntime } from './runtime';

export const systemInfoTimeoutMs = 8_000;
const reason = 'Funzione TV non ancora disponibile. Apri la modalità Demo.';
const unavailable = <T>(): Promise<Result<T>> => Promise.resolve({ ok: false, mode: 'device', error: { code: 'UNSUPPORTED', message: reason } });
const unsupported = { status: 'unsupported', reason } as const;
const capabilities: Capabilities = {
  appCatalog: unsupported, appLaunch: unsupported, inputList: unsupported,
  inputActivate: unsupported, smartHomeList: unsupported, smartHomeSetState: unsupported,
};

/** Public read only. Catalog/launch/HDMI/home automation deliberately have no transport. */
export class WebosPlatformAdapter implements PlatformAdapter {
  readonly mode = 'device' as const;
  constructor(private readonly runtime: WebosRuntime) {}
  readonly deviceInfo = {
    getCapabilities: async (): Promise<Result<Capabilities>> => ({ ok: true, mode: 'device', data: capabilities }),
    getSystemInfo: (): Promise<Result<SystemInfo>> => new Promise(resolve => {
      let settled = false;
      let request: { cancel(): void } | undefined;
      const failure = (message: string): Result<SystemInfo> => ({ ok: false, mode: 'device', error: { code: 'UNAVAILABLE', message } });
      const cancel = () => { try { request?.cancel(); } catch { /* Cleanup must never prevent settlement. */ } };
      const finish = (result: Result<SystemInfo>) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        cancel();
        resolve(result);
      };
      const timer = setTimeout(() => finish(failure('Il TV non risponde. Riprova.')), systemInfoTimeoutMs);
      try {
        request = this.runtime.service.request('luna://com.webos.service.tv.systemproperty', {
          method: 'getSystemInfo', parameters: { keys: ['modelName', 'firmwareVersion', 'sdkVersion'] }, subscribe: false,
          onSuccess: value => {
            if (!value || typeof value !== 'object' || !('returnValue' in value) || value.returnValue !== true) {
              finish(failure('Risposta del TV non valida. Riprova.')); return;
            }
            const data: Record<string, string> = {};
            for (const key of ['modelName', 'firmwareVersion', 'sdkVersion'] as const) {
              if (key in value) {
                const field = (value as Record<string, unknown>)[key];
                if (typeof field !== 'string' || !field.trim() || field.length > 120 || [...field].some(char => char.charCodeAt(0) < 32)) {
                  finish(failure('Informazioni del TV non valide. Riprova.')); return;
                }
                data[key] = field;
              }
            }
            finish(Object.keys(data).length ? { ok: true, mode: 'device', data } : failure('Informazioni non fornite dal TV. Verifica i consensi LG e riprova.'));
          },
          // Do not expose arbitrary system error payloads or identifiers in the UI/log.
          onFailure: () => finish(failure('Informazioni TV non disponibili. Verifica permessi e consensi LG, poi riprova.')),
        });
        if (settled) cancel(); // Also handles a synchronous SDK callback.
      } catch { finish(failure('Servizio TV non disponibile. Riprova.')); }
    }),
  };
  readonly appCatalog: PlatformAdapter['appCatalog'] = { list: () => unavailable() };
  readonly appLauncher: PlatformAdapter['appLauncher'] = { launch: () => unavailable() };
  readonly inputSource: PlatformAdapter['inputSource'] = { list: () => unavailable(), activate: () => unavailable() };
  readonly smartHome: PlatformAdapter['smartHome'] = { listDevices: () => unavailable(), setState: () => unavailable() };
}
