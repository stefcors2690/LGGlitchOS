import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ResourceNotice } from './ResourceNotice';

const props = { id: 'apps', zone: 'rail' as const, label: 'applicazioni demo', onRetry: () => {} };
describe('platform read fallback accessibility', () => {
  it('announces loading without a concurrent retry', () => {
    const html = renderToStaticMarkup(<ResourceNotice {...props} loading empty={false} />);
    expect(html).toContain('role="status"');
    expect(html).toContain('Caricamento applicazioni demo');
    expect(html).not.toContain('<button');
  });
  it('exposes an error and described D-pad retry', () => {
    const html = renderToStaticMarkup(<ResourceNotice {...props} loading={false} empty={false} error="Catalogo non disponibile" />);
    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-describedby="apps-notice"');
    expect(html).toContain('data-tv-zone="rail"');
    expect(html).toContain('aria-label="Riprova · applicazioni demo"');
  });
  it('distinguishes successful empty data from an error', () => {
    const html = renderToStaticMarkup(<ResourceNotice {...props} loading={false} empty />);
    expect(html).toContain('role="status"');
    expect(html).toContain('Nessun elemento disponibile');
    expect(html).not.toContain('role="alert"');
  });
  it('keeps even an empty error readable and leaves ready data alone', () => {
    expect(renderToStaticMarkup(<ResourceNotice {...props} loading={false} empty={false} error="" />)).toContain('Funzione non disponibile');
    expect(renderToStaticMarkup(<ResourceNotice {...props} loading={false} empty={false} />)).toBe('');
  });
});
