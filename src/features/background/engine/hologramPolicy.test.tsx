import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HologramLayer } from '../HologramLayer';
import { backgroundConfig, validateBackgroundConfig } from '../background.config';
import { getHologramLayout, getHologramPresentation } from './hologramPolicy';

describe('masked hologram', () => {
  const hologram = backgroundConfig.hologram;
  it('calibrates a narrow face region with an image-relative polygon', () => {
    expect(hologram.enabled).toBe(true); expect(hologram.region.width).toBeLessThan(.15);
    expect(hologram.region.x).toBeGreaterThan(.77);
    expect(getHologramPresentation(hologram).clipPath).toContain('polygon(');
    expect(() => validateBackgroundConfig(backgroundConfig)).not.toThrow();
  });
  it('caps glitch cadence and handles zero frequency without infinities', () => {
    expect(getHologramPresentation(hologram).periodSeconds).toBeCloseTo(1/.15);
    expect(getHologramPresentation({...hologram,glitchFrequency:1}).periodSeconds).toBe(6);
    expect(getHologramPresentation({...hologram,glitchFrequency:0})).toMatchObject({glitching:false,periodSeconds:6});
    expect(getHologramPresentation({...hologram,glitch:false}).glitching).toBe(false);
  });
  it('rejects masks outside normalized bounds and insufficient vertices', () => {
    for(const mask of [[],[{x:0,y:0}],[{x:0,y:0},{x:2,y:0},{x:0,y:1}]]) {
      expect(() => validateBackgroundConfig({...backgroundConfig,hologram:{...hologram,mask}})).toThrow(RangeError);
    }
  });
  it('maps copied pixels to the source at 1080p, 4K and portrait', () => {
    for(const viewport of [{width:1920,height:1080},{width:3840,height:2160},{width:390,height:844}]) {
      const image={width:1920,height:1080};
      const layout=getHologramLayout(hologram.region,image,viewport);
      const scale=Math.max(viewport.width/image.width,viewport.height/image.height);
      expect(layout.backgroundSize).toBe(`${image.width*scale}px ${image.height*scale}px`);
      const [x,y]=layout.backgroundPosition.split(' ').map(value => parseFloat(value));
      expect(x).toBeCloseTo(-hologram.region.x*image.width*scale);
      expect(y).toBeCloseTo(-hologram.region.y*image.height*scale);
      expect(layout.box.width).toBeCloseTo(hologram.region.width*image.width*scale);
    }
  });
  it('does not mount disabled or missing-image effects', () => {
    expect(renderToStaticMarkup(<HologramLayer hologram={{...hologram,enabled:false}} imageSrc="/local.png" imageSize={{width:1920,height:1080}} animated />)).toBe('');
    expect(renderToStaticMarkup(<HologramLayer hologram={hologram} imageSrc="/local.png" imageSize={null} animated />)).toBe('');
  });
  it('marks paused and glitch-free states without interactive content', () => {
    const html=renderToStaticMarkup(<HologramLayer hologram={{...hologram,glitch:false}} imageSrc="/local.png" imageSize={{width:1920,height:1080}} animated={false} />);
    expect(html).toContain('data-motion="still"'); expect(html).toContain('data-glitch="false"');
    expect(html).toContain('aria-hidden="true"'); expect(html).not.toMatch(/<(button|canvas|video)/);
  });
});
