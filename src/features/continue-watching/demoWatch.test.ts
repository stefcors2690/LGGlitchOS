import { describe, expect, it } from 'vitest';
import { demoWatch, getWatchProgress, simulateResume } from './demoWatch';

describe('demo continue watching', () => {
  it('labels fictional progress and computes remaining time', () => {
    expect(demoWatch.mode).toBe('demo');
    expect(getWatchProgress(demoWatch)).toMatchObject({ percent: 47.5, remainingMinutes: 42 });
  });
  it('clamps positions outside the title duration', () => {
    expect(getWatchProgress({ ...demoWatch, positionSeconds: -10 })?.percent).toBe(0);
    expect(getWatchProgress({ ...demoWatch, positionSeconds: 90000 })).toMatchObject({ percent: 100, remainingMinutes: 0 });
  });
  it('rejects unknown/invalid duration and progress instead of rendering NaN', () => {
    for (const durationSeconds of [0, -1, NaN, Infinity]) expect(getWatchProgress({ ...demoWatch, durationSeconds })).toBeNull();
    expect(getWatchProgress({ ...demoWatch, positionSeconds: NaN })).toBeNull();
  });
  it('reports simulation without changing progress or claiming video playback', () => {
    const before = { ...demoWatch };
    expect(simulateResume(demoWatch)).toContain('Ripresa simulata');
    expect(simulateResume(demoWatch)).toContain('Nessun video avviato');
    expect(demoWatch).toEqual(before);
  });
});
