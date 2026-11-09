# Verifica 0.4 — Tema e shell TV

Data: 2026-11-09. Browser: Google Chrome locale in modalità headless, via Chrome DevTools Protocol. Target: build di produzione servita con Vite preview, non hardware LG.

## Risultati

| Viewport | Superficie | Testo base | Overflow orizzontale | Overflow verticale |
| --- | --- | --- | --- | --- |
| 1920×1080 | 1920×1080, 16:9 | 27,84px | No | No |
| 3840×2160 | 3840×2160, 16:9 | 55,68px | No | No |
| 390×844 | Flusso verticale | 14,5px | No | Sì, scorrimento previsto |

- Header e footer rientrano nei margini sicuri. A 1080p: 76,8px laterali e 48px verticali; a 4K le misure raddoppiano.
- Tutte le zone widget rientrano nella superficie e precedono il footer.
- Logo caricato dalla build e nome accessibile esatto. Errore immagine simulato con evento `error`: verificato fallback testuale React.
- Movimento ridotto emulato: il picture seleziona il logo statico derivato; verificata assenza di animazione della variante ferma. Corretto un artefatto iniziale dell'SVG esterno che poteva mostrare un fotogramma di glitch anche con emulazione reduced motion.
- SVG canonico aperto standalone dal medesimo contenuto distribuito: animationName `none` con reduce e `shake` con no-preference. Timeline normale avanzata di circa 18,2 secondi (due cicli da 9s). Questo è un controllo automatico della timeline, non una certificazione visiva di ogni fotogramma.
- Ispezionati gli screenshot 1080p, 4K e finestra stretta. Nessuna risorsa grafica esterna richiesta dall'app.
- `npm run check`: OK, lint senza warning, typecheck strict, 21 test e build.

## Evidenze

- [Screenshot 1080p](shell-1920x1080.png)
- [Screenshot 4K](shell-3840x2160.png)
- [Screenshot finestra stretta](shell-390x844.png)
- [Misure del browser](shell-metrics.json)

Gli screenshot sono acquisiti con movimento ridotto per rappresentare uno stato riproducibile. I pixel sono prodotti da Chrome; la resa effettiva su OLED non è stata verificata.

## Riproduzione

Eseguire `npm run build`, poi `npm run preview -- --host 127.0.0.1 --port 5187 --strictPort`. In un altro terminale eseguire `node scripts/verify-shell.mjs`. Lo script richiede Node >=22.12, Chrome locale, accesso alla porta di preview e possibilità di avviare un processo browser con profilo temporaneo; non installa pacchetti. Percorso Chrome configurabile con CHROME_PATH, preview con SHELL_URL. Rigenera screenshot e metriche nella cartella di questo rapporto.

## Limiti

Shell strutturale statica: non è la Home MVP completa. Città, rail, dati widget e navigazione saranno implementati nelle fasi 1.x. Idle dimming non implementato, pertanto non lasciare questa anteprima statica accesa a lungo sull'OLED. Nessuna prova su G5, webOS o Edge; nessun benchmark 60fps o collaudo da divano eseguito. Le verifiche di navigazione e del telecomando restano nelle relative microfasi.
