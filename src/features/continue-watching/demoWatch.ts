export interface WatchItem {
  readonly id: string;
  readonly title: string;
  readonly durationSeconds: number;
  readonly positionSeconds: number;
  readonly mode: 'demo';
}

/** Fictional content and progress, unrelated to streaming services or viewing history. */
export const demoWatch: WatchItem = {
  id: 'neon-district', title: 'Neon District',
  durationSeconds: 80 * 60, positionSeconds: 38 * 60, mode: 'demo',
};

export function getWatchProgress(item: WatchItem) {
  if (!Number.isFinite(item.durationSeconds) || item.durationSeconds <= 0 || !Number.isFinite(item.positionSeconds)) return null;
  const position = Math.max(0, Math.min(item.positionSeconds, item.durationSeconds));
  return {
    position,
    duration: item.durationSeconds,
    percent: position / item.durationSeconds * 100,
    remainingMinutes: Math.ceil((item.durationSeconds - position) / 60),
  };
}

export function simulateResume(item: WatchItem): string {
  return `Ripresa simulata: ${item.title}. Nessun video avviato.`;
}
