import { useEffect, useRef, useState } from 'react';
import type { AppInfo, PlatformAdapter } from '../../platform/contracts';
import { launchApp, loadAppCatalog } from './appActions';
import type { CatalogState } from './appActions';
import './apps.css';

interface AppRailProps { readonly platform: PlatformAdapter; readonly visible: boolean }

export function AppRail({ platform, visible }: AppRailProps) {
  const [catalog, setCatalog] = useState<CatalogState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState('Seleziona un’app · Catalogo demo');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    let active = true;
    void loadAppCatalog(platform).then(result => { if (active) setCatalog(result); });
    return () => { active = false; mounted.current = false; };
  }, [platform]);

  async function activate(app: AppInfo) {
    if (lock.current || catalog?.status !== 'ready' || catalog.launchDisabledReason) return;
    lock.current = true;
    setBusy(true);
    setSelectedId(app.id);
    setMessage(`Avvio demo in corso: ${app.name}…`);
    const feedback = await launchApp(platform, app);
    if (mounted.current) { setMessage(feedback); setBusy(false); }
    lock.current = false;
  }

  const activeId = selectedId ?? (catalog?.status === 'ready' ? catalog.apps[0]?.id : undefined);
  return (
    <section className="apps-section" aria-labelledby="apps-title" hidden={!visible}>
      <h2 className="visually-hidden" id="apps-title">Applicazioni demo</h2>
      {!catalog && <p className="rail-notice" role="status">Caricamento catalogo demo…</p>}
      {catalog?.status === 'error' && <p className="rail-notice" role="alert">{catalog.message}</p>}
      {catalog?.status === 'ready' && <>
        {catalog.apps.length === 0 && <p className="rail-notice">Nessuna applicazione demo disponibile.</p>}
        <div className="app-rail" role="list" aria-label="Catalogo applicazioni demo">
          {catalog.apps.map((app, index) => (
            <div className="app-slot" role="listitem" key={app.id}>
              <button className="app-card" type="button" data-tv-id={`app-${app.id}`} data-tv-zone="rail" aria-label={`${app.name} · Avvio ${app.mode === 'demo' ? 'simulato' : 'applicazione'}`}
                aria-pressed={activeId === app.id} aria-disabled={busy || !!catalog.launchDisabledReason}
                onFocus={() => setSelectedId(app.id)}
                onClick={() => { void activate(app); }}>
                <svg className="app-frame" viewBox="0 0 240 145" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M18 2H222L238 18V127L222 143H18L2 127V18Z" />
                  <path className="app-frame-inner" d="M20 7H220L233 20V125L220 138H20L7 125V20Z" />
                </svg>
                <svg className="app-symbol" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  {index % 3 === 0 ? <><rect x="10" y="13" width="44" height="34" rx="3" /><path d="m27 23 14 8-14 8zM23 54h18" /></>
                    : index % 3 === 1 ? <><path d="M26 43V15l24-5v28M26 23l24-5" /><ellipse cx="18" cy="45" rx="8" ry="6" /><ellipse cx="42" cy="40" rx="8" ry="6" /></>
                    : <><rect x="10" y="10" width="17" height="17" rx="2" /><rect x="37" y="10" width="17" height="17" rx="2" /><rect x="10" y="37" width="17" height="17" rx="2" /><rect x="37" y="37" width="17" height="17" rx="2" /></>}
                </svg>
                <span className="app-name">{app.name.replace(/ demo$/, '')}</span>
                <span className="app-demo">{app.mode === 'demo' ? 'Demo' : 'Dispositivo'}</span>
              </button>
            </div>
          ))}
        </div>
        <p className="rail-feedback" role="status" aria-atomic="true">{catalog.launchDisabledReason ?? message}</p>
      </>}
    </section>
  );
}
