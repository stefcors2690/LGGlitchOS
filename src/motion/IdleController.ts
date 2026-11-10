export const idleTimeoutMs = 120_000;
export interface IdleClock {
  now(): number;
  set(callback: () => void, delayMs: number): number;
  clear(id: number): void;
}

/** One deadline timer, no polling/RAF. Input updates a timestamp, not React state or a new timer. */
export class IdleController {
  private timer: number | null = null;
  private lastActivity = 0;
  private visible = false;
  private idle = false;
  private disposed = false;
  constructor(private readonly publish: (idle: boolean) => void, private readonly clock: IdleClock, private readonly delayMs = idleTimeoutMs) {
    if (!Number.isFinite(delayMs) || delayMs <= 0) throw new RangeError('Attesa idle non valida.');
  }
  private change(idle: boolean) {
    if (idle === this.idle) return;
    this.idle = idle; this.publish(idle);
  }
  private readonly tick = () => {
    this.timer = null;
    if (this.disposed || !this.visible) return;
    const remaining = this.delayMs - (this.clock.now() - this.lastActivity);
    if (remaining > 0) this.timer = this.clock.set(this.tick, remaining);
    else this.change(true);
  };
  activity(): void {
    if (this.disposed || !this.visible) return;
    this.lastActivity = this.clock.now(); this.change(false);
    if (this.timer === null) this.timer = this.clock.set(this.tick, this.delayMs);
  }
  setVisible(visible: boolean): void {
    if (this.disposed || visible === this.visible) return;
    this.visible = visible;
    if (visible) this.activity();
    else { if (this.timer !== null) this.clock.clear(this.timer); this.timer = null; }
  }
  dispose(): void {
    this.disposed = true;
    if (this.timer !== null) this.clock.clear(this.timer);
    this.timer = null;
  }
}
