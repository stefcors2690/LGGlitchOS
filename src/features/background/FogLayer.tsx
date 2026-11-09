import type { CSSProperties } from 'react';
import type { BackgroundConfig } from './background.types';
import { getFogPresentation } from './engine/fogPolicy';
import './fog.css';

export function FogLayer({ fog, animated }: { readonly fog: BackgroundConfig['fog']; readonly animated: boolean }) {
  const state = getFogPresentation(fog, animated);
  if (!state.visible) return null;
  const style = {
    '--fog-opacity': state.opacity,
    '--fog-near-duration': `${state.nearSeconds}s`,
    '--fog-far-duration': `${state.farSeconds}s`,
  } as CSSProperties;
  return <div className="background-fog" data-motion={state.moving ? 'running' : 'still'} aria-hidden="true" style={style}>
    <span className="fog-veil fog-veil-far" />
    <span className="fog-veil fog-veil-near" />
  </div>;
}
