import { useEffect, useState } from 'react';
import { IdleController } from './IdleController';

/** Input is observed in capture phase, never consumed. Hidden-page time never expires the visible grace period. */
export function useIdleDimming() {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const controller = new IdleController(setIdle, {
      now: () => performance.now(), set: (callback, delay) => window.setTimeout(callback, delay), clear: id => window.clearTimeout(id),
    });
    let pointer: { x: number; y: number } | null = null;
    const activity = () => controller.activity();
    const move = (event: PointerEvent) => {
      if (pointer?.x === event.clientX && pointer.y === event.clientY) return;
      pointer = { x: event.clientX, y: event.clientY }; activity();
    };
    const visibility = () => controller.setVisible(!document.hidden);
    visibility();
    document.addEventListener('keydown', activity, true);
    document.addEventListener('pointerdown', activity, true);
    document.addEventListener('pointermove', move, { capture: true, passive: true });
    document.addEventListener('wheel', activity, { capture: true, passive: true });
    document.addEventListener('click', activity, true);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('focus', activity);
    return () => {
      controller.dispose();
      document.removeEventListener('keydown', activity, true);
      document.removeEventListener('pointerdown', activity, true);
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('wheel', activity, true);
      document.removeEventListener('click', activity, true);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('focus', activity);
    };
  }, []);
  return idle;
}
