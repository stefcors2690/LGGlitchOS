import { describe, expect, it } from 'vitest';
import { getDialogReturnId } from './dialogFocus';
import type { DialogReturnTarget } from './dialogFocus';

const targets: readonly DialogReturnTarget[] = [
  { id: 'resume', zone: 'widgets', available: true },
  { id: 'cinema', zone: 'rail', available: true },
  { id: 'music', zone: 'rail', available: true },
];
describe('dialog return focus', () => {
  it.each(['resume', 'cinema', 'music'])('restores the actual invoking control %s', id => {
    expect(getDialogReturnId(targets, id)).toBe(id);
  });
  it('falls back to the first usable app when the origin was removed', () => {
    expect(getDialogReturnId(targets, 'removed')).toBe('cinema');
  });
  it('skips a disabled/hidden origin and disabled fallback', () => {
    const unavailable = targets.map(target => ({ ...target, available: target.id === 'music' }));
    expect(getDialogReturnId(unavailable, 'resume')).toBe('music');
  });
  it('uses a visible widget if no app remains, and nothing if no target remains', () => {
    expect(getDialogReturnId(targets.slice(0, 1), 'removed')).toBe('resume');
    expect(getDialogReturnId([], 'removed')).toBeNull();
    expect(getDialogReturnId(targets.map(target => ({ ...target, available: false })), 'resume')).toBeNull();
  });
});
