import { useSyncExternalStore } from 'react';
import { shouldAnimateBackground } from './backgroundPolicy';

const query = '(prefers-reduced-motion: reduce)';
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}
const getReducedMotion = () => window.matchMedia(query).matches;
const getPageVisible = () => !document.hidden;
const serverReducedMotion = () => true;
const serverVisible = () => false;

export function useBackgroundMotion() {
  const systemReduced = useSyncExternalStore(subscribeMotion, getReducedMotion, serverReducedMotion);
  const pageVisible = useSyncExternalStore(subscribeVisibility, getPageVisible, serverVisible);
  return {
    reducedMotion: systemReduced,
    logoAnimated: !systemReduced && pageVisible,
    animated: shouldAnimateBackground({ reducedMotion: systemReduced, pageVisible, userPaused: false }),
  };
}
