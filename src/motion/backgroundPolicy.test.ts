import { describe, expect, it } from 'vitest';
import { shouldAnimateBackground } from './backgroundPolicy';

describe('background motion policy', () => {
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
