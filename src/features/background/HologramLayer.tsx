import { useId } from 'react';
import type { CSSProperties } from 'react';
import type { BackgroundConfig, Size } from './background.types';
import { useBackgroundViewport } from './useBackgroundViewport';
import { getHologramLayout, getHologramPresentation } from './engine/hologramPolicy';
import './hologram.css';

export function HologramLayer({ hologram, imageSrc, imageSize, animated }: {
  readonly hologram: BackgroundConfig['hologram']; readonly imageSrc: string; readonly imageSize: Size | null; readonly animated: boolean;
}) {
  const active = hologram.enabled && imageSize !== null;
  const { rootRef, viewport } = useBackgroundViewport(active);
  const filterId = `hologram-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  if (!active) return null;
  const presentation = getHologramPresentation(hologram);
  const layout = imageSize && viewport ? getHologramLayout(hologram.region, imageSize, viewport) : null;
  const style = layout ? {
    left: layout.box.x, top: layout.box.y, width: layout.box.width, height: layout.box.height,
    clipPath: presentation.clipPath,
    '--hologram-period': `${presentation.periodSeconds}s`,
    '--hologram-shift': `${Math.min(3, layout.box.width * .008)}px`,
    '--hologram-image': `url(${JSON.stringify(imageSrc)})`,
    '--hologram-size': layout.backgroundSize, '--hologram-position': layout.backgroundPosition,
  } as CSSProperties : undefined;
  return <div ref={rootRef} className="background-hologram" aria-hidden="true" data-motion={animated ? 'running' : 'still'} data-glitch={presentation.glitching}>
    <svg className="hologram-filter-defs" width="0" height="0" aria-hidden="true"><defs>
      <filter id={`${filterId}-red`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
      <filter id={`${filterId}-cyan`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" /></filter>
    </defs></svg>
    {layout && <div className="hologram-panel" style={style}>
      <span className="hologram-light" />
      <span className="hologram-lines" />
      <span className="hologram-sweep" />
      {presentation.glitching && <>
        <span className="hologram-copy hologram-rgb hologram-red" style={{ filter: `url(#${filterId}-red)` }} />
        <span className="hologram-copy hologram-rgb hologram-cyan" style={{ filter: `url(#${filterId}-cyan)` }} />
        <span className="hologram-copy hologram-slice hologram-slice-one" />
        <span className="hologram-copy hologram-slice hologram-slice-two" />
      </>}
    </div>}
  </div>;
}
