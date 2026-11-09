/** Regions are relative to the original image, not the cropped viewport. */
export interface Region { readonly x: number; readonly y: number; readonly width: number; readonly height: number }
export interface NeonRegion extends Region {
  readonly id: string;
  readonly color: 'cyan' | 'magenta';
  readonly kind: 'sign' | 'reflection';
}
export interface NormalizedPoint { readonly x: number; readonly y: number }
export interface Size { readonly width: number; readonly height: number }
export type BackgroundProfile = 'cinematic' | 'balanced' | 'eco';
export interface BackgroundConfig {
  readonly enabled: boolean;
  readonly imageSrc: string;
  readonly profile: BackgroundProfile;
  readonly rendering: { readonly maxDpr: number; readonly maxWidth: number; readonly maxHeight: number; readonly targetFps: number; readonly maxDeltaMs: number };
  readonly rain: { readonly enabled: boolean; readonly intensity: number; readonly speed: number; readonly wind: number };
  readonly fog: { readonly enabled: boolean; readonly density: number; readonly speed: number };
  readonly neon: { readonly enabled: boolean; readonly intensity: number; readonly flicker: boolean; readonly regions: readonly NeonRegion[] };
  readonly hologram: { readonly enabled: boolean; readonly glitch: boolean; readonly glitchFrequency: number; readonly region: Region; readonly mask: readonly NormalizedPoint[] };
  readonly particles: { readonly enabled: boolean; readonly count: number };
  readonly flyingVehicles: { readonly enabled: boolean };
}

/** Canvas-only telemetry: wall-clock cadence and CPU submission cost, not GPU/presentation FPS. */
export interface BackgroundPerformanceSample {
  readonly frames: number;
  readonly windowMs: number;
  readonly fps: number;
  readonly averageDrawMs: number;
  readonly maxDrawMs: number;
}
