import { useEffect, useRef, useState } from 'react';
import type { SmartHomeDevice, PlatformAdapter } from '../../platform/contracts';
import { setDeviceState, loadDevices } from './deviceActions';
import type { DevicesState } from './deviceActions';
import './smart-home.css';

export function SmartHomeWidget({ platform }: { readonly platform: PlatformAdapter }) {
  const [state, setState] = useState<DevicesState | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const lock = useRef(false);
  const generation = useRef(0);
  useEffect(() => {
    const current = ++generation.current;
    void loadDevices(platform).then(result => { if (generation.current === current) setState(result); });
    return () => { generation.current = current + 1; };
  }, [platform]);

  async function activate(device: SmartHomeDevice) {
    if (lock.current || state?.status !== 'ready' || state.disabledReason !== undefined) return;
    lock.current = true;
    const current = generation.current;
    setBusy(true);
    const result = await setDeviceState(platform, device.id, !device.on);
    if (generation.current === current) {
      if (result.ok) {
        setState(previous => previous?.status === 'ready' ? { ...previous, devices: previous.devices.map(item => item.id === result.data.id ? result.data : item) } : previous);
        setMessage(result.mode === 'demo' ? `Comando simulato: ${result.data.name} ${result.data.on ? "acceso" : "spento"}. Nessun dispositivo reale modificato.` : `Stato aggiornato: ${result.data.name}.`);
      } else setMessage(`Comando non riuscito: ${result.error.message}`);
      setBusy(false);
    }
    lock.current = false;
  }

  return <section className="smart-widget holographic-panel widget-placeholder" aria-labelledby="smart-title">
    <svg className="smart-frame" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
      <path d="M25 3H575L597 23V177L575 197H25L3 177V23Z" fill="#0b1427" fillOpacity=".95" stroke="#385a73" />
      <path d="M28 9H572L590 27V173L572 190H28L10 173V27Z" fill="none" stroke="#4e7790" strokeOpacity=".5" />
      <path className="smart-cyan" d="M25 197 3 177V23L25 3H575L597 23M530 11h35" />
      <path className="smart-magenta" d="M597 145V177L575 197H80M14 40V25L30 11" />
    </svg>
    <h2 id="smart-title" className="smart-heading"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m3 15 13-12 13 12M7 12v17h7V19h5v10h7V12" /></svg>Domotica<span>Demo</span></h2>
    {!state && <p role="status">Caricamento dispositivi demo…</p>}
    {state?.status === 'error' && <p role="alert">{state.message}</p>}
    {state?.status === 'ready' && <>
      {state.devices.length === 0 && <p>Nessun dispositivo disponibile.</p>}
      <div className="device-buttons" aria-label="Dispositivi demo">
        {state.devices.map(device => <button key={device.id} type="button" className="device-button" data-tv-id={`device-${device.id}`} data-tv-zone="widgets"
          aria-label={`${device.name} · ${device.mode === 'demo' ? 'Comando simulato' : 'Interruttore'}`} role="switch" aria-checked={device.on}
          aria-disabled={busy || state.disabledReason !== undefined} onClick={() => { void activate(device); }}>
          <svg viewBox="0 -12 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            {device.id === 'demo-light' ? <path d="M23 27c0-7-9-9-9-18a18 18 0 0 1 36 0c0 9-9 11-9 18M23 29h18M25 34h14M28 39h8M28 27l-3-13 7 4 7-4-3 13" /> : <path d="M32 1v18M20 7a19 19 0 1 0 24 0" />}
          </svg><span>{device.name.replace(/ demo$/, '')}</span><span className="device-state">{device.on ? 'Acceso' : 'Spento'} · Demo</span>
        </button>)}
      </div>
      <p className="device-feedback" role="status" aria-atomic="true">{state.disabledReason ?? message}</p>
    </>}
  </section>;
}
