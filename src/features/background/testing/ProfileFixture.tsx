/** Vite development fixture only; absent from the ordinary production entry. */
import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CyberpunkBackgroundEngine } from '../CyberpunkBackgroundEngine';
import { backgroundConfig } from '../background.config';
import type { BackgroundPerformanceSample, BackgroundProfile } from '../background.types';
import { useBackgroundMotion } from '../../../motion/useBackgroundMotion';
function publish(sample: BackgroundPerformanceSample) {
  const output = document.getElementById('performance-sample');
  if (output) output.textContent = JSON.stringify(sample);
}
export function ProfileFixture() {
  const [profile, setProfile] = useState<BackgroundProfile>('balanced');
  const [mounted, setMounted] = useState(true);
  const config = useMemo(() => ({ ...backgroundConfig, profile }), [profile]);
  const motion = useBackgroundMotion();
  return <main style={{ position: 'relative', isolation: 'isolate', height: '100vh', overflow: 'hidden' }}>
    {mounted && <CyberpunkBackgroundEngine animated={motion.animated} config={config} onPerformanceSample={publish} />}
    <div style={{ background: '#070c1bee', color: 'white', padding: 16 }}>
      <p>Fixture tecnica — esclusa dalla Home e dalla build ordinaria</p>
      {(['balanced', 'cinematic', 'eco'] as const).map(value => <button id={`profile-${value}`} key={value} onClick={() => setProfile(value)}>{value}</button>)}
      <button id="toggle-engine" onClick={() => setMounted(value => !value)}>Mount/unmount</button>
      <output id="performance-sample" />
    </div>
  </main>;
}
const root = document.getElementById('root');
if (root) createRoot(root).render(<StrictMode><ProfileFixture /></StrictMode>);
