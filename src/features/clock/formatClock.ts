/** Uses the browser timezone by default; explicit timezone is useful for deterministic tests. */
export function formatClock(now: Date, timeZone?: string) {
  return {
    time: new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone }).format(now),
    date: new Intl.DateTimeFormat('it-IT', { weekday: 'short', day: 'numeric', month: 'short', timeZone }).format(now),
    iso: now.toISOString(),
  };
}
