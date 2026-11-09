import imageSrc from '../../../references/background.png?url';
import type { BackgroundConfig, BackgroundProfile, Region } from './background.types';

/** Canonical controls: Balanced preserves the approved calibration. Resolve once at the engine boundary. */
export const backgroundConfig: BackgroundConfig = {
  enabled: true, imageSrc, profile: 'balanced',
  rendering: { maxDpr: 1, maxWidth: 1920, maxHeight: 1080, targetFps: 30, maxDeltaMs: 100 },
  rain: { enabled: true, intensity: 65, speed: 1, wind: 0.15 },
  fog: { enabled: true, density: 65, speed: 0.2 },
  neon: { enabled: true, intensity: 100, flicker: true, regions: [
    { id: 'tower-07', color: 'magenta', kind: 'sign', x: .379, y: .325, width: .047, height: .059 },
    { id: 'left-sign', color: 'magenta', kind: 'sign', x: .298, y: .394, width: .062, height: .043 },
    { id: 'center-sign', color: 'magenta', kind: 'sign', x: .455, y: .441, width: .062, height: .043 },
    { id: 'right-sign', color: 'magenta', kind: 'sign', x: .702, y: .281, width: .072, height: .069 },
    { id: 'cyan-windows', color: 'cyan', kind: 'sign', x: .541, y: .333, width: .025, height: .15 },
    { id: 'cyan-water', color: 'cyan', kind: 'reflection', x: .48, y: .68, width: .10, height: .22 },
    { id: 'magenta-water', color: 'magenta', kind: 'reflection', x: .35, y: .68, width: .09, height: .21 },
  ] },
  hologram: { enabled: true, glitch: true, glitchFrequency: 0.15,
    region: { x: .773, y: .015, width: .11, height: .42 },
    mask: [{ x: .04, y: .12 }, { x: .93, y: 0 }, { x: 1, y: .88 }, { x: .12, y: 1 }],
  },
  particles: { enabled: true, count: 40 },
  flyingVehicles: { enabled: false },
};
const finiteRange = (value: number, min: number, max: number) => Number.isFinite(value) && value >= min && value <= max;
export function isRegion(region: Region): boolean {
  return finiteRange(region.x, 0, 1) && finiteRange(region.y, 0, 1) && finiteRange(region.width, Number.EPSILON, 1) && finiteRange(region.height, Number.EPSILON, 1) && region.x + region.width <= 1 && region.y + region.height <= 1;
}
/** Validate configuration at the boundary, never inside a frame. */
export function validateBackgroundConfig(config: BackgroundConfig): void {
  const valid = ['cinematic', 'balanced', 'eco'].includes(config.profile)
    && finiteRange(config.rendering.maxDpr, 0.25, 2)
    && Number.isInteger(config.rendering.maxWidth) && finiteRange(config.rendering.maxWidth, 1, 1920)
    && Number.isInteger(config.rendering.maxHeight) && finiteRange(config.rendering.maxHeight, 1, 1080)
    && finiteRange(config.rendering.targetFps, 1, 60)
    && finiteRange(config.rendering.maxDeltaMs, 1, 250)
    && finiteRange(config.rain.intensity, 0, 100) && finiteRange(config.rain.speed, 0, 5) && finiteRange(config.rain.wind, -1, 1)
    && finiteRange(config.fog.density, 0, 100) && finiteRange(config.fog.speed, 0, 2)
    && finiteRange(config.neon.intensity, 0, 100) && config.neon.regions.every(region => isRegion(region) && region.id.trim().length > 0 && ['cyan', 'magenta'].includes(region.color) && ['sign', 'reflection'].includes(region.kind))
    && new Set(config.neon.regions.map(region => region.id)).size === config.neon.regions.length
    && isRegion(config.hologram.region) && config.hologram.mask.length >= 3 && config.hologram.mask.length <= 8
    && config.hologram.mask.every(point => finiteRange(point.x, 0, 1) && finiteRange(point.y, 0, 1)) && finiteRange(config.hologram.glitchFrequency, 0, 1)
    && Number.isInteger(config.particles.count) && finiteRange(config.particles.count, 0, 200);
  if (!valid) throw new RangeError('Configurazione background fuori dai limiti.');
}


interface ProfileBudget {
  readonly rainScale: number;
  readonly particleScale: number;
  readonly maxParticles: number;
  readonly maxDpr: number;
  readonly targetFps: number;
  readonly maxWidth: number;
  readonly maxHeight: number;
  readonly static: boolean;
}
/** Hard ceilings, never raise user-supplied rendering budgets. No 4K Canvas profile. */
export const backgroundProfiles: Readonly<Record<BackgroundProfile, ProfileBudget>> = {
  cinematic: { rainScale: 1.4, particleScale: 2, maxParticles: 200, maxDpr: 1, targetFps: 30, maxWidth: 1920, maxHeight: 1080, static: false },
  balanced: { rainScale: 1, particleScale: 1, maxParticles: 80, maxDpr: 1, targetFps: 30, maxWidth: 1920, maxHeight: 1080, static: false },
  eco: { rainScale: 0, particleScale: 0, maxParticles: 0, maxDpr: .75, targetFps: 15, maxWidth: 960, maxHeight: 540, static: true },
};
/** Pure canonical -> effective conversion. Never feed the result back as canonical controls. */
export function resolveBackgroundConfig(config: BackgroundConfig): BackgroundConfig {
  validateBackgroundConfig(config);
  const budget = backgroundProfiles[config.profile];
  return {
    ...config, enabled: config.enabled && !budget.static,
    rendering: { ...config.rendering,
      maxDpr: Math.min(config.rendering.maxDpr, budget.maxDpr),
      maxWidth: Math.min(config.rendering.maxWidth, budget.maxWidth),
      maxHeight: Math.min(config.rendering.maxHeight, budget.maxHeight),
      targetFps: Math.min(config.rendering.targetFps, budget.targetFps),
    },
    rain: { ...config.rain, intensity: Math.min(100, config.rain.intensity * budget.rainScale) },
    particles: { ...config.particles, count: Math.min(budget.maxParticles, Math.round(config.particles.count * budget.particleScale)) },
  };
}
