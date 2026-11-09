# Verifica 2.5 — Ologramma mascherato e neon più rapidi

Data: 2026-11-09. Milestone 3 parte A completata, particelle/veicoli ancora da fare. Chrome headless/macOS; nessuna prova G5.

## Modifiche

Neon: semicicli 4.5–9.9s ridotti del 20% a 3.6–7.92s, intensità e maschere invariate. Pioggia e nebbia mantengono la calibrazione approvata.

HologramLayer: regione x=.773,y=.015,width=.11,height=.42, poligono locale (.04,.12),(.93,0),(1,.88),(.12,1) sul pannello del volto destro. Coordinate tipizzate e validate. Scanline, banda verticale di scansione e variazione di luce; RGB split tramite due copie del PNG filtrate nei soli canali rosso/cyan, alpha massimo .18, e due bande orizzontali traslate al massimo3px. Filtri SVG/screen limitati al pannello e alla finestra glitch, nessun filtro o spostamento dell'immagine intera. Asset intatto.

Glitch true/frequency>0: periodo max(6,1/frequency), default ~6.67s; finestre 92–98% e seconda banda sfasata. False o zero elimina split/distorsioni mantenendo luce/scansione. Off/immagine assente rimuovono layer. Pagina nascosta pausa/nasconde il pannello; sistema reduced motion lo rende display none. Condivisione di useBackgroundViewport con NeonLayer per resize/cleanup, senza RAF o stato React per frame aggiuntivi.

## Verifiche

- npm run check: lint senza warning, TypeScript strict, 110 test e build OK. Sei test nuovi per maschera/config, cap frequenza/zero, validazione punti, copie allineate ai pixel immagine 1080p/4K/portrait, off/asset assente e pausa/glitch false.
- Un'asserzione iniziale sui float confrontava stringhe CSS con arrotondamenti diversi (~1e-13): sostituita con confronto numerico, senza ridurre precisione visiva. Intera suite rieseguita con successo.
- node scripts/verify-shell.mjs: mapping maschera/cover entro1px a 1080p/4K/mobile, clip-path poligonale applicato, scansione avanza, puntatore escluso. In reduced motion il pannello è display none e il test legge le coordinate configurate; in movimento controlla il bounding rect reale.
- Campione RGB: opacity .18, traslazione1.6896px a1080p e riferimento filtro valido. Screenshot hologram-interference-1920x1080.png acquisito con pausa CSS temporanea solo per catturare la finestra diagnostica; fase e stile ripristinati, senza play() forzati.
- Neon più rapidi confermati: primo semiciclo3600ms, alpha pulse .12–1. Regionamento/calibrazione neon, pioggia e nebbia verificati nuovamente insieme.
- Visibilità emulata e reduced motion live: hologram still/nascosto, rain off e nebbia/neon fermi; ripresa funzionante. Errore immagine rimuove anche hologram/neon. Canvas non disponibile lascia PNG e gli effetti CSS indipendenti disponibili. Focus, percorsi D-pad/OK/Back, layout e fallback immagine preservati.
- Nessuna Runtime.exceptionThrown o console.error osservata nel giro finale (runtimeErrors=[]). La richiesta mancante intenzionale resta un errore Network previsto.
- Test browser reso più affidabile attendendo il nuovo performance.timeOrigin/documento completo dopo reload: prima alcune letture potevano riferirsi alla pagina precedente. Lint rieseguito dopo modifica script. git diff --check OK.

## Confronto visivo

Ispezionati hologram-interference-1920x1080.png e rain-3840x2160.png confrontandoli con background.png e references00/01 già ispezionati. Alterazioni dentro il pannello del volto destro; camera, città, scritte, logo e widget conservati. Maschera segue la prospettiva approssimata del tabellone; scanline/RGB non attraversano la città. Screenshot 4K logico aDPR2 ha 7680×4320 pixel fisici, buffer pioggia resta Full HD.

Limiti: maschera poligonale manuale del pannello, non segmentazione dei tratti del volto. Nessun battito occhi/labbra o movimento realistico della persona; volto dipinto resta il contenuto originale. Glitch leggero e intermittente, screenshot normale può mostrare solo luminosità/scanline. Filtri/blend locali richiedono misure hardware successive. Restano differenze demo/brand e menu rimosso per scelta utente; nessuna fedeltà completa dichiarata.

## Ripresa

Prossima 2.6 — Particelle e predisposizione veicoli. Nessuna nuova dipendenza, API TV o modifica sistema. La milestone3 sarà completata dopo2.6. Profili, pannello tecnico e stabilità prolungata restano nelle fasi successive; nessuna prestazione G5 garantita.
