import { useCallback, useRef, useState } from 'react';
import { CyberpunkBackgroundEngine } from '../CyberpunkBackgroundEngine';
import { backgroundConfig } from '../background.config';
import type { BackgroundChange } from './settingsPolicy';
import { updateBackgroundSetting } from './settingsPolicy';
import { BackgroundSettings } from './BackgroundSettings';
import './settings.css';
export default function BackgroundWorkbench({ animated }: { readonly animated: boolean }) {
  const [controls, setControls] = useState(backgroundConfig);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const controlsRef = useRef(controls);
  const change = useCallback((update: BackgroundChange) => {
    try {
      const next = updateBackgroundSetting(controlsRef.current, update);
      controlsRef.current = next; setControls(next); setError('');
    } catch { setError('Valore non valido: configurazione precedente conservata.'); }
  }, []);
  const reset = () => { controlsRef.current = backgroundConfig; setControls(backgroundConfig); setError(''); };
  const close = () => {
    setOpen(false);
    document.querySelector<HTMLElement>('[data-tv-zone="rail"]')?.focus({ preventScroll: true });
  };
  return <>
    <CyberpunkBackgroundEngine config={controls} animated={animated} />
    <div className="background-tools" data-background-tools="true">
      {!open && <button className="background-tools-toggle" onClick={() => setOpen(true)}>Sfondo · debug</button>}
      {open && <BackgroundSettings config={controls} animated={animated} onChange={change} onReset={reset} onClose={close} error={error} />}
    </div>
  </>;
}
