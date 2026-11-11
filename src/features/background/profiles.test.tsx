import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { backgroundConfig, webosBackgroundConfig, resolveBackgroundConfig } from './background.config';
import type { BackgroundConfig, BackgroundProfile } from './background.types';
import { CyberpunkBackgroundEngine } from './CyberpunkBackgroundEngine';
import { RainEngine, getRainBuffer } from './engine/RainEngine';
import { ParticleEngine } from './engine/ParticleEngine';
describe('performance profile resolution', () => {
  it('reduces only TV overlay work, preserving scene, timing and browser calibration', () => {
    const tv = resolveBackgroundConfig(webosBackgroundConfig);
    expect(getRainBuffer(1920, 1080, 1, tv.rendering.maxDpr, tv.rendering.maxWidth, tv.rendering.maxHeight)).toEqual({ width: 1600, height: 900 });
    expect(new RainEngine(tv.rain).count).toBe(179);
    expect(new ParticleEngine(tv.particles).count).toBe(32);
    expect(tv.rendering.targetFps).toBe(30);
    expect(tv.imageSrc).toBe(backgroundConfig.imageSrc);
    expect(tv.neon).toBe(backgroundConfig.neon); expect(tv.fog).toBe(backgroundConfig.fog); expect(tv.hologram).toBe(backgroundConfig.hologram);
    expect(backgroundConfig.rendering.maxWidth).toBe(1920);
    expect(new RainEngine(backgroundConfig.rain).count).toBe(208);
  });
  it('preserves the approved Balanced calibration exactly', () => {
    expect(backgroundConfig.profile).toBe('balanced');
    expect(resolveBackgroundConfig(backgroundConfig)).toEqual(backgroundConfig);
  });
  it('derives bounded Cinematic detail without changing canonical controls or geometry', () => {
    const input = { ...backgroundConfig, profile: 'cinematic' as const };
    const before = JSON.stringify(input); const effective = resolveBackgroundConfig(input);
    expect(new RainEngine(effective.rain).count).toBe(291);
    expect(new ParticleEngine(effective.particles).count).toBe(80);
    expect(effective.neon).toBe(input.neon); expect(effective.hologram).toBe(input.hologram);
    expect(effective.fog).toBe(input.fog); expect(JSON.stringify(input)).toBe(before);
    const saturated = resolveBackgroundConfig({ ...input, rain: { ...input.rain, intensity: 100 }, particles: { enabled: true, count: 200 } });
    expect(saturated.rain.intensity).toBe(100); expect(saturated.particles.count).toBe(200);
  });
  it('Eco keeps original image and scrim while removing all decorative engines', () => {
    const input = { ...backgroundConfig, profile: 'eco' as const };
    const effective = resolveBackgroundConfig(input);
    expect(effective.enabled).toBe(false);
    const html = renderToStaticMarkup(<CyberpunkBackgroundEngine animated config={input} />);
    expect(html).toContain('data-profile="eco"'); expect(html).toContain('data-motion="still"');
    expect(html).toContain('<img'); expect(html).toContain('background-scrim');
    for (const layer of ['<canvas', 'background-fog', 'background-neon', 'background-hologram']) expect(html).not.toContain(layer);
  });
  it('respects custom lower budgets and preserves explicit effect disables/zero across profiles', () => {
    for (const profile of ['cinematic', 'balanced', 'eco'] as const) {
      const input = { ...backgroundConfig, profile, rendering: { maxDpr: .5, maxWidth: 640, maxHeight: 360, targetFps: 10, maxDeltaMs: 70 },
        rain: { ...backgroundConfig.rain, enabled: false, intensity: 0 }, particles: { enabled: false, count: 0 } };
      const config = resolveBackgroundConfig(input);
      expect(config.rendering).toEqual(input.rendering);
      expect(config.rain.enabled).toBe(false); expect(config.rain.intensity).toBe(0);
      expect(config.particles).toEqual(input.particles);
      expect(getRainBuffer(3840, 2160, 3, config.rendering.maxDpr, config.rendering.maxWidth, config.rendering.maxHeight)).toEqual({ width: 640, height: 360 });
    }
  });
  it('caps rendering and particle budgets without enabling manually disabled scenes', () => {
    const config = resolveBackgroundConfig({ ...backgroundConfig, enabled: false, rendering: { ...backgroundConfig.rendering, maxDpr: 2, targetFps: 60 }, particles: { enabled: true, count: 200 } });
    expect(config.enabled).toBe(false); expect(config.rendering.maxDpr).toBe(1); expect(config.rendering.targetFps).toBe(30);
    expect(config.particles.count).toBe(80);
  });
  it('rejects invalid canonical values before applying caps', () => {
    for (const rendering of [{ ...backgroundConfig.rendering, maxWidth: 3840 }, { ...backgroundConfig.rendering, maxHeight: .5 }, { ...backgroundConfig.rendering, maxDpr: NaN }]) {
      expect(() => resolveBackgroundConfig({ ...backgroundConfig, rendering })).toThrow(RangeError);
    }
    expect(() => resolveBackgroundConfig({ ...backgroundConfig, profile: 'unknown' as BackgroundProfile })).toThrow(RangeError);
  });
  it('switching back uses canonical controls so scaling never accumulates', () => {
    const controls: BackgroundConfig = backgroundConfig;
    const first = resolveBackgroundConfig({ ...controls, profile: 'cinematic' });
    resolveBackgroundConfig({ ...controls, profile: 'eco' });
    expect(resolveBackgroundConfig({ ...controls, profile: 'balanced' })).toEqual(controls);
    expect(resolveBackgroundConfig({ ...controls, profile: 'cinematic' })).toEqual(first);
  });
});
