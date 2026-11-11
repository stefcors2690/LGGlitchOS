/** Provenance must be preserved when platform data is shown in the UI. */
export type PlatformMode = 'demo' | 'device';
export type PlatformErrorCode = 'UNSUPPORTED' | 'NOT_FOUND' | 'INVALID_STATE' | 'UNAVAILABLE';

export interface PlatformError {
  readonly code: PlatformErrorCode;
  readonly message: string;
}

export type Result<T> =
  | { readonly ok: true; readonly mode: PlatformMode; readonly data: T }
  | { readonly ok: false; readonly mode: PlatformMode; readonly error: PlatformError };

export type Capability =
  | { readonly status: 'simulated' | 'supported' }
  | { readonly status: 'unsupported'; readonly reason: string };

export interface Capabilities {
  readonly appCatalog: Capability;
  readonly appLaunch: Capability;
  readonly inputList: Capability;
  readonly inputActivate: Capability;
  readonly smartHomeList: Capability;
  readonly smartHomeSetState: Capability;
}

export interface AppInfo {
  readonly id: string;
  readonly name: string;
  readonly mode: PlatformMode;
}

export interface InputInfo {
  readonly id: string;
  readonly name: string;
  readonly kind: 'hdmi' | 'tv';
  readonly active: boolean;
  readonly mode: PlatformMode;
}

/** Initial smart-home scope: binary switches only, no thermostat/blind assumptions. */
export interface SmartHomeDevice {
  readonly id: string;
  readonly name: string;
  readonly kind: 'switch';
  readonly on: boolean;
  readonly mode: PlatformMode;
}

export interface AppCatalog { list(): Promise<Result<readonly AppInfo[]>> }
export interface AppLauncher { launch(appId: string): Promise<Result<{ readonly appId: string }>> }
export interface InputSource {
  list(): Promise<Result<readonly InputInfo[]>>;
  activate(id: string): Promise<Result<InputInfo>>;
}
export interface SystemInfo {
  readonly modelName?: string;
  readonly firmwareVersion?: string;
  readonly sdkVersion?: string;
}
export interface DeviceInfo {
  getCapabilities(): Promise<Result<Capabilities>>;
  getSystemInfo(): Promise<Result<SystemInfo>>;
}
export interface SmartHome {
  listDevices(): Promise<Result<readonly SmartHomeDevice[]>>;
  setState(id: string, state: { readonly on: boolean }): Promise<Result<SmartHomeDevice>>;
}

export interface PlatformAdapter {
  readonly mode: PlatformMode;
  readonly deviceInfo: DeviceInfo;
  readonly appCatalog: AppCatalog;
  readonly appLauncher: AppLauncher;
  readonly inputSource: InputSource;
  readonly smartHome: SmartHome;
}
