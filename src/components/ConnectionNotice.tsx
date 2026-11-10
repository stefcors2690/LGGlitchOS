import { useSyncExternalStore } from 'react';

function subscribe(notify: () => void) {
  window.addEventListener('offline', notify);
  window.addEventListener('online', notify);
  return () => {
    window.removeEventListener('offline', notify);
    window.removeEventListener('online', notify);
  };
}

export function ConnectionNotice() {
  const offline = useSyncExternalStore(subscribe, () => !navigator.onLine, () => false);
  return <p className="connection-notice" role="status" aria-atomic="true">
    {offline ? 'Rete non disponibile secondo il browser · La Demo locale resta utilizzabile.' : ''}
  </p>;
}
