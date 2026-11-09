import { useState } from 'react';
import type { Size } from './background.types';

export function BackgroundImage({ src, onDimensions }: { readonly src: string; readonly onDimensions?: (size: Size | null) => void }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(src.trim() ? 'loading' : 'error');
  return <>
    {status !== 'error' && <img className="background-image" src={src} alt="" aria-hidden="true" draggable={false}
      onLoad={event => { setStatus('ready'); onDimensions?.({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight }); }} onError={() => { setStatus('error'); onDimensions?.(null); }} />}
    {status === 'error' && <p className="background-notice" role="status">Sfondo non disponibile. Verifica il percorso dell’immagine configurata.</p>}
  </>;
}
