export interface FrameScheduler {
  request(callback: (timeMs: number) => void): number;
  cancel(id: number): void;
}
/** Idle until started by an implemented effect. Call stop on hidden/reduced, dispose on unmount. */
export class AnimationController {
  private frame: number | null = null;
  private previous: number | null = null;
  private elapsedMs = 0;
  private running = false;
  private disposed = false;
  constructor(
    private readonly draw: (deltaMs: number, elapsedMs: number) => void,
    private readonly scheduler: FrameScheduler,
    private readonly targetFps = 30,
    private readonly maxDeltaMs = 100,
  ) {
    if (!Number.isFinite(targetFps) || targetFps < 1 || targetFps > 60 || !Number.isFinite(maxDeltaMs) || maxDeltaMs <= 0) throw new RangeError('Timing non valido.');
  }
  private readonly tick = (timeMs: number) => {
    this.frame = null;
    if (!this.running) return;
    if (this.previous === null) this.previous = timeMs;
    const rawDelta = Math.max(0, timeMs - this.previous);
    if (rawDelta >= 1000 / this.targetFps - 0.01) {
      const delta = Math.min(rawDelta, this.maxDeltaMs);
      this.previous = timeMs;
      this.elapsedMs += delta;
      try { this.draw(delta, this.elapsedMs); }
      catch (error) { this.stop(); throw error; }
    }
    if (this.running) this.frame = this.scheduler.request(this.tick);
  };
  start(): void {
    if (this.running || this.disposed) return;
    this.running = true;
    this.previous = null;
    this.frame = this.scheduler.request(this.tick);
  }
  stop(): void {
    this.running = false;
    if (this.frame !== null) this.scheduler.cancel(this.frame);
    this.frame = null;
    this.previous = null;
  }
  dispose(): void { this.stop(); this.disposed = true; }
}
