import { useEffect, useRef } from 'react';
import type { BackgroundConfig, BackgroundProfile } from '../background.types';
import { resolveBackgroundConfig } from '../background.config';
import { numericSettings, readNumericSetting } from './settingsPolicy';
import type { BackgroundChange, NumericSetting } from './settingsPolicy';
interface Props {
  readonly config: BackgroundConfig; readonly animated: boolean; readonly error: string;
  readonly onChange: (change: BackgroundChange) => void;
  readonly onReset: () => void; readonly onClose: () => void;
}
export function BackgroundSettings({ config, animated, error, onChange, onReset, onClose }: Props) {
  const firstControl = useRef<HTMLSelectElement>(null);
  useEffect(() => { firstControl.current?.focus(); }, []);
  const effective = resolveBackgroundConfig(config);
  const rainCount = effective.enabled && effective.rain.enabled && effective.rain.speed > 0 ? Math.round(effective.rain.intensity * 3.2) : 0;
  const particleCount = effective.enabled && effective.particles.enabled ? effective.particles.count : 0;
  return <aside className="background-settings" role="dialog" aria-modal="false" aria-labelledby="background-settings-title"
    onKeyDown={event => {
      if (event.key === 'Escape' || event.key === 'BrowserBack' || event.key === 'GoBack') { event.preventDefault(); event.stopPropagation(); onClose(); }
    }}>
    <header><div><p className="background-settings-kicker">Strumenti di sviluppo</p><h2 id="background-settings-title">Regia dello sfondo</h2></div>
      <button type="button" onClick={onClose} aria-label="Chiudi e torna alla Home">Chiudi</button></header>
    <p className="background-settings-note">Modifiche solo per questa sessione. Tab passa tra i controlli; le frecce regolano il valore.</p>
    <label htmlFor="background-profile">Profilo prestazionale</label>
    <select ref={firstControl} id="background-profile" value={config.profile} onChange={event => onChange({ key: 'profile', value: event.target.value as BackgroundProfile })}>
      <option value="balanced">Balanced</option><option value="cinematic">Cinematic</option><option value="eco">Eco · statico</option>
    </select>
    {(Object.keys(numericSettings) as NumericSetting[]).map(key => {
      const rule = numericSettings[key]; const value = readNumericSetting(config, key);
      return <div className="background-setting" key={key}>
        <label htmlFor={`background-${key}`}>{rule.label}<output htmlFor={`background-${key}`}>{value}{rule.unit}</output></label>
        <input id={`background-${key}`} type="range" min={rule.min} max={rule.max} step={rule.step} value={value}
          onChange={event => onChange({ key, value: event.target.valueAsNumber })} />
      </div>;
    })}
    <label className="background-settings-check"><input id="background-hologramGlitch" type="checkbox" checked={config.hologram.glitch}
      onChange={event => onChange({ key: 'hologramGlitch', value: event.target.checked })} />Glitch ologramma</label>
    <p className="background-settings-effective" data-effective-rain={rainCount} data-effective-particles={particleCount}>
      Effettivi: {rainCount} gocce · {particleCount} particelle. {effective.enabled ? `Canvas ≤ ${effective.rendering.maxWidth}×${effective.rendering.maxHeight}, obiettivo ${effective.rendering.targetFps} fps.` : 'Sfondo statico: nessun Canvas.'}
      {!animated && ' Movimento sospeso dalla policy di sistema/visibilità.'}
    </p>
    <p className="background-settings-note">I profili applicano moltiplicatori e limiti ai valori impostati. Eco conserva i controlli per il ritorno agli altri profili.</p>
    {error && <p role="alert">{error}</p>}
    <button type="button" className="background-settings-reset" onClick={onReset}>Ripristina valori predefiniti</button>
  </aside>;
}
