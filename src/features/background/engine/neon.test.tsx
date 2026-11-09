import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { backgroundConfig, validateBackgroundConfig } from '../background.config';
import { NeonLayer } from '../NeonLayer';
import { mapRegion } from './coordinates';

describe('localized neon regions', () => {
  const neon = backgroundConfig.neon;
  it('defines signs and reflections within the original image and excludes the face', () => {
    expect(neon.enabled).toBe(true); expect(neon.regions.length).toBe(7);
    expect(neon.regions.filter(region => region.kind === 'reflection')).toHaveLength(2);
    expect(neon.regions.every(region => region.x + region.width < .78)).toBe(true);
    expect(() => validateBackgroundConfig(backgroundConfig)).not.toThrow();
  });
  it('rejects duplicate identifiers and regions outside image bounds', () => {
    const first = neon.regions[0]!;
    for (const regions of [[first, first], [{...first,x:.99}], [{...first,id:''}]]) {
      expect(() => validateBackgroundConfig({...backgroundConfig,neon:{...neon,regions}})).toThrow(RangeError);
    }
  });
  it('does not mount when off, at zero intensity, empty, or without a decoded image', () => {
    for (const config of [{...neon,enabled:false},{...neon,intensity:0},{...neon,regions:[]}]) {
      expect(renderToStaticMarkup(<NeonLayer neon={config} imageSize={{width:1672,height:941}} animated />)).toBe('');
    }
    expect(renderToStaticMarkup(<NeonLayer neon={neon} imageSize={null} animated />)).toBe('');
  });
  it('maps each region uniformly across 1080p, 4K and portrait crop', () => {
    for(const region of neon.regions) {
      const full = mapRegion(region,{width:1920,height:1080},{width:1920,height:1080});
      const four = mapRegion(region,{width:1920,height:1080},{width:3840,height:2160});
      expect(four.x).toBeCloseTo(full.x*2); expect(four.width).toBeCloseTo(full.width*2);
      const portrait=mapRegion(region,{width:1920,height:1080},{width:400,height:800});
      expect(portrait.y).toBeCloseTo(region.y*800);
      expect(portrait.width/portrait.height).toBeCloseTo(full.width/full.height);
    }
  });
  it('exposes pause and optional interference independently of rain and fog', () => {
    const html=renderToStaticMarkup(<NeonLayer neon={{...neon,flicker:false}} imageSize={{width:1672,height:941}} animated={false} />);
    expect(html).toContain('data-motion="still"'); expect(html).toContain('data-flicker="false"');
    expect(html).not.toMatch(/<(canvas|button|video)/);
  });
});
