# Correzione 1.1 — Sfondo fornito dall’utente

Data: 2026-11-09. Usato `references/background.png` come sfondo effettivo, senza modificarne il contenuto, al posto degli skyline procedurali. Il PNG è importato direttamente da CSS/Vite e incluso nella build come asset locale. I mockup completi non sono usati come schermate interattive.

La fonte è stata fornita e selezionata dall’utente; non si attribuisce il PNG al generatore vettoriale. Pioggia, foschia e due navette aggiuntive sono livelli separati. Navi, pioggia e riflessi già dipinti nel PNG restano statici. Non viene animata l’immagine intera. I due vecchi skyline SVG sono conservati ma non importati.

## Verifiche

- `npm run check`: lint, typecheck, 29 test e build riusciti.
- Chrome headless sulla build: PNG e navette caricati, layout 1080p/4K senza overflow, finestra 390×844 con scorrimento verticale previsto.
- Pausa da tastiera, ripresa, reduced motion, evento visibilitychange emulato, timeline e visibilità delle navette: controlli superati.
- Fallback gradiente con asset mancanti e controlli logo della 0.4 ancora superati.
- Ispezionato screenshot 1080p: l’immagine approvata è visibile e i testi sono protetti da scrim, ombra e pannelli scuri. Nessun audit completo del contrasto pixel per pixel.
- Fonte e asset distribuito: PNG invariato, circa 2,88 MB; costo di decodifica e resa sul G5 ancora da misurare. Nessuna verifica hardware o nuova dipendenza.

## Evidenze

- [Sfondo approvato 1080p](shell-1920x1080.png)
- [Sfondo approvato 4K](shell-3840x2160.png)
- [Finestra stretta](shell-390x844.png)
- [Navette aggiuntive](city-flight-1920x1080.png)
- [Misure e controlli](shell-metrics.json)

Riproduzione: `npm run build`, avviare `npm run preview -- --host 127.0.0.1 --port 5187 --strictPort`, poi in un secondo terminale `node scripts/verify-shell.mjs` con Chrome locale disponibile. Lo script salva in questa cartella; configurabili CHROME_PATH, SHELL_URL e VERIFY_OUTPUT come da README.

Prossima fase: 1.2. Header e widget rimangono strutturali; non si dichiara ancora fedeltà completa del layout Home al mockup.
