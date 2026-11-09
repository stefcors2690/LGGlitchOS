# Verifica 1.2 — Header, sezioni e orologio locale

Data: 2026-11-09. Build di produzione in Vite preview, Chrome locale headless. Sfondo approvato `references/background.png` preservato.

## Esiti

- `npm run check`: lint senza warning, typecheck, 31 test e build riusciti. Due nuovi test orologio per cambio giorno/fuso, ora legale e formato locale.
- Home/App/Ingressi/Domotica/Impostazioni selezionabili; contenuto e titolo aggiornati, esattamente un aria-current e main denominato dal titolo della sezione.
- Attivazione App con focus e Invio reali via CDP: selezione riuscita e focus conservato. Tutte le cinque sezioni verificate con click; nessun overflow sul viewport TV di test.
- Orologio confrontato con Date/Intl del browser; ISO datetime coerente e aggiornamento dopo almeno un tick verificato. Non sono dati demo; non è l’ora letta dalla TV. Meteo assente.
- Screenshot 1920×1080/3840×2160 senza overflow, 390×844 senza overflow orizzontale e con scroll verticale previsto. PNG esplicitamente decodificato prima delle acquisizioni per evitare schermate che mostrano ancora il fallback.
- Verifiche precedenti di logo, reduced motion, sfondo, navette, pausa da tastiera, evento visibilitychange emulato e fallback ancora superate.

## Evidenze

- [Home 1080p](shell-1920x1080.png)
- [Home 4K](shell-3840x2160.png)
- [Finestra stretta](shell-390x844.png)
- [Sezione Impostazioni](settings-1920x1080.png)
- [Fotogramma navette](city-flight-1920x1080.png)
- [Misure e controlli](shell-metrics.json)

Screenshot acquisiti con movimento ridotto tranne il fotogramma delle navette. Ora/data negli screenshot corrispondono all’istante della verifica e non sono campioni hardcoded. Ispezionati Home 1080p e finestra stretta; layout 4K controllato anche via misure automatiche.

## Riproduzione e limiti

Usare `npm run build`, `npm run preview -- --host 127.0.0.1 --port 5187 --strictPort`, quindi `node scripts/verify-shell.mjs` in un secondo terminale. Chrome locale richiesto; CHROME_PATH, SHELL_URL e VERIFY_OUTPUT configurano browser/preview/destinazione.

Sezioni diverse dalla Home ancora introduttive, senza catalogo o azioni TV. Selezione in memoria senza URL/persistenza, nessuna nuova dipendenza. Tab/Enter/Space disponibili; focus manager D-pad in 1.4. Nessun collaudo G5, precisione dell’orologio hardware o prestazioni TV verificati. Prossima microfase 1.3: rail applicazioni.
