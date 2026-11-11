import { useState } from 'react';
import type { SmartHomeDevice, PlatformAdapter } from '../../platform/contracts';
import { setDeviceState, loadDevices } from './deviceActions';
import { usePlatformResource } from '../../platform/usePlatformResource';
import { ResourceNotice } from '../../components/ResourceNotice';
import './smart-home.css';

export function SmartHomeWidget({ platform }: { readonly platform: PlatformAdapter }) {
  const { state, busy, reload, update: setState, runCommand } = usePlatformResource(platform, loadDevices);
  const [feedback, setFeedback] = useState({ platform, text: '' });
  const message = feedback.platform === platform ? feedback.text : '';
  const setMessage = (text: string) => setFeedback({ platform, text });
  async function activate(device: SmartHomeDevice) {
    if (state?.status !== 'ready' || state.disabledReason !== undefined) return;
    await runCommand(() => setDeviceState(platform, device.id, !device.on), result => {
      if (result.ok) {
        setState(previous => previous?.status === 'ready' ? { ...previous, devices: previous.devices.map(item => item.id === result.data.id ? result.data : item) } : previous);
        setMessage(result.mode === 'demo' ? `Comando simulato: ${result.data.name} ${result.data.on ? "acceso" : "spento"}. Nessun dispositivo reale modificato.` : `Stato aggiornato: ${result.data.name}.`);
      } else setMessage(`Comando non riuscito: ${result.error.message}`);
    });
  }

  return <section className="smart-widget holographic-panel widget-placeholder" aria-labelledby="smart-title" aria-busy={!state || busy}>
    <svg className="smart-frame" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
      <path d="M25 3H575L597 23V177L575 197H25L3 177V23Z" fill="#0b1427" fillOpacity=".95" stroke="#385a73" />
      <path d="M28 9H572L590 27V173L572 190H28L10 173V27Z" fill="none" stroke="#4e7790" strokeOpacity=".5" />
      <path className="smart-cyan" d="M25 197 3 177V23L25 3H575L597 23M530 11h35" />
      <path className="smart-magenta" d="M597 145V177L575 197H80M14 40V25L30 11" />
    </svg>
    <h2 id="smart-title" className="smart-heading"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m3 15 13-12 13 12M7 12v17h7V19h5v10h7V12" /></svg>Domotica<span>{platform.mode === 'demo' ? 'Demo' : 'TV'}</span></h2>
    <ResourceNotice id="devices" zone="widgets" label={platform.mode === 'demo' ? 'dispositivi demo' : 'domotica'} loading={!state}
      error={state?.status === 'error' ? state.message : undefined} empty={state?.status === 'ready' && state.devices.length === 0}
      onRetry={() => { setMessage(''); reload(); }} />
    {state?.status === 'ready' && <>
      <div className="device-buttons" aria-label={platform.mode === 'demo' ? 'Dispositivi demo' : 'Dispositivi'}>
        {state.devices.map(device => <button key={device.id} type="button" className="device-button" data-tv-id={`device-${device.id}`} data-tv-zone="widgets"
          aria-label={`${device.name} · ${device.mode === 'demo' ? 'Comando simulato' : 'Interruttore'}`} role="switch" aria-checked={device.on}
          aria-disabled={busy || state.disabledReason !== undefined} aria-describedby="devices-feedback" onClick={() => { void activate(device); }}>
          <svg viewBox="0 -12 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            {device.id === 'demo-light' ? <path d="M23 27c0-7-9-9-9-18a18 18 0 0 1 36 0c0 9-9 11-9 18M23 29h18M25 34h14M28 39h8M28 27l-3-13 7 4 7-4-3 13" /> : <path d="M32 1v18M20 7a19 19 0 1 0 24 0" />}
          </svg><span>{device.name.replace(/ demo$/, '')}</span><span className="device-state">{device.on ? 'Acceso' : 'Spento'} · Demo</span>
        </button>)}
      </div>
      <p id="devices-feedback" className="device-feedback" role="status" aria-atomic="true">{state.disabledReason ?? (busy ? 'Comando in corso…' : message)}</p>
    </>}
  </section>;
}
