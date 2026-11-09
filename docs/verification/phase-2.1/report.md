# Verifica 2.1 — Architettura, configurazione e immagine originale

Data: 2026-11-09. Base del motore integrata, milestone 1 ancora parziale fino alla pioggia 2.2.

## Modifica e audit

Home usa CyberpunkBackgroundEngine al posto del CityBackdrop CSS legacy, conservato non montato. Nuovi tipi/config, BackgroundImage con caricamento/errore, gradient fallback, trasformazione cover/regioni normalizzate e AnimationController indipendente con scheduler iniettabile. Nessun Canvas o RAF nella base statica e nessun effetto nuovo ancora implementato. Config Balanced predisposta, ogni effetto off fino alla propria microfase. Logo resta sotto la policy riduzione/visibilità esistente, senza nuovi controlli.

Unica immagine effettiva: references/background.png, immutata; assets/cyberpunk-background.png è identica (SHA-256 registrato nel README tecnico). Video presente assets/cyberpunk-motion-reference.mp4 solo riferimento, nessun import/player. Runtime ancora solo React/React DOM; nessuna dipendenza aggiunta. Contratti e limiti in src/features/background/README.md. La regione ologramma iniziale è provvisoria, nessuna maschera calibrata o animazione dichiarata.

## Controlli eseguiti

- `npm run check`: lint, TypeScript strict, 91 test e build produzione OK. 12 nuovi test per config/coordinate/rendering e controller; test di cadenza, loop unico, stop/resume senza tempo nascosto, delta limitato, dispose, errore renderer e timing invalido.
- `npm run lint` rieseguito dopo aggiornamento script browser.
- `node scripts/verify-shell.mjs`: screenshot 1920×1080, 3840×2160, 390×844 e misure senza overflow orizzontale, né verticale TV. D-pad fra rail/watch/HDMI/domotica, Enter simulato e Back mantenuti.
- Immagine decodificata a ogni viewport, object-fit cover e pointer-events none verificati; nessun Canvas, video, pioggia CSS o navetta aggiuntiva nella Home.
- Riduzione sistema cambia live il permesso del motore e ferma logo; vecchio storage non influisce. Il motore dichiara renderer statico anche quando motion=allowed: non simula effetti ancora assenti.
- Errore caricamento immagine indotto a runtime: avviso presente, img rimossa, gradiente preservato e focus app ancora funzionante; screenshot missing-image-fallback.png. L'errore di rete intenzionale non viene dichiarato una prova di console priva di errori.
- `git diff --check`: OK. Nessuna prova su LG G5 o dichiarazione prestazionale.

## Confronto visivo

Ispezionati shell-1920x1080.png, shell-3840x2160.png e missing-image-fallback.png. Confrontati con riferimenti 00/01 già ispezionati e layout Home unica approvato. Stessa città, crop centrato, camera ferma e scrim di contrasto; rail/tre widget/logo/orologio restano nella composizione precedente. Nessun menu o controllo movimento reintrodotto. Il fallback usa solo gradiente, senza immagine arbitraria.

Differenze residue preesistenti: brand canonico differente dal disegno nel concept, card demo con simboli neutri, due switch invece di quattro controlli domotici, contenuto watch originale fittizio. Menu assente per esplicita modifica utente. La scena del nuovo motore è temporaneamente statica (effetti implementati nelle microfasi seguenti), nessuna fedeltà animata completa dichiarata.

## Ripresa

2.2: collegare pioggia Canvas al controller, gestendo resize/DPR, errori context, stop/dispose con policy sistema/visibilità. Nessun RAF quando effetto off o Canvas non disponibile. Non implementare ancora nebbia/neon/ologramma/particelle. Test durata/prestazioni e G5 restano nelle fasi previste, non verificati in 2.1.
