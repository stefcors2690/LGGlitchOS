interface ResourceNoticeProps {
  readonly id: string;
  readonly zone: 'rail' | 'widgets';
  readonly label: string;
  readonly loading: boolean;
  readonly error?: string;
  readonly empty: boolean;
  readonly onRetry: () => void;
}

export function ResourceNotice({ id, zone, label, loading, error, empty, onRetry }: ResourceNoticeProps) {
  const hasError = error !== undefined;
  if (!loading && !hasError && !empty) return null;
  return <div className="resource-notice">
    <p id={`${id}-notice`} role={hasError ? 'alert' : 'status'} aria-atomic="true">
      {loading ? `Caricamento ${label}…` : hasError ? error || 'Funzione non disponibile.' : `Nessun elemento disponibile per ${label}.`}
    </p>
    {!loading && <button className="resource-retry" type="button" data-tv-id={`${id}-retry`} data-tv-zone={zone}
      aria-label={`Riprova · ${label}`} aria-describedby={`${id}-notice`} onClick={onRetry}>Riprova</button>}
  </div>;
}
