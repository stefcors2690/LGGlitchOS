import { useState } from 'react';
import logoUrl from '../../assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg?url';
import logoSource from '../../assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg?raw';

// Derived from the canonical asset, not a separately maintained drawing.
const stillLogo = `data:image/svg+xml,${encodeURIComponent(logoSource.replace('</style>',
  '#base,#red,#blue,.slice,.scan{animation:none!important}#red,#blue,.slice,.scan{opacity:0!important}</style>'))}`;

/** Picture chooses a guaranteed still frame when the user requests reduced motion. */
export function BrandLogo({ animated = true }: { readonly animated?: boolean }) {
  const [failed, setFailed] = useState(false);

  return (
    <h1 className="brand-logo" id="app-title">
      {failed ? <span>StefCors GL1tCh 0S</span> : (
        <picture>
          <source media={animated ? "(prefers-reduced-motion: reduce)" : undefined} srcSet={stillLogo} />
          <img data-motion={animated ? "animated" : "still"} src={logoUrl} width="1200" height="360" alt="StefCors GL1tCh 0S"
          onError={() => setFailed(true)} />
        </picture>
      )}
    </h1>
  );
}
