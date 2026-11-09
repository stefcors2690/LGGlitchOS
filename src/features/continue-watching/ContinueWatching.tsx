import { useState } from 'react';
import { demoWatch, getWatchProgress, simulateResume } from './demoWatch';
import './watch.css';

export function ContinueWatching() {
  const [message, setMessage] = useState('');
  const progress = getWatchProgress(demoWatch);
  return (
    <section className="watch-widget holographic-panel widget-placeholder" aria-labelledby="watch-title">
      <svg className="watch-frame" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
        <path d="M25 3H575L597 23V177L575 197H25L3 177V23Z" fill="#0b1427" fillOpacity=".95" stroke="#385a73" />
        <path d="M28 9H572L590 27V173L572 190H28L10 173V27Z" fill="none" stroke="#4e7790" strokeOpacity=".5" />
        <path className="watch-frame-magenta" d="M340 3H25L3 23V177L25 197H120M23 12H90" />
        <path className="watch-frame-cyan" d="M380 197H575L597 177V23L575 3H545M580 185H530" />
      </svg>
      <h2 id="watch-title" className="watch-heading">
        <svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="16" cy="16" r="13" /><path d="m13 10 9 6-9 6z" /></svg>
        Continua a guardare
        <span className="watch-demo">Demo</span>
      </h2>
      <button className="watch-resume" type="button" data-tv-id="watch-neon-district" data-tv-zone="widgets"
        aria-label={`Riprendi ${demoWatch.title} · Demo${progress ? ` · ${progress.remainingMinutes} minuti rimanenti` : ''}`}
        onClick={() => setMessage(simulateResume(demoWatch))}>
        <span className="watch-artwork" aria-hidden="true" />
        <span className="watch-details">
          <span className="watch-name">{demoWatch.title}</span>
          <span className="watch-remaining">{progress ? `${progress.remainingMinutes} min rimanenti · Demo` : 'Durata demo non disponibile'}</span>
          {progress && <progress className="watch-progress" value={progress.position} max={progress.duration}
            aria-label={`Avanzamento demo di ${demoWatch.title}`} />}
        </span>
      </button>
      <p className="watch-feedback" role="status" aria-atomic="true">{message}</p>
    </section>
  );
}
