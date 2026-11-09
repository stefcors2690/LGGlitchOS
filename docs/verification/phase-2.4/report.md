# Verifica 2.4 — Neon e illuminazione localizzata

Data: 2026-11-09. Milestone 2 (nebbia + neon) completata. Chrome headless/macOS, nessuna prova G5.

## Implementazione

NeonLayer con sette regioni normalizzate sul PNG approvato: cinque insegne (07, insegne giapponesi sinistra/centro/destra, finestre cyan) e due riflessi acqua. NeonRegion tipizzato con id/color/kind e validazione estensione/ID univoci. Gradienti radiali confinati, nessun filtro/blend sull'immagine o nuovo Canvas. Intensità default 70: opacity massima contenitore insegne .28, riflessi .112, ulteriormente modulata da gradiente e pulsazione.

Respiro locale 8–18.2s, sfasato, alternate; interferenza opzionale come calo del 18% una volta per ciclo di 37–55s. Nessun flash a bianco, scomparsa o lampeggiamento continuo. Config off/zero/regioni vuote/immagine assente non montano layer. Faccia olografica esclusa, resta in 2.5.

BackgroundImage comunica naturalWidth/naturalHeight dopo caricamento; regioni mappate con trasformazione cover e aggiornate a resize tramite observer/listener, con cleanup. Fonte cambiata/errore nasconde i neon finché non è disponibile l'asset corretto. Nessun RAF JS o stato React per frame, niente rerender widget. Policy reduced motion/visibilità rispettata. Pioggia/nebbia invariate rispetto alla calibrazione approvata (fog density 65).

## Verifiche

- npm run check: lint, typecheck strict, 104 test e build OK. Cinque test nuovi: aree/default, validazione ID/limiti, off/zero/asset assente, mapping 1080p/4K/portrait, pausa/interferenza opzionale. Lint rieseguito dopo aggiornamento script.
- node scripts/verify-shell.mjs: sette regioni e allineamento tower-07 entro 1px a 1080p/4K/mobile; formula usa dimensioni naturali e crop cover. Interferenza campionata: opacity .2296 rispetto a normale .28 (82%), ripristinata la fase senza play() forzati.
- Opacità della pulsazione cambia tra campioni temporali. Neon pointer-events none e filter none; pausa quando pagina nascosta e riduzione sistema. Test insieme a fog e rain, nessuna regressione D-pad/OK/Back e focus.
- Nessuna Runtime.exceptionThrown o console.error osservata via CDP nel collaudo. La richiesta immagine mancante indotta nel test resta errore rete intenzionale: non viene dichiarata assenza totale di errori Network. Sull'errore immagine neon rimosso e fallback accessibile preservato.
- Regressioni Canvas indisponibile/resize/DPR/visibilità e logo incluse. Misure in shell-metrics.json. git diff --check OK.

## Confronto visivo

Ispezionati rain-1920x1080.png e rain-3840x2160.png (ora comprendono anche neon), confrontati con PNG originale e references 00/01 già ispezionati. Bagliori sulle insegne individuate, riflessi attenuati sull'acqua, camera e UI ferme; nessun velo neon globale. Pioggia/nebbia restano percepibili e widget leggibili. Screenshot 4K logico a DPR2 produce 7680×4320 pixel fisici, Canvas rain sempre limitato Full HD.

Limiti: maschere rettangolari con sfumatura, non tracciati per singole lettere né vera luce 3D; l'insegna già dipinta nel PNG non viene spenta. I riflessi possono trovarsi sotto widget trasparenti, senza modificarne i testi. Restano differenze di marchio/asset demo/menu rimosso autorizzate. Nessuna fedeltà completa o simulazione fisica dichiarata. Cambiando immagine occorre ricalibrare regioni.

## Ripresa

2.5 — Ologramma mascherato sul volto destro: usare la stessa pipeline dimensioni/coordinate, con maschera dedicata. Non anticipare particelle/profili. Nessuna nuova dipendenza, servizio o modifica TV. Profilazione prolungata e misure G5 restano da eseguire nelle fasi previste.
