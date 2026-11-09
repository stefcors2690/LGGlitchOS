import { useCallback, useMemo, useState } from 'react';
import { HologramLayer } from './HologramLayer';
import { NeonLayer } from './NeonLayer';
import { FogLayer } from './FogLayer';
import { BackgroundCanvas } from './BackgroundCanvas';
import { BackgroundImage } from './BackgroundImage';
import { backgroundConfig, resolveBackgroundConfig } from './background.config';
import type { BackgroundConfig, BackgroundPerformanceSample, Size } from './background.types';
import './background.css';

interface BackgroundEngineProps { readonly config?: BackgroundConfig; readonly animated: boolean; readonly onPerformanceSample?: (sample: BackgroundPerformanceSample) => void }
/** Static original plus independent decorative effects; React is never updated per frame. */
export function CyberpunkBackgroundEngine({ config: controls = backgroundConfig, animated, onPerformanceSample }: BackgroundEngineProps) {
  const config = useMemo(() => resolveBackgroundConfig(controls), [controls]);
  const [image, setImage] = useState<(Size & { readonly src: string }) | null>(null);
  const onDimensions = useCallback((size: Size | null) => { setImage(size ? { ...size, src: config.imageSrc } : null); }, [config.imageSrc]);
  const imageSize = image?.src === config.imageSrc ? image : null;
  return <>
    <div className="cyberpunk-background" data-motion={config.enabled && animated ? 'allowed' : 'still'}
      data-renderer={config.enabled && (config.rain.enabled || config.particles.enabled) && animated ? 'canvas' : 'static'} data-profile={config.profile} aria-hidden="true">
      <div className="background-gradient" />
    </div>
    <div className="background-image-layer"><BackgroundImage key={config.imageSrc} src={config.imageSrc} onDimensions={onDimensions} /></div>
    <div className="background-scrim" aria-hidden="true" />
    {config.enabled && <NeonLayer neon={config.neon} imageSize={imageSize} animated={animated} />}
    {config.enabled && <HologramLayer hologram={config.hologram} imageSrc={config.imageSrc} imageSize={imageSize} animated={animated} />}
    {config.enabled && (config.rain.enabled || config.particles.enabled) && <BackgroundCanvas config={config} animated={animated} onPerformanceSample={onPerformanceSample} />}
    {config.enabled && <FogLayer fog={config.fog} animated={animated} />}
  </>;
}
