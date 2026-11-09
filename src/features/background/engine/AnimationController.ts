export interface FrameScheduler {
  request(callback: (timeMs: number) => void): number;
  cancel(id: number): void;
}
/** Idle until started by an implemented effect. Call stop on hidden/reduced, dispose on unmount. */
export class AnimationController {
  private frame: number | null = null;
  private previous: number | null = null;
  private lastDraw: number | null = null;
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
    if (this.previous === null) { this.previous = timeMs; this.lastDraw = timeMs; }
    const rawDelta = Math.max(0, timeMs - this.previous);
    const interval = 1000 / this.targetFps;
    if (rawDelta >= interval - 0.01) {
      // Preserve scheduling remainder; measure simulation from the actual last draw.
      // Skip missed deadlines without bursts or counting the remainder twice.
      const delta = Math.min(Math.max(0, timeMs - this.lastDraw!), this.maxDeltaMs);
      this.previous += Math.max(1, Math.floor((rawDelta + 0.01) / interval)) * interval;
      this.lastDraw = timeMs;
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
    this.lastDraw = null;
    this.frame = this.scheduler.request(this.tick);
  }
  stop(): void {
    this.running = false;
    if (this.frame !== null) this.scheduler.cancel(this.frame);
    this.frame = null;
    this.previous = null;
    this.lastDraw = null;
  }
  dispose(): void { this.stop(); this.disposed = true; }
}
