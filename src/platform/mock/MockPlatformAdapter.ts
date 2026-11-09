import type {
  AppInfo, Capabilities, InputInfo, PlatformAdapter, PlatformError, Result, SmartHomeDevice,
} from '../contracts';

type CapabilityKey = keyof Capabilities;
export type MockOperation = CapabilityKey | 'getCapabilities';

export interface MockPlatformOptions {
  readonly unsupported?: Partial<Record<CapabilityKey, string>>;
  readonly failures?: Partial<Record<MockOperation, string>>;
}

/** Local-only simulation. Each instance owns its state; no storage, SDK or network. */
export class MockPlatformAdapter implements PlatformAdapter {
  readonly mode = 'demo' as const;
  private readonly options: MockPlatformOptions;
  private readonly apps: AppInfo[] = [
    { id: 'demo-cinema', name: 'Cinema demo', mode: 'demo' },
    { id: 'demo-music', name: 'Musica demo', mode: 'demo' },
    { id: 'demo-video', name: 'Video demo', mode: 'demo' },
    { id: 'demo-games', name: 'Giochi demo', mode: 'demo' },
    { id: 'demo-live', name: 'Dirette demo', mode: 'demo' },
    { id: 'demo-gallery', name: 'Foto demo', mode: 'demo' },
    { id: 'demo-library', name: 'Libreria demo', mode: 'demo' },
  ];
  private inputs: InputInfo[] = [
    { id: 'demo-hdmi-1', name: 'HDMI 1 demo', kind: 'hdmi', active: true, mode: 'demo' },
    { id: 'demo-hdmi-2', name: 'HDMI 2 demo', kind: 'hdmi', active: false, mode: 'demo' },
    { id: 'demo-hdmi-3', name: 'HDMI 3 demo', kind: 'hdmi', active: false, mode: 'demo' },
    { id: 'demo-tv', name: 'TV demo', kind: 'tv', active: false, mode: 'demo' },
  ];
  private devices: SmartHomeDevice[] = [
    { id: 'demo-light', name: 'Luce soggiorno demo', kind: 'switch', on: false, mode: 'demo' },
    { id: 'demo-socket', name: 'Presa demo', kind: 'switch', on: false, mode: 'demo' },
  ];

  constructor(options: MockPlatformOptions = {}) {
    this.options = {
      unsupported: { ...options.unsupported },
      failures: { ...options.failures },
    };
  }

  private success<T>(data: T): Result<T> { return { ok: true, mode: 'demo', data }; }
  private failure<T>(code: PlatformError['code'], message: string): Result<T> {
    return { ok: false, mode: 'demo', error: { code, message } };
  }
  private capability(key: CapabilityKey): Capabilities[CapabilityKey] {
    const reason = this.options.unsupported?.[key];
    return reason !== undefined
      ? { status: 'unsupported', reason }
      : { status: 'simulated' };
  }
  private guard<T>(operation: MockOperation, action: () => Result<T>): Result<T> {
    if (operation !== 'getCapabilities') {
      const capability = this.capability(operation);
      if (capability.status === 'unsupported') {
        return this.failure('UNSUPPORTED', capability.reason);
      }
    }
    const error = this.options.failures?.[operation];
    return error !== undefined ? this.failure('UNAVAILABLE', error) : action();
  }

  readonly deviceInfo = {
    getCapabilities: async (): Promise<Result<Capabilities>> => this.guard('getCapabilities', () =>
      this.success({
        appCatalog: this.capability('appCatalog'),
        appLaunch: this.capability('appLaunch'),
        inputList: this.capability('inputList'),
        inputActivate: this.capability('inputActivate'),
        smartHomeList: this.capability('smartHomeList'),
        smartHomeSetState: this.capability('smartHomeSetState'),
      })),
  };

  readonly appCatalog = {
    list: async (): Promise<Result<readonly AppInfo[]>> => this.guard('appCatalog', () =>
      this.success(this.apps.map(app => ({ ...app })))),
  };

  readonly appLauncher = {
    launch: async (appId: string): Promise<Result<{ readonly appId: string }>> =>
      this.guard('appLaunch', () => this.apps.some(app => app.id === appId)
        ? this.success({ appId })
        : this.failure('NOT_FOUND', 'Applicazione demo non trovata.')),
  };

  readonly inputSource = {
    list: async (): Promise<Result<readonly InputInfo[]>> => this.guard('inputList', () =>
      this.success(this.inputs.map(input => ({ ...input })))),
    activate: async (id: string): Promise<Result<InputInfo>> => this.guard('inputActivate', () => {
      const target = this.inputs.find(input => input.id === id);
      if (!target) return this.failure('NOT_FOUND', 'Ingresso demo non trovato.');
      this.inputs = this.inputs.map(input => ({ ...input, active: input.id === id }));
      return this.success({ ...target, active: true });
    }),
  };

  readonly smartHome = {
    listDevices: async (): Promise<Result<readonly SmartHomeDevice[]>> => this.guard('smartHomeList', () =>
      this.success(this.devices.map(device => ({ ...device })))),
    setState: async (id: string, state: { readonly on: boolean }): Promise<Result<SmartHomeDevice>> =>
      this.guard('smartHomeSetState', () => {
        const target = this.devices.find(device => device.id === id);
        if (!target) return this.failure('NOT_FOUND', 'Dispositivo demo non trovato.');
        if (!state || typeof state.on !== 'boolean') {
          return this.failure('INVALID_STATE', 'Lo stato demo richiede on booleano.');
        }
        const updated = { ...target, on: state.on };
        this.devices = this.devices.map(device => device.id === id ? updated : device);
        return this.success({ ...updated });
      }),
  };
}
