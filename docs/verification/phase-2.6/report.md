# Verifica 2.6 — Particelle e predisposizione veicoli

Data: 2026-11-09. Milestone 3 completata (ologramma2.5 + particelle2.6). Chrome headless su macOS, nessuna prova LG G5/webOS.

## Modifiche

ParticleEngine con pool fisso Float32Array, default40 particelle, limite200 validato nella config. Profondità, nucleo/alone cyan e magenta da due sprite32×32 allocati a setup, deriva lenta a destra e verso l’alto, luminosità sinusoidale ~25s senza flash. Coordinate normalizzate conservate a resize, riciclo oltre bordo e delta massimo100ms. Nessuna allocazione/frame o aggiornamento React/frame.

BackgroundCanvas condivide buffer, resize e controller RAF con la pioggia: RainEngine pulisce/disegna, ParticleEngine sovrappone senza cancellare. Particelle funzionano anche con pioggia off; con entrambi i pool vuoti il loop non parte. Buffer massimo1920×1080 anche su UI4K/DPR2, cadenza obiettivo30fps. Cleanup libera controller, listener/observer e sprite di entrambi. Riduzione movimento e pagina nascosta fermano il loop; Canvas non disponibile mantiene il PNG e gli effetti CSS indipendenti. Classe background-rain conservata per compatibilità e background-effects aggiunta; data-rain-count/data-particle-count diagnostici.

FlyingVehicleEngine standalone: resize/draw con asset CanvasImageSource separato già decodificato e aspectRatio positivo. Defaultoff; senza asset non disegna. Una traversata distante18s con intervallo72s predisposta, ma **il modulo non viene montato dalla Home**. Nessun loader/asset veicolo disponibile o verificato; in futuro serviranno sprite trasparente, provenienza e integrazione esplicita. Il solo flag enabled non avvia veicoli nella Home. Nessuna manipolazione del PNG, vecchie navette CSS assenti.

## Controlli eseguiti

- npm run check: lint senza warning, TypeScript strict,117 test (17 file) e build produzione OK. Sette test aggiunti: conteggi/off/zero/cap, deriva/resize/alpha, riciclo20min simulati, clamp dopo pausa/sprite assente, veicoli senza asset/defaultoff e intervallo tra passaggi, montaggio Canvas con sola particella/nessun effetto. Test controller esistenti coprono cancel/stop/resume/dispose.
- npm run lint rieseguito dopo l’ampliamento dello script browser; git diff --check OK.
- node scripts/verify-shell.mjs: Chrome con preview produzione locale5187; un solo Canvas con40 particelle e pointer-events none. Instrumentazione temporanea nel solo test identifica gli sprite32×32; draw count e coordinate avanzano. Disabilitando temporaneamente solo il draw delle scie32×96, le particelle isolate hanno1809 pixel alpha>=20 e alpha massimo145/255. Soglie minime visibilità superate; screenshot particles-only-1920x1080.png. La pioggia dipinta nel PNG resta naturalmente visibile anche in questo screenshot.
- Nessun hook diagnostico aggiunto alla Home. Instrumentazione/probe rimossi prima delle prove di fallback; screenshot normali ripristinano entrambi gli effetti. Il campione pioggia ora include anche le particelle (12067 pixel alpha>=20, massimo168), non è una misura isolata della pioggia.
- Reduced motion live ferma anche le chiamate draw delle particelle; pagina nascosta ferma Canvas/CSS e ripresa riuscita. Resize1920→3840 aDPR2 conserva buffer1920×1080, mapping neon/ologramma entro1px. Navigazione frecce/OK/Back, widget e focus stabili mentre gli effetti avanzano.
- Layout1080p/4K senza overflow; portrait390×844 con scorrimento verticale previsto. Canvas assente e asset immagine errato verificati, fallback accessibile e navigazione conservati. Runtime.exceptionThrown/console.error: nessuno (runtimeErrors=[]); richiesta404 intenzionale del fallback prevista.
- SHA256 originale e copia asset invariato: 7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482. Nessuna dipendenza aggiunta.

## Confronto visivo e limiti

Ispezionati references00/01, particles-only-1920x1080.png e rain-3840x2160.png. Piccoli nuclei luminosi sparsi, maggiore profondità senza copertura di card/logo/widget; città/camera e veicoli dipinti restano fermi. Nebbia density65, pioggia intensity65 e neon intensity100/semicicli3.6–7.92s preservati, maschera ologramma invariata. Restano le differenze demo/brand e la Home senza menu superiore approvata dall’utente; non si dichiara corrispondenza totale ai mockup.

Screenshot4K logico aDPR2 misura7680×4320 pixel fisici; non prova prestazioni4K su TV. La simulazione pool20min è un test logico, non un soak browser/hardware né una misura di frame time/memoria. Profili adattivi, monitor, pannello e stabilità prolungata restano2.7–2.10. Mancano asset reali per i veicoli: nessuna resa visiva veicoli convalidata. Nessuna API webOS o modifica sistema.

Prossima microfase: **2.7 — Profili prestazionali**. Contratti e unità in src/features/background/README.md, punto di ripresa in PROJECT_STATUS.md e START_HERE.md.
