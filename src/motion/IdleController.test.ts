import { describe, expect, it } from 'vitest';
import { IdleController, idleTimeoutMs } from './IdleController';

function fixture(delay = idleTimeoutMs) {
  let time = 0, sequence = 0, scheduled = 0;
  const timers = new Map<number, { due: number; run: () => void }>();
  const changes: boolean[] = [];
  const clock = { now: () => time, set: (run: () => void, ms: number) => { timers.set(++sequence, { due: time + ms, run }); scheduled++; return sequence; }, clear: (id: number) => { timers.delete(id); } };
  const controller = new IdleController(idle => changes.push(idle), clock, delay);
  const advance = (ms: number) => {
    const end = time + ms;
    while (timers.size) {
      const next = [...timers].sort((a, b) => a[1].due - b[1].due)[0]!;
      if (next[1].due > end) break;
      time = next[1].due; timers.delete(next[0]); next[1].run();
    }
    time = end;
  };
  return { controller, changes, timers, advance, scheduled: () => scheduled };
}

describe('idle deadline and lifecycle', () => {
  it('starts with no timer and expires once after two visible minutes', () => {
    const f = fixture(); expect(f.timers.size).toBe(0);
    f.controller.setVisible(true); f.controller.setVisible(true); expect(f.timers.size).toBe(1);
    f.advance(119999); expect(f.changes).toEqual([]);
    f.advance(1); expect(f.changes).toEqual([true]); expect(f.timers.size).toBe(0);
    f.advance(500000); expect(f.changes).toEqual([true]);
  });
  it('updates the deadline without allocating a timer for each input', () => {
    const f = fixture(); f.controller.setVisible(true); f.advance(60000);
    for (let i = 0; i < 1000; i++) f.controller.activity();
    expect(f.scheduled()).toBe(1); expect(f.changes).toEqual([]);
    f.advance(60000); expect(f.changes).toEqual([]); expect(f.timers.size).toBe(1);
    f.advance(59999); expect(f.changes).toEqual([]);
    f.advance(1); expect(f.changes).toEqual([true]);
  });
  it('wakes immediately and arms one new deadline', () => {
    const f = fixture(); f.controller.setVisible(true); f.advance(120000);
    f.controller.activity(); expect(f.changes).toEqual([true, false]); expect(f.timers.size).toBe(1);
    f.controller.activity(); expect(f.changes).toEqual([true, false]); expect(f.timers.size).toBe(1);
    f.advance(120000); expect(f.changes).toEqual([true, false, true]);
  });
  it('does not count hidden time or hidden input, and grants a fresh visible period', () => {
    const f = fixture(); f.controller.setVisible(true); f.advance(100000); f.controller.setVisible(false);
    expect(f.timers.size).toBe(0); f.advance(500000); f.controller.activity(); expect(f.timers.size).toBe(0);
    f.controller.setVisible(true); f.advance(119999); expect(f.changes).toEqual([]);
    f.advance(1); expect(f.changes).toEqual([true]);
  });
  it('clears an already idle state on return to the page', () => {
    const f = fixture(); f.controller.setVisible(true); f.advance(120000); f.controller.setVisible(false);
    f.controller.setVisible(true); expect(f.changes).toEqual([true, false]); expect(f.timers.size).toBe(1);
  });
  it('disposes a live timer and cannot be restarted or publish after disposal', () => {
    const f = fixture(); f.controller.setVisible(true); f.controller.dispose(); f.controller.dispose();
    f.controller.activity(); f.controller.setVisible(false); f.controller.setVisible(true); f.advance(500000);
    expect(f.timers.size).toBe(0); expect(f.changes).toEqual([]);
  });
  it.each([0, -1, NaN, Infinity])('rejects an invalid delay %s', delay => {
    expect(() => fixture(delay)).toThrow(RangeError);
  });
});
