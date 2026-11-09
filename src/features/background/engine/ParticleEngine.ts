import type { BackgroundConfig } from '../background.types';
const STRIDE = 5;
/** Fixed pool: normalized position, depth, light phase and sprite index. */
export class ParticleEngine {
  private readonly particles: Float32Array;
  private width = 1;
  private height = 1;
  private time = 0;
  readonly count: number;
  constructor(config: BackgroundConfig['particles'], random: () => number = Math.random) {
    this.count = config.enabled ? config.count : 0;
    this.particles = new Float32Array(this.count * STRIDE);
    for (let i = 0; i < this.particles.length; i += STRIDE) {
      this.particles[i] = random(); this.particles[i + 1] = random();
      this.particles[i + 2] = random(); this.particles[i + 3] = random() * Math.PI * 2;
      this.particles[i + 4] = random() < .75 ? 0 : 1;
    }
  }
  resize(width: number, height: number): void { this.width = Math.max(1, width); this.height = Math.max(1, height); }
  /** Draw over rain without clearing its buffer; reuse sprites, no per-frame allocations. */
  draw(context: CanvasRenderingContext2D, sprites: readonly HTMLCanvasElement[], deltaMs: number): void {
    const dt = Math.max(0, Math.min(100, deltaMs)) / 1000;
    this.time = (this.time + dt) % (Math.PI * 40);
    const scale = this.height / 1080;
    for (let i = 0; i < this.particles.length; i += STRIDE) {
      const depth = this.particles[i + 2]!;
      let x = this.particles[i]! + (3 + depth * 9) * dt / 1920;
      let y = this.particles[i + 1]! - (2 + depth * 5) * dt / 1080;
      if (x > 1.02) x = -.02;
      if (y < -.02) y = 1.02;
      this.particles[i] = x; this.particles[i + 1] = y;
      const sprite = sprites[this.particles[i + 4]!];
      if (!sprite) continue;
      const size = (7 + depth * 9) * scale;
      // A 25-second breath, never a flash. Sprite has a small core and a broad soft halo.
      context.globalAlpha = (.32 + depth * .3) * (.8 + .2 * Math.sin(this.time * .25 + this.particles[i + 3]!));
      context.drawImage(sprite, x * this.width - size / 2, y * this.height - size / 2, size, size);
    }
    context.globalAlpha = 1;
  }
}
export function createParticleSprites(): readonly HTMLCanvasElement[] {
  return ['125,235,255', '255,105,225'].map(color => {
    const canvas = document.createElement('canvas'); canvas.width = 32; canvas.height = 32;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas particelle non disponibile');
    const glow = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    glow.addColorStop(0, `rgba(${color},1)`); glow.addColorStop(.12, `rgba(${color},.95)`);
    glow.addColorStop(.3, `rgba(${color},.35)`); glow.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = glow; context.fillRect(0, 0, 32, 32);
    return canvas;
  });
}
