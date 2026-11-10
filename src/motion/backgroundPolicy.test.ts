import { describe, expect, it } from 'vitest';
import { shouldAnimateBackground } from './backgroundPolicy';

describe('background motion policy', () => {
  it('idle pauses decoration; waking cannot override reduced motion or a hidden page', () => {
    expect(shouldAnimateBackground({ reducedMotion: false, pageVisible: true, userPaused: false, idle: true })).toBe(false);
    expect(shouldAnimateBackground({ reducedMotion: false, pageVisible: true, userPaused: false, idle: false })).toBe(true);
    expect(shouldAnimateBackground({ reducedMotion: true, pageVisible: true, userPaused: false, idle: false })).toBe(false);
    expect(shouldAnimateBackground({ reducedMotion: false, pageVisible: false, userPaused: false, idle: false })).toBe(false);
  });
  for (const reducedMotion of [true, false]) {
    for (const pageVisible of [true, false]) {
      for (const userPaused of [true, false]) {
        it(`motion: reduced=${reducedMotion}, visible=${pageVisible}, paused=${userPaused}`, () => {
          const result = shouldAnimateBackground({ reducedMotion, pageVisible, userPaused });
          if (reducedMotion || !pageVisible || userPaused) expect(result).toBe(false);
          else expect(result).toBe(true);
        });
      }
    }
  }
});
