import { useEffect, useState } from 'react';
import { formatClock } from './formatClock';

export function LocalClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const update = () => setNow(new Date());
    const timer = window.setInterval(update, 1000);
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  const clock = formatClock(now);
  return (
    <time className="local-clock" dateTime={clock.iso} aria-label={`Ora locale ${clock.time}, ${clock.date}`}>
      <span className="clock-time">{clock.time}</span>
      <span className="clock-date">{clock.date}</span>
    </time>
  );
}
