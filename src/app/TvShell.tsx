import { BrandLogo } from '../components/BrandLogo';

const widgets = [
  { id: 'watch', number: '01', title: 'Continua a guardare', description: 'I contenuti demo arriveranno qui.' },
  { id: 'inputs', number: '02', title: 'Ingressi', description: 'Le sorgenti demo arriveranno qui.' },
  { id: 'home', number: '03', title: 'Domotica', description: 'I controlli demo arriveranno qui.' },
];

export function TvShell() {
  return (
    <div className="tv-shell" data-theme="neon">
      <header className="shell-header">
        <BrandLogo />
        <p className="shell-location">Home <span>/ Anteprima</span></p>
        <p className="demo-badge">Preview browser · Demo</p>
      </header>
      <main className="shell-main" aria-labelledby="app-title">
        <section className="shell-scene" aria-labelledby="scene-title">
          <p className="eyebrow">Il tuo spazio, un altro mondo</p>
          <h2 id="scene-title">Oltre lo schermo.</h2>
          <p className="scene-description">La nuova Home sta prendendo forma.</p>
          <p className="stage-note">Tema e layout · Anteprima statica</p>
        </section>
        <section className="shell-apps holographic-panel" aria-labelledby="apps-title">
          <div>
            <p className="eyebrow">Applicazioni</p>
            <h2 id="apps-title">Le tue app, in primo piano.</h2>
          </div>
          <p className="placeholder-note">Rail demo in arrivo</p>
        </section>
        <div className="shell-widgets">
          {widgets.map(widget => (
            <section className="widget-placeholder holographic-panel" key={widget.id}
              aria-labelledby={`${widget.id}-title`}>
              <span className="zone-number" aria-hidden="true">{widget.number}</span>
              <h2 id={`${widget.id}-title`}>{widget.title}</h2>
              <p>{widget.description}</p>
            </section>
          ))}
        </div>
      </main>
      <footer className="shell-footer">
        <p>Ambiente di sviluppo: nessuna connessione al TV o a servizi esterni.</p>
        <p className="shell-signature" aria-hidden="true">SC / GL1tCh 0S</p>
      </footer>
    </div>
  );
}
