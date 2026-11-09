import type { FocusZone } from '../navigation/focusGraph';

export interface DialogReturnTarget { readonly id: string; readonly zone: FocusZone; readonly available: boolean }
/** Restore the invoking control; a vanished/disabled origin falls back to the Home rail. */
export function getDialogReturnId(targets: readonly DialogReturnTarget[], originId: string): string | null {
  const available = targets.filter(target => target.available);
  return available.find(target => target.id === originId)?.id
    ?? available.find(target => target.zone === 'rail')?.id
    ?? available[0]?.id ?? null;
}
