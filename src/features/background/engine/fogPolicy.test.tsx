import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FogLayer } from '../FogLayer';
import { backgroundConfig } from '../background.config';
import { CyberpunkBackgroundEngine } from '../CyberpunkBackgroundEngine';
import { getFogPresentation } from './fogPolicy';

describe('atmospheric fog', () => {
  const fog = backgroundConfig.fog;
  it('caps density and defines slow independent cycles', () => {
    expect(getFogPresentation(fog, true)).toEqual({ visible: true, opacity: 0.5525, moving: true, nearSeconds: 60, farSeconds: 85 });
    expect(getFogPresentation({ ...fog, density: 100 }, true).opacity).toBe(0.85);
  });
  it('does not mount disabled or zero-density effects', () => {
    for (const config of [{ ...fog, enabled: false }, { ...fog, density: 0 }]) {
      expect(renderToStaticMarkup(<FogLayer fog={config} animated />)).toBe('');
    }
    const html = renderToStaticMarkup(<CyberpunkBackgroundEngine config={{ ...backgroundConfig, enabled: false }} animated />);
    expect(html).not.toContain('class="background-fog"');
  });
  it('keeps a still atmosphere when motion is forbidden or speed is zero', () => {
    expect(getFogPresentation(fog, false).moving).toBe(false);
    expect(getFogPresentation({ ...fog, speed: 0 }, true).moving).toBe(false);
    expect(Number.isFinite(getFogPresentation({ ...fog, speed: 0 }, true).nearSeconds)).toBe(true);
    expect(renderToStaticMarkup(<FogLayer fog={fog} animated={false} />)).toContain('data-motion="still"');
  });
  it('has no interactive controls, Canvas, or filter dependence', () => {
    const html = renderToStaticMarkup(<FogLayer fog={fog} animated />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('fog-veil-near'); expect(html).toContain('fog-veil-far');
    expect(html).not.toMatch(/<(canvas|button|video)/);
  });
});
