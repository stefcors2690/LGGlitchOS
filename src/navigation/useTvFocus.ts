import { useEffect, useRef } from 'react';
import { focusZones, mapRemoteKey, nextFocus } from './focusGraph';
import type { FocusMemory, FocusZone } from './focusGraph';

/** Browser-only input handling. No system-key interception or privileged webOS API. */
export function useTvFocus(onBack: () => void) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const memory: FocusMemory = {};
    let lastFocused: string | null = null;
    const isVisible = (element: HTMLElement) => !element.closest('[hidden], [inert]') &&
      !element.matches(':disabled') && element.getClientRects().length > 0;
    const controls = () => [...root.querySelectorAll<HTMLButtonElement>('[data-tv-id][data-tv-zone]')]
      .filter(isVisible);
    const preferredHeader = () => controls().find(element => element.dataset.tvZone === 'rail') ?? controls()[0];
    const focus = (element: HTMLElement | undefined) => {
      element?.focus({ preventScroll: true });
      element?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    };
    const recordFocus = (event: FocusEvent) => {
      const element = event.target;
      if (!(element instanceof HTMLElement) || !root.contains(element)) { lastFocused = null; return; }
      const id = element.dataset.tvId;
      const zone = element.dataset.tvZone as FocusZone | undefined;
      if (id && zone && focusZones.includes(zone)) { memory[zone] = id; lastFocused = id; }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) return;
      if (root.querySelector('dialog[open][aria-modal="true"]')) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable="true"], dialog, [role="dialog"], [data-background-tools]')) return;
      const active = document.activeElement;
      if (active && active !== document.body && !root.contains(active)) return;
      const action = mapRemoteKey(event.key);
      if (!action) return;
      const available = controls();
      const current = available.find(element => element === active);
      if (action === 'back') {
        event.preventDefault();
        if (!event.repeat) { onBack(); focus(available.find(element => element.dataset.tvZone === 'rail') ?? preferredHeader()); }
        return;
      }
      if (action === 'activate') {
        // Native Enter on buttons already dispatches click; never dispatch it twice.
        if (current && (current.tagName === 'BUTTON' || current.tagName === 'SUMMARY') && event.key === 'Enter' && !event.repeat) return;
        event.preventDefault();
        if (!event.repeat) {
          const destination = current ?? preferredHeader();
          focus(destination);
          if (destination?.getAttribute('aria-disabled') !== 'true') destination?.click();
        }
        return;
      }
      event.preventDefault();
      if (!current) { focus(preferredHeader()); return; }
      const nodes = available.map(element => ({ id: element.dataset.tvId!, zone: element.dataset.tvZone as FocusZone }));
      const id = nextFocus(nodes, current.dataset.tvId ?? null, action, memory);
      focus(available.find(element => element.dataset.tvId === id));
    };
    // Repair only a focus that disappeared/was hidden; do not reset it on normal rerenders.
    const observer = new MutationObserver(() => {
      if (!lastFocused) return;
      const previous = root.querySelectorAll<HTMLElement>('[data-tv-id]');
      const element = [...previous].find(item => item.dataset.tvId === lastFocused);
      if (!element || !isVisible(element)) focus(preferredHeader());
    });
    document.addEventListener('keydown', handleKey);
    document.addEventListener('focusin', recordFocus);
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'disabled', 'open'] });
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('focusin', recordFocus);
      observer.disconnect();
    };
  }, [onBack]);
  return rootRef;
}
