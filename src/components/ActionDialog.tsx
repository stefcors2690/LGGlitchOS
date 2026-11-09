import { useId, useLayoutEffect, useRef } from 'react';
import { mapRemoteKey } from '../navigation/focusGraph';
import type { FocusZone } from '../navigation/focusGraph';
import { getDialogReturnId } from './dialogFocus';
import './dialog.css';

export interface ActionDialogRequest {
  readonly title: string;
  readonly message: string;
  readonly returnFocusId: string;
}

function restoreFocus(originId: string) {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-tv-id][data-tv-zone]')];
  const id = getDialogReturnId(elements.map(element => {
    const visibility = getComputedStyle(element).visibility;
    return { id: element.dataset.tvId!, zone: element.dataset.tvZone as FocusZone,
      available: element.isConnected && !element.closest('[hidden], [inert]') && !element.matches(':disabled')
        && element.getAttribute('aria-disabled') !== 'true' && element.getClientRects().length > 0
        && visibility !== 'hidden' && visibility !== 'collapse',
    };
  }), originId);
  const target = elements.find(element => element.dataset.tvId === id);
  target?.focus({ preventScroll: true });
  target?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
}

/** A single native modal: the browser makes the underlying Home inert. No platform/system Back hook. */
export function ActionDialog({ request, onDismiss }: { readonly request: ActionDialogRequest; readonly onDismiss: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId(), descriptionId = useId();
  const originId = request.returnFocusId;
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    try {
      dialog.showModal();
      closeRef.current?.focus({ preventScroll: true });
    } catch {
      // Unsupported native dialogs keep the existing inline feedback and usable Home.
      onDismiss();
    }
    return () => {
      if (dialog.open) dialog.close();
      restoreFocus(originId);
    };
  }, [originId, onDismiss]);
  return <dialog ref={ref} className="action-dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}
    onCancel={event => { event.preventDefault(); onDismiss(); }}
    onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.nativeEvent.isComposing) return;
      const action = mapRemoteKey(event.key);
      if (action === 'back' || action === 'activate') {
        // Enter/Space retain native button activation; remote OK aliases activate exactly once.
        if (action === 'activate' && event.key === 'Enter' && event.target instanceof HTMLButtonElement && !event.repeat) return;
        event.preventDefault(); event.stopPropagation();
        if (!event.repeat) onDismiss();
      } else if (event.key === 'Tab' || action) {
        event.preventDefault(); event.stopPropagation(); closeRef.current?.focus({ preventScroll: true });
      }
    }}>
    <p className="action-dialog-kicker">Preview · Demo</p>
    <h2 id={titleId}>{request.title}</h2>
    <p className="action-dialog-message" id={descriptionId}>{request.message}</p>
    <p className="action-dialog-help">OK per chiudere · Back o Esc per tornare</p>
    <button ref={closeRef} className="action-dialog-close" type="button" onClick={onDismiss}>Chiudi</button>
  </dialog>;
}
