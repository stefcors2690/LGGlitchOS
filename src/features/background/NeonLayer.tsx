import type { CSSProperties } from 'react';
import type { BackgroundConfig, Size } from './background.types';
import { useBackgroundViewport } from './useBackgroundViewport';
import { mapRegion } from './engine/coordinates';
import './neon.css';

export function NeonLayer({ neon, imageSize, animated }: { readonly neon: BackgroundConfig['neon']; readonly imageSize: Size | null; readonly animated: boolean }) {
  const active = neon.enabled && neon.intensity > 0 && neon.regions.length > 0 && imageSize !== null;
  const { rootRef, viewport } = useBackgroundViewport(active);
  if (!active) return null;
  return <div ref={rootRef} className="background-neon" aria-hidden="true" data-motion={animated ? 'running' : 'still'} data-flicker={neon.flicker}>
    {viewport && imageSize && neon.regions.map((region, index) => {
      const box = mapRegion(region, imageSize, viewport);
      const style = {
        left: box.x, top: box.y, width: box.width, height: box.height,
        '--neon-opacity': neon.intensity / 100 * (region.kind === 'reflection' ? .28 : .6),
        '--neon-cycle': `${3.6 + index * .72}s`,
        '--neon-delay': `${-index * 2.1}s`,
        '--neon-interference': `${37 + index * 3}s`,
      } as CSSProperties;
      return <div key={region.id} className={`neon-region neon-${region.color} neon-${region.kind}`} data-neon-id={region.id} style={style}>
        <span className="neon-light" />
      </div>;
    })}
  </div>;
}
