import type { BackgroundPerformanceSample } from '../background.types';
/** Uses actual wall-clock draw timestamps, never the clamped simulation delta. No extra RAF/timer. */
export class PerformanceMonitor {
  private start: number | null = null;
  private frames = 0;
  private totalDrawMs = 0;
  private peakDrawMs = 0;
  constructor(private readonly publish: (sample: BackgroundPerformanceSample) => void, private readonly windowMs = 2000) {
    if (!Number.isFinite(windowMs) || windowMs < 500) throw new RangeError('Finestra monitor non valida.');
  }
  record(timeMs: number, drawMs: number): void {
    if (!Number.isFinite(timeMs) || !Number.isFinite(drawMs) || drawMs < 0) return;
    if (this.start === null || timeMs < this.start) { this.reset(); this.start = timeMs; return; }
    this.frames++;
    this.totalDrawMs += drawMs;
    this.peakDrawMs = Math.max(this.peakDrawMs, drawMs);
    const elapsed = timeMs - this.start;
    if (elapsed < this.windowMs) return;
    this.publish({ frames: this.frames, windowMs: elapsed, fps: this.frames * 1000 / elapsed,
      averageDrawMs: this.totalDrawMs / this.frames, maxDrawMs: this.peakDrawMs });
    this.reset(); this.start = timeMs;
  }
  reset(): void { this.start = null; this.frames = 0; this.totalDrawMs = 0; this.peakDrawMs = 0; }
}
