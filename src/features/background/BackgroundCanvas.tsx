import { useEffect, useRef } from 'react';
import type { BackgroundConfig, BackgroundPerformanceSample } from './background.types';
import { PerformanceMonitor } from './engine/PerformanceMonitor';
import { AnimationController } from './engine/AnimationController';
import { createParticleSprites, ParticleEngine } from './engine/ParticleEngine';
import { createRainSprites, getRainBuffer, RainEngine } from './engine/RainEngine';

export function BackgroundCanvas({ config, animated, onPerformanceSample }: { readonly config: BackgroundConfig; readonly animated: boolean; readonly onPerformanceSample?: (sample: BackgroundPerformanceSample) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.dataset.state = 'static';
    delete canvas.dataset.fps; delete canvas.dataset.averageDrawMs; delete canvas.dataset.maxDrawMs;
    const rain = new RainEngine(config.rain);
    const particles = new ParticleEngine(config.particles);
    canvas.dataset.rainCount = String(rain.count);
    canvas.dataset.particleCount = String(particles.count);
    if (!animated || !config.enabled || (rain.count === 0 && particles.count === 0)) return;
    let controller: AnimationController | undefined;
    let observer: ResizeObserver | undefined;
    let disposed = false;
    let frames = 0;
    let context: CanvasRenderingContext2D | null = null;
    let sprites: readonly HTMLCanvasElement[] = [];
    let particleSprites: readonly HTMLCanvasElement[] = [];
    const fail = () => { cleanup(); canvas.dataset.state = 'unavailable'; };
    const resize = () => {
      if (disposed) return;
      const box = canvas.getBoundingClientRect();
      const size = getRainBuffer(box.width, box.height, window.devicePixelRatio, config.rendering.maxDpr, config.rendering.maxWidth, config.rendering.maxHeight);
      if (canvas.width !== size.width || canvas.height !== size.height) { canvas.width = size.width; canvas.height = size.height; }
      rain.resize(size.width, size.height);
      particles.resize(size.width, size.height);
    };
    const onContextLost = (event: Event) => { event.preventDefault(); fail(); };
    const cleanup = () => {
      if (disposed) return;
      disposed = true; controller?.dispose(); observer?.disconnect();
      window.removeEventListener('resize', resize); canvas.removeEventListener('contextlost', onContextLost);
      // A failed/lost context can throw even while clearing. Release every other resource regardless.
      try { context?.clearRect(0, 0, canvas.width, canvas.height); } catch { /* Static PNG remains available. */ }
      canvas.dataset.frames = String(frames); canvas.dataset.state = 'static';
      canvas.width = 1; canvas.height = 1;
      for (const sprite of [...sprites, ...particleSprites]) { sprite.width = 0; sprite.height = 0; }
    };
    try {
      context = canvas.getContext('2d', { alpha: true });
      if (!context) { fail(); return cleanup; }
      if (rain.count) sprites = createRainSprites(config.rain.wind);
      if (particles.count) particleSprites = createParticleSprites();
      resize();
      const monitor = new PerformanceMonitor(sample => {
        canvas.dataset.fps = sample.fps.toFixed(2);
        canvas.dataset.averageDrawMs = sample.averageDrawMs.toFixed(3);
        canvas.dataset.maxDrawMs = sample.maxDrawMs.toFixed(3);
        onPerformanceSample?.(sample);
      });
      controller = new AnimationController(delta => {
        const start = performance.now();
        try {
          rain.draw(context!, sprites, delta); particles.draw(context!, particleSprites, delta); frames++;
          monitor.record(start, performance.now() - start);
        }
        catch { fail(); }
      }, { request: callback => requestAnimationFrame(callback), cancel: id => cancelAnimationFrame(id) }, config.rendering.targetFps, config.rendering.maxDeltaMs);
      canvas.addEventListener('contextlost', onContextLost);
      window.addEventListener('resize', resize);
      if (typeof ResizeObserver !== 'undefined') { observer = new ResizeObserver(resize); observer.observe(canvas); }
      canvas.dataset.state = 'running';
      controller.start();

    } catch { fail(); }
    return cleanup;
  }, [config, animated, onPerformanceSample]);
  return <canvas ref={canvasRef} className="background-rain background-effects" aria-hidden="true" data-state="static" />;
}
