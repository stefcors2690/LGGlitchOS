import { lazy, Suspense, useCallback, useState } from 'react';
import { ActionDialog } from '../components/ActionDialog';
import type { ActionDialogRequest } from '../components/ActionDialog';
import { useTvFocus } from '../navigation/useTvFocus';
import type { PlatformAdapter } from '../platform/contracts';
import { SmartHomeWidget } from '../features/smart-home/SmartHomeWidget';
import { InputsWidget } from '../features/inputs/InputsWidget';
import { ContinueWatching } from '../features/continue-watching/ContinueWatching';
import { AppRail } from '../features/apps/AppRail';
import { ShellHeader } from './ShellHeader';
import { HomeBackground } from '../features/background/HomeBackground';
import { useBackgroundMotion } from '../motion/useBackgroundMotion';
import { useIdleDimming } from '../motion/useIdleDimming';
import { ConnectionNotice } from '../components/ConnectionNotice';
import { SystemInfoNotice } from '../platform/SystemInfoNotice';

const RemoteSimulator = import.meta.env.DEV ? lazy(() => import('../navigation/development/RemoteSimulator')) : null;

export function TvShell({ platform, onPlatformBack, onModeChange }: { readonly platform: PlatformAdapter; readonly onPlatformBack?: () => void; readonly onModeChange?: () => void }) {
  const idle = useIdleDimming();
  const motion = useBackgroundMotion(idle);
  const returnHome = useCallback(() => { onPlatformBack?.(); }, [onPlatformBack]);
  const focusRoot = useTvFocus(returnHome, !!onPlatformBack);
  const [dialog, setDialog] = useState<ActionDialogRequest | null>(null);
  const [remoteExpanded, setRemoteExpanded] = useState(false);
  const remoteTools = import.meta.env.DEV && RemoteSimulator && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('remoteDebug') === '1'
    ? <Suspense fallback={null}><RemoteSimulator expanded={remoteExpanded} onExpandedChange={setRemoteExpanded} /></Suspense> : null;
  // Never replace an open dialog with a late asynchronous result; inline feedback is still retained.
  const showDialog = useCallback((request: ActionDialogRequest) => setDialog(current => current ?? request), []);
  const dismissDialog = useCallback(() => setDialog(null), []);
  return (
    <div ref={focusRoot} className="tv-shell" data-idle={idle} data-motion-reduced={motion.reducedMotion} data-theme="neon" data-section="home">
      <HomeBackground animated={motion.animated} tv={!!onPlatformBack} />
      <ShellHeader logoAnimated={motion.logoAnimated} />
      <main className="shell-main" id="section-content" aria-labelledby="scene-title">
        <section className="shell-scene clean-scene" aria-labelledby="scene-title">
          <h2 id="scene-title" className="visually-hidden">Home</h2>

        </section>
        <AppRail platform={platform} visible={true} onDialogRequest={showDialog} />
        <div className="shell-widgets">
          <ContinueWatching onDialogRequest={showDialog} />
          <InputsWidget platform={platform} />
          <SmartHomeWidget platform={platform} />
        </div>
      </main>
      <footer className="shell-footer" data-platform-controls={!!onModeChange}>
        <ConnectionNotice />
        {platform.mode === 'device' ? <><p className="footer-demo">TV · webOS · App standalone in prova. Continua a guardare resta Demo.</p><SystemInfoNotice platform={platform} /></>
          : <p><span className="footer-demo">{import.meta.env.MODE === 'webos' ? 'Anteprima TV · Demo' : 'Preview browser · Demo'}</span> · {import.meta.env.MODE === 'webos' ? 'App standalone in prova: dati e comandi simulati.' : 'Ambiente di sviluppo: nessuna connessione al TV o a servizi esterni.'}</p>}
        {onModeChange && <button className="resource-retry" type="button" data-tv-id="platform-mode" data-tv-zone="settings" onClick={onModeChange}>{platform.mode === 'device' ? 'Apri modalità Demo' : 'Torna alla modalità TV'}</button>}
        <p className="shell-signature" aria-hidden="true">SC / GL1tCh 0S</p>
      </footer>
      {dialog ? <ActionDialog request={dialog} onDismiss={dismissDialog} tools={remoteTools} webos={!!onPlatformBack} /> : remoteTools}
    </div>
  );
}
