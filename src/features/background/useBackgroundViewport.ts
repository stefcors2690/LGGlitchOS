import { useEffect, useRef, useState } from 'react';
import type { Size } from './background.types';

/** Updates only on layout changes; never a per-frame React subscription. */
export function useBackgroundViewport(active: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Size | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !active) return;
    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      setViewport(previous => previous?.width === width && previous.height === height ? previous : { width, height });
    };
    resize();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : undefined;
    observer?.observe(root); window.addEventListener('resize', resize);
    return () => { observer?.disconnect(); window.removeEventListener('resize', resize); };
  }, [active]);
  return { rootRef, viewport };
}
