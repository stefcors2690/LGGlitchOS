# Verifica 1.8 — Impostazioni movimento

Data: 2026-11-09. Chrome headless locale/macOS, nessun collaudo G5.

## Implementazione

Impostazioni espone due switch nativi: movimento ridotto globale (altrimenti segue il sistema) e consenso animazione logo. Preferenze boolean valide in localStorage/glitchos.motion.v1, default riduzione utente disattivata e logo consentito. Dati mancanti/malformati ignorati; accesso storage bloccato non interrompe UI e salvataggio fallito segnala durata sessione. La preferenza di sistema ha sempre precedenza e cambia live. Riduzione ferma sfondo/navette e animazioni/transizioni CSS. Logo statico derivato dal canonico quando ridotto, disabilitato o pagina nascosta; la riattivazione può riavviare il ciclo. SVG originale preservato.

Pausa sfondo indipendente e volatile, sospensione pagina nascosta preservata. Nessun reset dell'adapter o del focus al cambio preferenza. Switch nella zona widgets; frecce, Enter/OK, Tab/Spazio ed Escape disponibili.

## Verifiche

- `npm run check`: lint senza warning, typecheck, 78 test e build OK, rieseguito dopo la correzione del fallback immagine canonico.
- Quattro nuovi test: precedenza sistema su tutte le combinazioni, riduzione utente/logo/visibilità, validazione, round trip e storage bloccato.
- `node scripts/verify-shell.mjs`: riduzione globale da tastiera, sfondo e logo statici, transizioni a 0s, preferenza mantenuta al reload, logo disattivabile separatamente mentre lo sfondo continua, ripristino e cambio live a reduced motion di sistema. Regressioni layout 1080p/4K/mobile, focus/widget, sfondo/fallback e due cicli SVG incluse. Esiti in shell-metrics.json.
- Primo giro interrotto da asserzione dello script che attendeva 'animated' invece del valore esistente 'running' dello sfondo; corretta l'asserzione e rieseguito il collaudo.

## Confronto visivo

Ispezionati shell-1920x1080.png e shell-3840x2160.png contro references/00_brand_home.png e 01_home_approved.png. Home conserva sfondo scelto, rail e tre pannelli; la riduzione non modifica geometria e leggibilità del logo. Ispezionata settings-1920x1080.png: controlli su pannello scuro con contorni cyan/magenta e testo sulla precedenza di sistema. Nessun concept dedicato a Impostazioni: applicato il tema esistente senza modificare la composizione Home.

Differenze preesistenti conservate: header meno elaborato del concept, marchio canonico diverso dal disegno nel mockup, rail con simboli neutri e nomi demo, widget domotica con due switch e senza termostato/tapparelle, contenuto Continua a guardare fittizio. Nessuna fedeltà completa dichiarata. Screenshot aggiuntivo motion-settings-1920x1080.png per le preferenze durante la prova.

## Limiti e prossimo passo

Idle dimming resta in 2.3. Storage isolato per origine/browser, sincronizzazione fra tab non implementata. Visibilità emulata tramite evento, non ciclo di vita webOS. Leggibilità da divano e prestazioni hardware non verificate. Nessuna libreria/servizio nuovo. Le microfasi 1.1–1.8 sono implementate; il prossimo checkpoint è debug interattivo browser con utente prima della fase 2. Il collaudo headless non equivale alla sessione interattiva richiesta.
