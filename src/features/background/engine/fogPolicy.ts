import type { BackgroundConfig } from '../background.types';
/** Density is a percent; maximum veil opacity is deliberately bounded for UI contrast. */
export function getFogPresentation(fog: BackgroundConfig['fog'], animated: boolean) {
  return {
    visible: fog.enabled && fog.density > 0,
    opacity: Math.max(0, Math.min(100, fog.density)) / 100 * 0.85,
    moving: animated && fog.speed > 0,
    // speed=1 => 12s/17s half-cycles; default .2 => 60s/85s.
    nearSeconds: fog.speed > 0 ? 12 / fog.speed : 12,
    farSeconds: fog.speed > 0 ? 17 / fog.speed : 17,
  };
}
