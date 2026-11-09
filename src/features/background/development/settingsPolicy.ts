import type { BackgroundConfig, BackgroundProfile } from '../background.types';
import { validateBackgroundConfig } from '../background.config';
export const numericSettings = {
  rainIntensity: { label: 'Intensità pioggia', min: 0, max: 100, step: 1, unit: '%' },
  rainSpeed: { label: 'Velocità pioggia', min: 0, max: 5, step: .1, unit: '×' },
  fogDensity: { label: 'Densità nebbia', min: 0, max: 100, step: 1, unit: '%' },
  neonIntensity: { label: 'Luminosità neon', min: 0, max: 100, step: 1, unit: '%' },
  particleCount: { label: 'Numero particelle', min: 0, max: 200, step: 1, unit: '' },
} as const;
export type NumericSetting = keyof typeof numericSettings;
export type BackgroundChange = { readonly key: NumericSetting; readonly value: number }
  | { readonly key: 'profile'; readonly value: BackgroundProfile }
  | { readonly key: 'hologramGlitch'; readonly value: boolean };
export function isBackgroundDebugEnabled(development: boolean, search: string): boolean {
  return development && new URLSearchParams(search).get('backgroundDebug') === '1';
}
export function readNumericSetting(config: BackgroundConfig, key: NumericSetting): number {
  switch (key) {
    case 'rainIntensity': return config.rain.intensity;
    case 'rainSpeed': return config.rain.speed;
    case 'fogDensity': return config.fog.density;
    case 'neonIntensity': return config.neon.intensity;
    case 'particleCount': return config.particles.count;
  }
}
/** Reject invalid input, keep canonical controls, never reapply profile multipliers. */
export function updateBackgroundSetting(config: BackgroundConfig, change: BackgroundChange): BackgroundConfig {
  if (change.key in numericSettings) {
    const rule = numericSettings[change.key as NumericSetting];
    const value = change.value;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < rule.min || value > rule.max || Math.abs(value / rule.step - Math.round(value / rule.step)) > 1e-7) throw new RangeError('Valore del controllo non valido.');
  }
  let next: BackgroundConfig;
  switch (change.key) {
    case 'profile': next = { ...config, profile: change.value }; break;
    case 'hologramGlitch': next = { ...config, hologram: { ...config.hologram, glitch: change.value } }; break;
    case 'rainIntensity': next = { ...config, rain: { ...config.rain, intensity: change.value } }; break;
    case 'rainSpeed': next = { ...config, rain: { ...config.rain, speed: change.value } }; break;
    case 'fogDensity': next = { ...config, fog: { ...config.fog, density: change.value } }; break;
    case 'neonIntensity': next = { ...config, neon: { ...config.neon, intensity: change.value } }; break;
    case 'particleCount': next = { ...config, particles: { ...config.particles, count: change.value } }; break;
  }
  validateBackgroundConfig(next);
  return next;
}
