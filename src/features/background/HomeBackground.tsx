import { lazy, Suspense } from 'react';
import { CyberpunkBackgroundEngine } from './CyberpunkBackgroundEngine';
import { isBackgroundDebugEnabled } from './development/settingsPolicy';
import { backgroundConfig, webosBackgroundConfig } from './background.config';
const Workbench = import.meta.env.DEV ? lazy(() => import('./development/BackgroundWorkbench')) : null;
/** Vite removes the development import and panel styles from the ordinary production build. */
export function HomeBackground({ animated, tv = false }: { readonly animated: boolean; readonly tv?: boolean }) {
  if (import.meta.env.DEV && Workbench && typeof window !== 'undefined' && isBackgroundDebugEnabled(true, window.location.search)) {
    return <Suspense fallback={<CyberpunkBackgroundEngine animated={animated} />}><Workbench animated={animated} /></Suspense>;
  }
  return <CyberpunkBackgroundEngine config={tv ? webosBackgroundConfig : backgroundConfig} animated={animated} />;
}
