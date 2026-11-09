import { describe, expect, it, vi } from 'vitest';
import { defaults, parsePreferences, readPreferences, resolveMotion, savePreferences } from './preferences';

describe('global motion preferences', () => {
  it('honors system reduction over all user choices', () => {
    for (const reduced of [false, true]) for (const logo of [false, true]) {
      expect(resolveMotion({ reduced, logo }, true, true)).toEqual({ reduced: true, logoAnimated: false });
    }
  });
  it('reduces globally and independently disables the logo', () => {
    expect(resolveMotion({ reduced: true, logo: true }, false, true).logoAnimated).toBe(false);
    expect(resolveMotion({ reduced: false, logo: false }, false, true)).toEqual({ reduced: false, logoAnimated: false });
    expect(resolveMotion(defaults, false, true).logoAnimated).toBe(true);
    expect(resolveMotion(defaults, false, false).logoAnimated).toBe(false);
  });
  it('validates stored data without coercion', () => {
    for (const value of [null, '{', 'null', '[]', '{"reduced":"false","logo":true}', '{"logo":false}']) expect(parsePreferences(value)).toEqual(defaults);
    expect(parsePreferences('{"reduced":true,"logo":false}')).toEqual({ reduced: true, logo: false });
  });
  it('round trips preferences and handles unavailable storage', () => {
    let stored: string | null = null;
    vi.stubGlobal('window', { localStorage: { getItem: () => stored, setItem: (_key: string, value: string) => { stored = value; } } });
    try {
      expect(savePreferences({ reduced: true, logo: false })).toBe(true);
      expect(readPreferences()).toEqual({ reduced: true, logo: false });
      vi.stubGlobal('window', { get localStorage() { throw new Error('blocked'); } });
      expect(readPreferences()).toEqual(defaults);
      expect(savePreferences(defaults)).toBe(false);
    } finally { vi.unstubAllGlobals(); }
  });
});
