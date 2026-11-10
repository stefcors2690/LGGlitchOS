import { useState } from 'react';
import type { AppInfo, PlatformAdapter } from '../../platform/contracts';
import { launchApp, loadAppCatalog } from './appActions';
import { usePlatformResource } from '../../platform/usePlatformResource';
import { ResourceNotice } from '../../components/ResourceNotice';
import type { ActionDialogRequest } from '../../components/ActionDialog';
import './apps.css';

interface AppRailProps { readonly platform: PlatformAdapter; readonly visible: boolean; readonly onDialogRequest?: (request: ActionDialogRequest) => void }

export function AppRail({ platform, visible, onDialogRequest }: AppRailProps) {
  const { state: catalog, busy, reload, runCommand } = usePlatformResource(platform, loadAppCatalog);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const initialMessage = 'Seleziona un’app · Catalogo demo';
  const [feedback, setFeedback] = useState({ platform, text: initialMessage });
  const message = feedback.platform === platform ? feedback.text : initialMessage;
  const setMessage = (text: string) => setFeedback({ platform, text });
  async function activate(app: AppInfo) {
    if (catalog?.status !== 'ready' || catalog.launchDisabledReason !== undefined) return;
    setSelectedId(app.id);
    setMessage(`Avvio demo in corso: ${app.name}…`);
    await runCommand(() => launchApp(platform, app), feedback => {
      setMessage(feedback);
      onDialogRequest?.({ title: app.name, message: feedback, returnFocusId: `app-${app.id}` });
    });
  }

  const activeId = catalog?.status === 'ready' ? catalog.apps.find(app => app.id === selectedId)?.id ?? catalog.apps[0]?.id : undefined;
  return (
    <section className="apps-section" aria-labelledby="apps-title" aria-busy={!catalog || busy} hidden={!visible}>
      <h2 className="visually-hidden" id="apps-title">Applicazioni demo</h2>
      <ResourceNotice id="apps" zone="rail" label="applicazioni demo" loading={!catalog}
        error={catalog?.status === 'error' ? catalog.message : undefined}
        empty={catalog?.status === 'ready' && catalog.apps.length === 0}
        onRetry={() => { setMessage('Seleziona un’app · Catalogo demo'); reload(); }} />
      {catalog?.status === 'ready' && catalog.apps.length > 0 && <>
        <div className="app-rail" role="list" aria-label="Catalogo applicazioni demo">
          {catalog.apps.map((app, index) => (
            <div className="app-slot" role="listitem" key={app.id}>
              <button className="app-card" type="button" data-tv-id={`app-${app.id}`} data-tv-zone="rail" aria-label={`${app.name} · Avvio ${app.mode === 'demo' ? 'simulato' : 'applicazione'}`}
                aria-pressed={activeId === app.id} aria-disabled={busy || catalog.launchDisabledReason !== undefined} aria-describedby="apps-feedback"
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
        <p id="apps-feedback" className="rail-feedback" role="status" aria-atomic="true">{catalog.launchDisabledReason ?? message}</p>
      </>}
    </section>
  );
}
