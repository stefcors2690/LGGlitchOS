import type { PlatformAdapter } from './contracts';
import { usePlatformResource } from './usePlatformResource';

async function load(platform: PlatformAdapter) {
  const result = await platform.deviceInfo.getSystemInfo();
  return result.ok ? { status: 'ready' as const, data: result.data } : { status: 'error' as const, message: result.error.message };
}

export function SystemInfoNotice({ platform }: { readonly platform: PlatformAdapter }) {
  const resource = usePlatformResource(platform, load);
  return <p role="status" aria-atomic="true" data-system-info>
    {!resource.state ? 'Lettura informazioni TV…' : resource.state.status === 'error'
      ? <>{resource.state.message} <button type="button" className="resource-retry" data-tv-id="system-retry" data-tv-zone="settings" onClick={resource.reload}>Riprova informazioni TV</button></>
      : [resource.state.data.modelName, resource.state.data.firmwareVersion && `Firmware ${resource.state.data.firmwareVersion}`, resource.state.data.sdkVersion && `SDK ${resource.state.data.sdkVersion}`].filter(Boolean).join(' · ')}
  </p>;
}
