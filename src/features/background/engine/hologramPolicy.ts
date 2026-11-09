import type { BackgroundConfig, Size } from '../background.types';
import { getCoverTransform, mapRegion } from './coordinates';

export function getHologramPresentation(config: BackgroundConfig['hologram']) {
  return {
    glitching: config.glitch && config.glitchFrequency > 0,
    periodSeconds: config.glitchFrequency > 0 ? Math.max(6, 1 / config.glitchFrequency) : 6,
    clipPath: `polygon(${config.mask.map(point => `${point.x * 100}% ${point.y * 100}%`).join(',')})`,
  };
}
/** All copied image pixels keep the same cover transform as the untouched original. */
export function getHologramLayout(region: BackgroundConfig['hologram']['region'], image: Size, viewport: Size) {
  const cover = getCoverTransform(image, viewport);
  return { box: mapRegion(region, image, viewport),
    backgroundSize: `${cover.width}px ${cover.height}px`,
    backgroundPosition: `${-region.x * cover.width}px ${-region.y * cover.height}px`,
  };
}
