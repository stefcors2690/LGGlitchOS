import { describe, expect, it, vi } from 'vitest';
import { AnimationController } from './AnimationController';

function fixture(draw = vi.fn()) {
  let next = 0;
  const queue = new Map<number, (time: number) => void>();
  const scheduler = { request: (callback: (time: number) => void) => { queue.set(++next, callback); return next; }, cancel: (id: number) => { queue.delete(id); } };
  const step = (time: number) => { const callbacks = [...queue.values()]; queue.clear(); callbacks.forEach(callback => callback(time)); };
  return { controller: new AnimationController(draw, scheduler), queue, draw, step };
}
describe('animation lifecycle', () => {
  it('keeps the requested cadence on irregular display frames without speeding up simulation', () => {
    const f = fixture(); f.controller.start();
    // A 60 Hz display with small timing variation must not lose the remainder
    // after each draw and fall into a permanent 20–24 draw/s cadence.
    for (let frame = 0; frame <= 600; frame++) f.step(frame * (1000 / 60) + (frame % 3 === 0 ? 0 : 0.4));
    expect(f.draw.mock.calls.length).toBeGreaterThanOrEqual(299);
    expect(f.draw.mock.calls.length).toBeLessThanOrEqual(300);
    const simulated = f.draw.mock.calls.reduce((sum, call) => sum + (call[0] as number), 0);
    expect(simulated).toBeCloseTo(10000, 0);
    expect(f.queue.size).toBe(1);
  });
  it('skips missed deadlines after a long stall instead of issuing catch-up draws', () => {
    const f = fixture(); f.controller.start(); f.step(0); f.step(5000); f.step(5016);
    expect(f.draw).toHaveBeenCalledTimes(1);
    f.step(5034); expect(f.draw).toHaveBeenLastCalledWith(34, 134);
    expect(f.queue.size).toBe(1);
  });
  it('does no work before start and prevents duplicate RAF loops', () => {
    const f = fixture(); expect(f.queue.size).toBe(0);
    f.controller.start(); f.controller.start(); expect(f.queue.size).toBe(1);
    f.step(0); f.step(16); expect(f.draw).not.toHaveBeenCalled();
    f.step(34); expect(f.draw).toHaveBeenCalledWith(34, 34); expect(f.queue.size).toBe(1);
  });
  it('cancels scheduled frames and resumes without counting hidden time', () => {
    const f = fixture(); f.controller.start(); f.step(0); f.step(40);
    f.controller.stop(); expect(f.queue.size).toBe(0);
    f.controller.start(); f.step(9000); f.step(9040);
    expect(f.draw).toHaveBeenLastCalledWith(40, 80);
  });
  it('caps a slow frame delta', () => {
    const f = fixture(); f.controller.start(); f.step(0); f.step(5000);
    expect(f.draw).toHaveBeenCalledWith(100, 100);
  });
  it('dispose is final and idempotent', () => {
    const f = fixture(); f.controller.start(); f.controller.dispose(); f.controller.dispose(); f.controller.start();
    expect(f.queue.size).toBe(0);
  });
  it('stops if a renderer stops itself or throws', () => {
    const f = fixture(); f.draw.mockImplementation(() => f.controller.stop());
    f.controller.start(); f.step(0); f.step(40); expect(f.queue.size).toBe(0);
    const broken = fixture(vi.fn(() => { throw new Error('renderer'); }));
    broken.controller.start(); broken.step(0); expect(() => broken.step(40)).toThrow('renderer');
    expect(broken.queue.size).toBe(0);
  });
  it('rejects invalid timing', () => {
    const scheduler = { request: () => 1, cancel: () => {} };
    expect(() => new AnimationController(() => {}, scheduler, 0)).toThrow(RangeError);
    expect(() => new AnimationController(() => {}, scheduler, 30, NaN)).toThrow(RangeError);
  });
});
