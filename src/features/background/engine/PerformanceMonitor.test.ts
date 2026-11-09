import { describe, expect, it, vi } from 'vitest';
import { PerformanceMonitor } from './PerformanceMonitor';
describe('Canvas sampling', () => {
  it('publishes once per two-second window with actual cadence and draw cost', () => {
    const publish = vi.fn(); const monitor = new PerformanceMonitor(publish);
    monitor.record(0, 999); // Establishes time origin; no completed interval yet.
    for (let frame = 1; frame < 60; frame++) monitor.record(frame * 1000 / 30, 2);
    expect(publish).not.toHaveBeenCalled();
    monitor.record(2000, 4);
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish.mock.calls[0]![0]).toEqual({ frames: 60, windowMs: 2000, fps: 30, averageDrawMs: 122 / 60, maxDrawMs: 4 });
    for (let frame = 1; frame <= 60; frame++) monitor.record(2000 + frame * 1000 / 30, 1);
    expect(publish).toHaveBeenCalledTimes(2);
    expect(publish.mock.calls[1]![0].averageDrawMs).toBe(1);
  });
  it('measures slow real intervals without pretending a capped simulation delta is FPS', () => {
    const publish = vi.fn(); const monitor = new PerformanceMonitor(publish);
    monitor.record(0, 1); monitor.record(4000, 12);
    expect(publish.mock.calls[0]![0]).toEqual({ frames: 1, windowMs: 4000, fps: .25, averageDrawMs: 12, maxDrawMs: 12 });
  });
  it('reset discards paused time and old cost; invalid values never publish', () => {
    const publish = vi.fn(); const monitor = new PerformanceMonitor(publish);
    monitor.record(NaN, 1); monitor.record(1, -1);
    monitor.record(0, 1); monitor.record(500, 2); monitor.reset();
    monitor.record(9000, 1); monitor.record(10000, 3);
    expect(publish).not.toHaveBeenCalled();
    monitor.record(11000, 5);
    expect(publish.mock.calls[0]![0]).toEqual({ frames: 2, windowMs: 2000, fps: 1, averageDrawMs: 4, maxDrawMs: 5 });
    expect(() => new PerformanceMonitor(publish, 0)).toThrow(RangeError);
  });
});
