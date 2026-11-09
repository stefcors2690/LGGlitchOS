import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CyberpunkBackgroundEngine } from './CyberpunkBackgroundEngine';
import { backgroundConfig, isRegion, validateBackgroundConfig } from './background.config';
import { getCoverTransform, mapRegion } from './engine/coordinates';

describe('background configuration and coordinates', () => {
  it('uses local original and balanced with unimplemented effects off', () => {
    expect(backgroundConfig.imageSrc).toContain('background.png');
    expect(backgroundConfig.profile).toBe('balanced');
    expect(backgroundConfig.flyingVehicles.enabled).toBe(false);
    expect(() => validateBackgroundConfig(backgroundConfig)).not.toThrow();
  });
  it('rejects invalid budget and normalized regions', () => {
    expect(() => validateBackgroundConfig({ ...backgroundConfig, rain: { ...backgroundConfig.rain, intensity: NaN } })).toThrow(RangeError);
    expect(() => validateBackgroundConfig({ ...backgroundConfig, rendering: { ...backgroundConfig.rendering, maxDpr: 10 } })).toThrow(RangeError);
    expect(isRegion({ x: 0.9, y: 0, width: 0.3, height: 1 })).toBe(false);
  });
  it('scales uniformly at Full HD and 4K', () => {
    expect(getCoverTransform({ width: 1920, height: 1080 }, { width: 3840, height: 2160 })).toEqual({ scale: 2, width: 3840, height: 2160, x: 0, y: 0 });
    expect(mapRegion({ x: 0.5, y: 0.5, width: 0.1, height: 0.1 }, { width: 1920, height: 1080 }, { width: 1920, height: 1080 })).toEqual({ x: 960, y: 540, width: 192, height: 108 });
  });
  it('includes centered cover crop on portrait resize', () => {
    const transform = getCoverTransform({ width: 1920, height: 1080 }, { width: 400, height: 800 });
    expect(transform.x).toBeLessThan(0); expect(transform.y).toBe(0);
    const mapped = mapRegion({ x: 0.5, y: 0.5, width: 0.1, height: 0.1 }, { width: 1920, height: 1080 }, { width: 400, height: 800 });
    expect(mapped.x).toBeCloseTo(200); expect(mapped.y).toBe(400);
    expect(() => getCoverTransform({ width: 0, height: 1080 }, { width: 400, height: 800 })).toThrow(RangeError);
  });
  it('enabled=false preserves image and does not create Canvas or video', () => {
    const html = renderToStaticMarkup(<CyberpunkBackgroundEngine animated config={{ ...backgroundConfig, enabled: false }} />);
    expect(html).toContain('data-motion="still"'); expect(html).toContain('background-image');
    expect(html).not.toContain('<canvas'); expect(html).not.toContain('<video');
  });
  it('keeps particles independent when rain is off, and removes Canvas when both are off', () => {
    const config = { ...backgroundConfig, rain: { ...backgroundConfig.rain, enabled: false } };
    expect(renderToStaticMarkup(<CyberpunkBackgroundEngine animated config={config} />)).toContain('<canvas');
    expect(renderToStaticMarkup(<CyberpunkBackgroundEngine animated config={{ ...config, particles: { enabled: false, count: 40 } }} />)).not.toContain('<canvas');
  });
  it('reports a missing configured source and keeps gradient fallback', () => {
    const html = renderToStaticMarkup(<CyberpunkBackgroundEngine animated={false} config={{ ...backgroundConfig, imageSrc: '' }} />);
    expect(html).toContain('Sfondo non disponibile'); expect(html).toContain('background-gradient');
    expect(html).not.toContain('<img');
  });
});
