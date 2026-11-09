import { useCallback, useState } from 'react';
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

export function TvShell({ platform }: { readonly platform: PlatformAdapter }) {
  const motion = useBackgroundMotion();
  const returnHome = useCallback(() => {}, []);
  const focusRoot = useTvFocus(returnHome);
  const [dialog, setDialog] = useState<ActionDialogRequest | null>(null);
  // Never replace an open dialog with a late asynchronous result; inline feedback is still retained.
  const showDialog = useCallback((request: ActionDialogRequest) => setDialog(current => current ?? request), []);
  const dismissDialog = useCallback(() => setDialog(null), []);
  return (
    <div ref={focusRoot} className="tv-shell" data-motion-reduced={motion.reducedMotion} data-theme="neon" data-section="home">
      <HomeBackground animated={motion.animated} />
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
      <footer className="shell-footer">
        <p><span className="footer-demo">Preview browser · Demo</span> · Ambiente di sviluppo: nessuna connessione al TV o a servizi esterni.</p>
        <p className="shell-signature" aria-hidden="true">SC / GL1tCh 0S</p>
      </footer>
      {dialog && <ActionDialog request={dialog} onDismiss={dismissDialog} />}
    </div>
  );
}
