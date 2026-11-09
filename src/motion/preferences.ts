export interface MotionPreferences { readonly reduced: boolean; readonly logo: boolean }
export const defaults: MotionPreferences = { reduced: false, logo: true };
export const motionStorageKey = 'glitchos.motion.v1';
export function parsePreferences(raw: string | null): MotionPreferences {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (typeof value === 'object' && value !== null && 'reduced' in value && 'logo' in value && typeof value.reduced === 'boolean' && typeof value.logo === 'boolean') return { reduced: value.reduced, logo: value.logo };
  } catch { /* Invalid storage falls back to defaults. */ }
  return defaults;
}
export function resolveMotion(preferences: MotionPreferences, systemReduced: boolean, visible: boolean) {
  const reduced = systemReduced || preferences.reduced;
  return { reduced, logoAnimated: !reduced && visible && preferences.logo };
}
export function readPreferences(): MotionPreferences {
  try { return parsePreferences(window.localStorage.getItem(motionStorageKey)); }
  catch { return defaults; }
}
export function savePreferences(value: MotionPreferences): boolean {
  try { window.localStorage.setItem(motionStorageKey, JSON.stringify(value)); return true; }
  catch { return false; }
}
