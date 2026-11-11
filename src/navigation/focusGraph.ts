export const focusZones = ['header', 'controls', 'rail', 'widgets', 'settings'] as const;
export type FocusZone = typeof focusZones[number];
export type Direction = 'left' | 'right' | 'up' | 'down';
export interface FocusNode { readonly id: string; readonly zone: FocusZone }
export type FocusMemory = Partial<Record<FocusZone, string>>;

/** Logical rows, bounded horizontal movement, last focus remembered per destination row. */
export function nextFocus(nodes: readonly FocusNode[], currentId: string | null, direction: Direction, memory: FocusMemory): string | null {
  const current = nodes.find(node => node.id === currentId);
  if (!current) return nodes[0]?.id ?? null;
  const row = nodes.filter(node => node.zone === current.zone);
  const index = row.findIndex(node => node.id === current.id);
  if (direction === 'left' || direction === 'right') {
    const next = Math.max(0, Math.min(row.length - 1, index + (direction === 'right' ? 1 : -1)));
    return row[next]?.id ?? current.id;
  }
  const zones = focusZones.filter(zone => nodes.some(node => node.zone === zone));
  const targetZone = zones[zones.indexOf(current.zone) + (direction === 'down' ? 1 : -1)];
  if (!targetZone) return current.id;
  const targetRow = nodes.filter(node => node.zone === targetZone);
  const remembered = targetRow.find(node => node.id === memory[targetZone]);
  return remembered?.id ?? targetRow[Math.min(index, targetRow.length - 1)]?.id ?? current.id;
}

export type RemoteAction = Direction | 'activate' | 'back';
export function mapRemoteKey(key: string, keyCode = 0, webos = false): RemoteAction | null {
  if (webos && keyCode === 461) return 'back';
  switch (key) {
    case 'ArrowLeft': return 'left';
    case 'ArrowRight': return 'right';
    case 'ArrowUp': return 'up';
    case 'ArrowDown': return 'down';
    case 'Enter': case 'OK': case 'Accept': case 'Select': return 'activate';
    case 'Escape': case 'Back': case 'BrowserBack': case 'Backspace': return 'back';
    default: return null;
  }
}
