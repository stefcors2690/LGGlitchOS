import { useEffect, useId, useRef } from 'react';
import './remote.css';

const commands = [
  { key: 'ArrowUp', label: 'Su', symbol: '↑' },
  { key: 'ArrowLeft', label: 'Sinistra', symbol: '←' },
  { key: 'OK', label: 'OK', symbol: 'OK' },
  { key: 'ArrowRight', label: 'Destra', symbol: '→' },
  { key: 'ArrowDown', label: 'Giù', symbol: '↓' },
  { key: 'Escape', label: 'Back', symbol: 'Back' },
] as const;

/** Development-only synthetic input, routed to the current modal or last Home control. */
export default function RemoteSimulator({ expanded, onExpandedChange }: { readonly expanded: boolean; readonly onExpandedChange: (expanded: boolean) => void }) {
  const panelId = useId();
  const lastTarget = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const record = () => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && !active.closest('[data-remote-tools]') && active.matches('[data-tv-id], .action-dialog-close')) lastTarget.current = active;
    };
    record(); document.addEventListener('focusin', record);
    return () => document.removeEventListener('focusin', record);
  }, []);
  const send = (key: string) => {
    const modal = document.querySelector<HTMLDialogElement>('.action-dialog[open]');
    const active = document.activeElement;
    const remembered = lastTarget.current;
    const available = (element: HTMLElement | null): element is HTMLElement => !!element?.isConnected && !element.closest('[data-remote-tools], [hidden], [inert]')
      && !element.matches(':disabled') && element.getClientRects().length > 0 && getComputedStyle(element).visibility === 'visible';
    let target: HTMLElement = document.body;
    if (modal) target = active instanceof HTMLElement && available(active) && modal.contains(active) ? active : modal.querySelector<HTMLButtonElement>('.action-dialog-close')!;
    else if (active instanceof HTMLElement && active.matches('[data-tv-id]') && available(active)) target = active;
    else if (available(remembered)) target = remembered;
    if (target !== document.body) target.focus({ preventScroll: true });
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    // A command may remove the modal. Never redirect its keyup to a different Home control.
    if (target.isConnected) target.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true }));
  };
  return <aside className="remote-tools" data-remote-tools="true" aria-label="Simulatore telecomando di sviluppo">
    <button type="button" className="remote-toggle" aria-expanded={expanded} aria-controls={panelId}
      onPointerDown={event => event.preventDefault()} onClick={() => onExpandedChange(!expanded)}>
      {expanded ? 'Nascondi telecomando' : 'Telecomando · test'}
    </button>
    {expanded && <div id={panelId} className="remote-panel">
      <p>Simulatore browser</p><p className="remote-note">Input sintetici · Home e dialoghi Demo</p>
      <div className="remote-buttons">
        {commands.map(command => <button type="button" key={command.key} data-remote-key={command.key} aria-label={command.label}
          onPointerDown={event => event.preventDefault()} onClick={() => send(command.key)}>{command.symbol}</button>)}
      </div>
      <p className="remote-note">Tab per i controlli, Invio per inviare. I comandi tornano al focus dell’app.</p>
    </div>}
  </aside>;
}
