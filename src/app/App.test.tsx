import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('shell browser', () => {
  it('espone il nome esatto del brand come titolo del contenuto principale', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('<main class="shell-main" id="section-content" aria-labelledby="scene-title">');
    expect(html).toContain('alt="StefCors GL1tCh 0S"');
    expect(html).toContain('id="app-title"');
  });

  it('distingue la preview di sviluppo dalle integrazioni TV reali', () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain('Preview browser');
    expect(html).toContain('nessuna connessione al TV o a servizi esterni');
  });
  it('mantiene le funzioni nella Home unica senza menu sezioni', () => {
    const html = renderToStaticMarkup(<App />);
    expect(html).not.toContain('Navigazione principale');
    for (const id of ['watch-title', 'inputs-title', 'smart-title']) expect(html).toContain(`id="${id}"`);
    expect(html).not.toContain('data-tv-id="motion-settings"');
    expect(html).not.toContain('data-tv-id="background-motion"');
  });

});
