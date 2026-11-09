import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { backgroundConfig, resolveBackgroundConfig } from '../background.config';
import { isBackgroundDebugEnabled, numericSettings, readNumericSetting, updateBackgroundSetting } from './settingsPolicy';
import type { NumericSetting } from './settingsPolicy';
import { BackgroundSettings } from './BackgroundSettings';
describe('development background controls', () => {
  it('requires explicit opt-in and never permits the production panel', () => {
    for (const search of ['', '?backgroundDebug', '?backgroundDebug=true', '?backgroundDebug=0']) expect(isBackgroundDebugEnabled(true, search)).toBe(false);
    expect(isBackgroundDebugEnabled(true, '?backgroundDebug=1')).toBe(true);
    expect(isBackgroundDebugEnabled(false, '?backgroundDebug=1')).toBe(false);
  });
  it('changes each control independently without mutating source or image geometry', () => {
    const before = JSON.stringify(backgroundConfig);
    for (const key of Object.keys(numericSettings) as NumericSetting[]) {
      const value = numericSettings[key].min;
      const next = updateBackgroundSetting(backgroundConfig, { key, value });
      expect(readNumericSetting(next, key)).toBe(value);
      expect(next.imageSrc).toBe(backgroundConfig.imageSrc); expect(next.hologram.mask).toBe(backgroundConfig.hologram.mask);
    }
    expect(JSON.stringify(backgroundConfig)).toBe(before);
    expect(updateBackgroundSetting(backgroundConfig, { key: 'hologramGlitch', value: false }).hologram.glitch).toBe(false);
  });
  it('rejects non-finite, out-of-range and off-step values without coercing the controls', () => {
    for (const value of [-1, 101, NaN, Infinity, .5]) expect(() => updateBackgroundSetting(backgroundConfig, { key: 'rainIntensity', value })).toThrow(RangeError);
    expect(() => updateBackgroundSetting(backgroundConfig, { key: 'particleCount', value: 201 })).toThrow(RangeError);
    expect(() => updateBackgroundSetting(backgroundConfig, { key: 'rainSpeed', value: .15 })).toThrow(RangeError);
    expect(updateBackgroundSetting(backgroundConfig, { key: 'rainSpeed', value: .3 }).rain.speed).toBe(.3);
  });
  it('retains canonical values through Eco and repeated Cinematic updates', () => {
    let controls = updateBackgroundSetting(backgroundConfig, { key: 'particleCount', value: 60 });
    controls = updateBackgroundSetting(controls, { key: 'profile', value: 'cinematic' });
    expect(resolveBackgroundConfig(controls).particles.count).toBe(120);
    controls = updateBackgroundSetting(controls, { key: 'neonIntensity', value: 50 });
    expect(resolveBackgroundConfig(controls).particles.count).toBe(120);
    controls = updateBackgroundSetting(controls, { key: 'profile', value: 'eco' });
    expect(controls.particles.count).toBe(60); expect(resolveBackgroundConfig(controls).enabled).toBe(false);
    controls = updateBackgroundSetting(controls, { key: 'profile', value: 'balanced' });
    expect(resolveBackgroundConfig(controls).particles.count).toBe(60);
  });
  it('exposes labelled native controls and distinguishes effective limits from requested values', () => {
    const html = renderToStaticMarkup(<BackgroundSettings config={{ ...backgroundConfig, particles: { enabled: true, count: 100 } }} animated error="" onChange={() => {}} onReset={() => {}} onClose={() => {}} />);
    expect(html).toContain('role="dialog"'); expect(html).toContain('aria-modal="false"');
    expect(html).toContain('data-effective-particles="80"'); expect(html).toContain('value="100"');
    for (const key of Object.keys(numericSettings)) expect(html).toContain(`for="background-${key}"`);
    expect(html).toContain('Ripristina valori predefiniti');
  });
});
