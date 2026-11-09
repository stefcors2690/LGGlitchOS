import type { BackgroundConfig } from '../background.types';
/** Future transparent asset, already decoded by its owner. Never use the background PNG here. */
export interface FlyingVehicleAsset {
  readonly image: CanvasImageSource;
  readonly aspectRatio: number;
}
/** Optional standalone module. Not mounted by the Home until a separate transparent asset is supplied. */
export class FlyingVehicleEngine {
  private elapsed = 0;
  private width = 1;
  private height = 1;
  readonly active: boolean;
  constructor(config: BackgroundConfig['flyingVehicles'], private readonly asset?: FlyingVehicleAsset) {
    this.active = config.enabled && !!asset && Number.isFinite(asset.aspectRatio) && asset.aspectRatio > 0;
  }
  resize(width: number, height: number): void { this.width = Math.max(1, width); this.height = Math.max(1, height); }
  draw(context: CanvasRenderingContext2D, deltaMs: number): void {
    if (!this.active || !this.asset) return;
    // One 18-second distant crossing followed by a 72-second gap. No background extraction.
    this.elapsed = (this.elapsed + Math.max(0, Math.min(100, deltaMs)) / 1000) % 90;
    if (this.elapsed >= 18) return;
    const progress = this.elapsed / 18;
    const width = this.width * .035;
    const height = width / this.asset.aspectRatio;
    context.drawImage(this.asset.image, (-.08 + progress * 1.16) * this.width, this.height * .23, width, height);
  }
}
