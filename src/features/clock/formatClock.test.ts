import { describe, expect, it } from 'vitest';
import { formatClock } from './formatClock';

describe('local clock formatting', () => {
  it('converte la data nel fuso richiesto e mantiene l’istante originale', () => {
    const result = formatClock(new Date('2026-11-09T23:05:00Z'), 'Europe/Rome');
    expect(result.time).toBe('00:05');
    expect(result.date).toContain('10');
    expect(result.date).toContain('nov');
    expect(result.iso).toBe('2026-11-09T23:05:00.000Z');
  });
  it('segue l’ora legale e non inventa un fuso fisso per il dispositivo', () => {
    expect(formatClock(new Date('2026-07-09T12:05:00Z'), 'Europe/Rome').time).toBe('14:05');
    expect(formatClock(new Date('2026-11-09T12:05:00Z'), 'Europe/Rome').time).toBe('13:05');
    const now = new Date();
    expect(formatClock(now).time).toBe(new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now));
  });
});
