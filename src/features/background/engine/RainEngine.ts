import type { BackgroundConfig } from '../background.types';
type RainConfig = BackgroundConfig['rain'];
const STRIDE = 5;
/** Fixed pool: normalized x/y, depth, length and velocity. No objects created per frame. */
export class RainEngine {
  private readonly drops: Float32Array;
  private width = 1;
  private height = 1;
  readonly count: number;
  constructor(private readonly config: RainConfig, private readonly random: () => number = Math.random) {
    this.count = config.enabled && config.speed > 0 ? Math.round(config.intensity * 3.2) : 0;
    this.drops = new Float32Array(this.count * STRIDE);
    for (let i = 0; i < this.drops.length; i += STRIDE) {
      this.drops[i] = random(); this.drops[i + 1] = random();
      this.drops[i + 2] = random(); this.drops[i + 3] = 0.65 + random() * 0.7;
      this.drops[i + 4] = 0.8 + random() * 0.4;
    }
  }
  resize(width: number, height: number): void { this.width = Math.max(1, width); this.height = Math.max(1, height); }
  draw(context: CanvasRenderingContext2D, sprites: readonly HTMLCanvasElement[], deltaMs: number): void {
    context.clearRect(0, 0, this.width, this.height);
    const dt = Math.max(0, Math.min(100, deltaMs)) / 1000;
    const scale = this.height / 1080;
    for (let i = 0; i < this.drops.length; i += STRIDE) {
      const depth = this.drops[i + 2]!;
      const velocity = (210 + depth * 390) * this.drops[i + 4]! * this.config.speed;
      let x = this.drops[i]! + this.config.wind * velocity * dt / 1920;
      let y = this.drops[i + 1]! + velocity * dt / 1080;
      if (y > 1.05) { y = -0.05; x = this.random(); }
      if (x > 1.05) x = -0.05;
      if (x < -0.05) x = 1.05;
      this.drops[i] = x; this.drops[i + 1] = y;
      const sprite = sprites[Math.min(2, Math.floor(depth * 3))];
      if (!sprite) continue;
      const length = (18 + depth * 40) * this.drops[i + 3]! * scale;
      context.globalAlpha = 0.28 + depth * 0.4;
      context.drawImage(sprite, x * this.width - length / 6, y * this.height, length / 3, length);
    }
    context.globalAlpha = 1;
  }
}
/** Tapered blue/cyan trails and soft nearby glints, cached once at setup. */
export function createRainSprites(wind: number): readonly HTMLCanvasElement[] {
  return ['#7aa3bc', '#8cbfcf', '#bbe9f0'].map(color => {
    const canvas = document.createElement('canvas'); canvas.width = 32; canvas.height = 96;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas sprite non disponibile');
    const gradient = context.createLinearGradient(0, 0, 0, 96);
    gradient.addColorStop(0, 'transparent'); gradient.addColorStop(0.75, color); gradient.addColorStop(1, 'transparent');
    context.strokeStyle = gradient; context.lineWidth = 3.6; context.lineCap = 'round';
    context.beginPath(); context.moveTo(16 - wind * 12, 1); context.lineTo(16 + wind * 12, 92); context.stroke();
    return canvas;
  });
}
export function getRainBuffer(width: number, height: number, deviceDpr: number, maxDpr: number, maxWidth = 1920, maxHeight = 1080) {
  const ratio = Math.min(Math.max(0.25, deviceDpr || 1), maxDpr, maxWidth / Math.max(1, width), maxHeight / Math.max(1, height));
  return { width: Math.max(1, Math.round(width * ratio)), height: Math.max(1, Math.round(height * ratio)) };
}
