# StefCors GL1tCh 0S — Stato e passaggio tra IDE

Ultimo aggiornamento: 2026-11-09.

## Microfase 3.1 completata — 2026-11-09

**Versione locale0.3.0, fase3 aperta; prossima3.2 — Pointer e simulatore telecomando, non avviata.** Base locale `4d1ca97` (fase2 completata), working tree inizialmente pulito. Nessun nuovo blocco identificato. Questo riepilogo prevale sullo storico; nessun commit, tag, release, push o deploy.

Ambito confermato dall'utente: dialoghi informativi Demo per avvio app e Riprendi; HDMI/domotica invariati. `ActionDialog` nativo e condiviso, label/descrizione accessibili, Home inerte, focus su Chiudi, Tab/Shift+Tab/frecce nel modale. Back/Escape/OK/Enter o Chiudi chiudono un solo livello e ritornano all'origine tramite ID; origine non disponibile → prima app utilizzabile, poi altro controllo disponibile. Il secondo Back torna alla prima app Home. Autorepeat ignorato. Feedback inline conservato, nessuna sostituzione del modale da risultati tardivi e nessuna coda. Senza showModal resta il feedback inline; motore, tarature, API e dati Demo invariati. Package/lockfile/README allineati a0.3.0, nessuna dipendenza aggiunta.

**141 test in21 file, lint/typecheck/build OK** sulla0.3.0. Edge Windows produzione/dev: flussi app/widget, focus confinato/ritorno/fallback, tasti, backdrop, richieste concorrenti, resize1080p/4K/mobile, showModal assente, convivenza col pannello non modale e regressioni Home/background OK; `runtimeErrors=[]`. Nuovo helper browser `scripts/verify-dialogs.mjs` richiamato dal collaudo Home;6 test unitari policy ritorno focus. Primo typecheck corretto per nativeEvent.isComposing; primi browser run fermati perché CDP Windows trasmette Back come tasto vuoto, poi corretta l'erogazione del test. Escape/Enter/Backspace sono CDP, gli alias telecomando sono KeyboardEvent DOM sintetici; nessun Magic Remote reale verificato.

Screenshot Home/dialoghi1080p/4K/mobile ispezionati, riferimenti00/01 confrontati; composizione Home preservata e modale coerente con tema, differenze pregresse ancora esplicite. PNG verificato immutato. [Rapporto3.1](docs/verification/phase-3.1/report.md), evidenze finali in docs/verification/phase-3.1/complete/. Nessuna nuova prova prolungata o profiling allocazioni: storico2.9/2.10 separato. Limiti: nessun screen reader/dispositivo TV, altri browser o compatibilità dialog webOS certificati. Non avviare3.2 o hardware senza istruzione.

## Microfase 2.10 completata — 2026-11-09 (storico)

**Fase 2 e cinque milestone del motore browser completate. Versione locale 0.2.0. Prossima 3.1 — Overlay e Back, non avviata.** Questo riepilogo prevale sullo storico seguente. Nessun nuovo blocco identificato; firmware/webOS e accesso G5 restano gate futuri. Nessun commit, tag, release, push o deploy.

Base `7d39aea` con modifiche locali della2.9 presenti e preservate. Rimossi CityBackdrop.tsx/city.css duplicati e non importati; conservati asset/generatore per provenienza e FlyingVehicleEngine opzionale non montato. BackgroundCanvas libera immediatamente RAF, listener/observer, buffer e sprite su errore/contextlost, con cleanup idempotente anche se clearRect fallisce. PNG/layer CSS indipendenti disponibili, nessun retry automatico; recupero con nuova config/remount. Nessuna variazione di layout, tarature, maschere, logo, policy o adapter.

Versione0.2.0 in package.json/lockfile/README; nessuna dipendenza aggiornata. Collaudo con fixture effetti/motore/immagine, errori iniettati e navigazione nel fallback. Output predefinito sicuro con timestamp, invece della vecchia cartella phase-2.8. Primo run interrotto per riferimento del probe all'img precedente all'unmount intenzionale, poi corretto e ripetuto con successo; dettagli nel rapporto.

**135 test in20 file, lint/typecheck/build OK**, ripetuti sulla0.2.0. Edge156 Windows: Home/profili/pannello, effetti off, Canvas assente, errori draw/cleanup/contextlost sintetico, sorgente assente/recupero, resize, reduced motion/visibilità, D-pad/OK/Back e focus OK; errori runtime raccolti vuoti. Dopo errore Canvas:0 RAF/sprite e buffer1×1, restano solo i2 resize listener/observer dei layer CSS. Effetti/motore off ed Eco/unmount: zero risorse del motore. Produzione senza pannello/fixture/vecchia scena.

Prova produzione **300.035ms** con30 campioni:29,99–30,02draw/s, CPU medio Canvas0,331–0,392ms/max0,8ms; un RAF/Canvas,5 sprite e3 resize listener/observer stabili. Heap dopo GC14.022.416→14.062.660byte (+40.244, circa0,29%); nodi/listener CDP invariati, nessuna crescita incontrollata osservata. Stress30 profili/resize e120 slider riuscito. Finestre CSS solo contatori main thread, non GPU. Profiling allocazioni2.9 resta storico separato, non ripetuto.

Screenshot1080p/4K e fallback ispezionati con PNG/riferimenti00/01; composizione preservata, differenze di header/loghi Demo/pannelli documentate, nessuna piena fedeltà visiva dichiarata. PNG verificato immutato. [Rapporto2.10](docs/verification/phase-2.10/report.md), evidenze finali in docs/verification/phase-2.10/final/. Limiti: cinque minuti locali, GPU disattivata, guasti simulati e heap dopo GC non certificano G5 o assenza assoluta di leak. La prossima3.1 riguarda overlay/Back, senza anticipare hardware o privilegi.

## Microfase 2.9 completata — 2026-11-09, Windows (storico)

Punto di ripresa registrato a fine2.9: **2.10 — Integrazione definitiva e validazione**; attività ora completata, usare il riepilogo2.10 sopra. A quel checkpoint erano complete fasi0/1 e2.1–2.9, senza nuovi blocchi. Le verifiche seguenti restano lo storico della2.9.

Base locale `7d39aea`, working tree inizialmente pulito. Windows 11 Pro N 10.0.26300 x64, i9-9900KF, Node24.22.2/npm11.19.1, Edge156.0.4314.58. Installazione da lockfile riuscita; modulo npm autorizzato dall'utente dopo NVM4306. Nessun aggiornamento dipendenze: npm segnala 10 vulnerabilità moderate, non corrette automaticamente.

Corretto `AnimationController`: residuo scadenze conservato e delta simulazione separato, senza recuperi a raffica. Il test riproduce 200 draw/10s prima della correzione, circa 300 dopo. Canvas, pool, profili, policy sistema/visibilità e tarature approvate invariati. Collaudo esteso con STABILITY_MS/ALLOCATION_MS opt-in; nessuna dipendenza aggiunta.

Baseline sul nuovo PC:132 test/check e browser OK, fixture22,19 draw/s. Finale: **134 test in20 file, lint/typecheck/build OK**, lint finale e diff check OK; Edge Home/profili/pannello/fallback/resize/reduced motion/visibilità/D-pad/Back OK, errori raccolti vuoti. Stress:30 transizioni profilo/resize,120 variazioni slider e cleanup senza duplicazioni. **Home produzione per300.032ms**,30 campioni29,98–30,02draw/s, CPU medio Canvas0,272–0,342ms/max osservato0,9ms. Un RAF/Canvas,5 sprite,3 listener resize/observer stabili; zero risorse del motore in Eco/unmount. Heap dopo GC13.884.680→13.925.580byte (+40.900); nodi/listener CDP invariati. Finestre CSS on/off misurano solo main thread, non GPU.

Allocazioni campionate per15.018ms:5.394.248byte, soprattutto nei draw; pool fissi non significano zero allocazioni JS transitorie. Nessuna crescita incontrollata osservata nella durata provata. Screenshot finali1080p/4K ispezionati con riferimenti00/01: composizione preservata, differenze preesistenti documentate, nessuna fedeltà completa dichiarata. PNG verificato immutato.

Rapporto e comandi: [2.9](docs/verification/phase-2.9/report.md), evidenze baseline/final/allocation separate. Nessun commit/push/deploy o test TV. Limiti: headless con GPU disattivata, campionamento JS e GC forzata non misurano tutta la memoria/GPU; cinque minuti locali non certificano G5,30fps reali o assenza assoluta di leak. Prossimo lavoro solo2.10 secondo ROADMAP, senza anticipare hardware o privilegi.

## Passaggio su un altro PC — 2026-11-09

Guida operativa: [docs/HANDOFF.md](docs/HANDOFF.md); avvio e prompt IDE: [START_HERE.md](START_HERE.md). Sessione solo documentale richiesta prima di cambiare PC: la2.9 resta `DA FARE`, nessuna attività implementativa avviata.

All'inizio del passaggio: ramo main, commit6fb0e09 (fase2.8 completa), working tree pulito; asset, sorgenti, lockfile e rapporti tracciati. Gli aggiornamenti documentali correnti devono essere inclusi nel trasferimento. Stato remoto/push non verificato, nessun commit/push eseguito. Reinstallare con npm ci sul PC di destinazione; non servono .env o SDK webOS per il mock.

Verifica ripetuta sulla macchina attuale: npm run check OK,132 test in20 file, lint/typecheck/build. Non ripetuti Chrome, installazione da zero o test su un altro sistema operativo in questo passaggio. I browser check documentati restano quelli della2.8. Registro dettagliato in [rapporto handoff](docs/verification/handoff-2026-11-09.md).

Decisione esplicitamente confermata dall'utente dopo2.8: i profili vengono usati in produzione; sceglieremo un profilo/tarature fissi dopo test TV. Per ora Balanced, nessun menu nella versione finale e nessun auto-degrado. Il pannello tecnico resta solo sviluppo con opt-in.

## Stato verificato

Il repository contiene lo scaffold React + TypeScript strict + Vite, tema neon e shell TV 16:9 con logo canonico e fallback statico/testuale. Header con brand e orologio locale; menu sezioni rimosso su richiesta utente; rail demo e Continua a guardare implementati; ingressi e domotica demo implementati. Lo sfondo include il PNG originale, pioggia Canvas, nebbia CSS a due veli, neon localizzati, volto olografico mascherato e 40 particelle ambientali; vecchio CityBackdrop/CSS rimossi in2.10 e nessuna navetta montata. Animazioni fisse senza controlli utente; reduced motion di sistema e pagina nascosta applicati automaticamente. Sono presenti ESLint, Vitest (141 test) e adapter mock tipizzato condiviso, collegato al catalogo e all’avvio demo. Navigazione a frecce/OK/Back disponibile tra rail e widget demo; nessun menu superiore o controllo movimento.

- Microfase attiva: nessuna.
- Prossima microfase: `3.2 — Pointer e simulatore telecomando` in `ROADMAP.md`.
- Microfasi implementative completate: `0.1`, `0.2`, `0.3`, `0.4`, `1.1`, `1.2`, `1.3`, `1.4`, `1.5`, `1.6`, `1.7`, `1.8`, `2.1`, `2.2`, `2.3`, `2.4`, `2.5`, `2.6`, `2.7`, `2.8`, `2.9`, `2.10`, `3.1`.
- Fase 1: chiusa su approvazione esplicita dell’utente dopo debug browser e modifiche richieste.
- Bloccanti per 3.2: nessuno identificato.
- Gate futuri: firmware/webOS esatti e accesso al G5 non disponibili; integrazioni e sostituzione Home non verificate.

## Decisioni da preservare

- Nuova fase 2: Cyberpunk Animated Background Engine, specifica docs/specs/CYBERPUNK_BACKGROUND_ENGINE.md. Dieci microfasi in cinque milestone; avanzamento reale nelle verifiche e nel punto di ripresa sopra. Vecchie fasi 2→3, 3→4, 4→5, 5→6, 6→7. Storico e rapporti precedenti mantengono gli ID originali; interpretarli con questa mappa. Pannello solo sviluppo, Balanced default, PNG intatto e video solo riferimento; niente controlli nella Home finale.

- Ultima decisione utente: rimossi controllo Movimento e logo e Pausa sfondo. Nessuna impostazione manuale; vecchio storage ignorato. Animazioni automatiche salvo reduced motion di sistema/pagina nascosta. Questa regola sostituisce le precedenti preferenze persistenti.

- Riscontro utente nel debug browser: soddisfatto della UI; richiesta e applicata pulizia dei testi introduttivi sovrapposti allo sfondo in tutte le sezioni, come Home. Titoli/descrizioni restano accessibili ma visivamente nascosti; controlli e badge Demo preservati. Non dedurre da questo riscontro prove Console/Network o percorsi specifici non riportati.

- Richiesta utente: dopo 1.8, eseguire una sessione di debug interattivo browser della Home completa prima della fase 2. Il debug è già disponibile con npm run dev/DevTools; percorso in README e checkpoint in ROADMAP. Non confondere verifica headless con sessione interattiva svolta dall’utente.

- Priorità esplicita utente: massima fedeltà agli screenshot di riferimento; niente reinterpretazioni semplificate. Confrontare screenshot 1080p/4K con 00 (brand) e 01 (layout), usando background.png; registrare scostamenti. La shell/header attuale richiede ancora allineamento visivo, senza dichiarare fedeltà completa.

- Sviluppo in microfasi, una alla volta; prima preview browser con mock tipizzati.
- Stack previsto: React, TypeScript strict, Vite; niente grandi librerie o servizi senza approvazione.
- Brand esatto `StefCors GL1tCh 0S`; SVG canonico in `assets/branding/`.
- Direzione Neon City + Netrunner; riferimento branding 00, layout 01. Mockup come riferimenti, non schermate interattive.
- Tutti i dati esterni iniziali sono demo; loghi applicazioni autentici con provenienza o fallback neutri.
- Nessuna autorizzazione a root, patch, intercettazione Home o override di avvio.
- Richiesta utente: mantenere nel README tutte le operazioni per il deploy sulla TV. Sezione già predisposta come non verificata; completarla con comandi ed esiti reali durante 4.1–4.4.

## Ripresa operativa

1. Leggere `START_HERE.md`, `docs/HANDOFF.md` e i documenti nell'ordine indicato; eseguire la baseline nel nuovo ambiente prima di confrontare prestazioni.
2. Controllare file reali, `git status` e differenze locali: questo documento non sostituisce il codice.
3. Riprendere3.2 — Pointer e simulatore telecomando secondo ROADMAP, preservando dialoghi, ritorno focus e Home unica. Motore2.1–2.10 e overlay3.1 completati in browser, risultati e limiti nei rispettivi rapporti. Mantenere mock, Balanced, PNG e policy; distinguere input CDP, alias sintetici e telecomando reale non verificato. Non anticipare hardware o privilegi.
4. Eseguire le verifiche disponibili e annotare comandi, esiti e limiti. Non dichiarare test TV o browser eseguiti senza averli eseguiti.
5. Aggiornare stato, prossimo passo e storico in questo file, più roadmap e documentazione interessata.

## Verifiche attuali e limiti

- 2.8: HomeBackground con import lazy dev/opt-in ?backgroundDebug=1 e pannello inizialmente chiuso; stato/config isolati in BackgroundWorkbench. Cinque slider, profilo, glitch e reset; valori canonici validati e conteggi effettivi espliciti. Niente storage, produzione ignora query e rimuove pannello/CSS. npm run check OK:132 test, lint/typecheck/build; Chrome completo Home+profili+pannello OK, tastiera/ESC/reset/reload/reduced motion/mobile verificati; runtimeErrors=[] e screenshot ispezionati. Rapporto docs/verification/phase-2.8/report.md. Milestone4 chiusa, nessuna prova G5.

- 2.7: resolver puro con cap Canvas/DPR/fps e pool, Balanced invariato, Cinematic291/80 di default, Eco statico. Monitor Canvas senza RAF extra, cleanup libera anche buffer1×1. npm run check OK:127 test, lint/typecheck/build; Chrome produzione + fixture Vite StrictMode OK. Cinque cambi profilo: un Canvas/RAF e3 listener/observer in animazione, zero in Eco/unmount, stesso nodo img durante i cambi. Campione headless21.84draw/s su2014ms, CPU medio.761ms/max1.7ms: misura locale, non garanzia30fps né dato G5. Runtime errors vuoti; screenshot Home4K e profili ispezionati. Rapporto docs/verification/phase-2.7/report.md.

- 2.6: 40 particelle in pool fisso con sprite cyan/magenta e deriva lenta; condividono Canvas, RAF, budget e cleanup con pioggia. Modulo veicoli standalone non montato, off di default, richiede asset separato. npm run check OK: 117 test, lint/typecheck/build; Chrome OK con particelle isolate diagnostiche, movimento, pausa, resize, fallback e regressioni ologramma/Home. Screenshot 1080p/4K ispezionati, runtimeErrors=[]; rapporto docs/verification/phase-2.6/report.md. Milestone 3 completata; nessuna prova G5.

- 2.5: HologramLayer localizzato sul pannello destro con mask poligonale, scanline/sweep/luminosità e brevi copie colore/bande PNG traslate. Cover mapping condiviso e hook resize riutilizzato da neon; off/asset assente/glitch false/frequenza zero gestiti. Neon ora semicicli 3.6–7.92s, intensità invariata. npm run check OK: 110 test, lint/typecheck/build. Chrome finale OK: mapping/maschera/scanline/RGB/pausa e regressioni Home, screenshot 1080p/4K ispezionati; rapporto docs/verification/phase-2.5/report.md. Nessun test G5.

- 2.4: NeonLayer localizzato con 5 insegne e 2 riflessi normalizzati, mapRegion sul PNG realmente caricato, pulizia observer/listener e off/zero/asset assente. Cicli CSS lievi e cali occasionali 18% senza flash; PNG immutato. npm run check OK: 104 test, lint/typecheck/build. Pioggia/nebbia mantengono la taratura su feedback utente. Chrome completo e confronto screenshot 1080p/4K riusciti, runtime errors raccolti vuoti, mapping/pulsazione/pausa verificati. Report docs/verification/phase-2.4/report.md.

- Feedback preview: utente non percepiva gli effetti. Corrette scie troppo sottili, layering sotto scrim e nebbia prevalentemente dietro widget. Ordine effetti ora sopra scrim e sotto UI; alpha/tratti rafforzati, nebbia più alta e drift più percepibile. Policy sistema/visibilità invariata. Utente conferma di non aver attivato riduzione movimento: la segnalazione riguarda la visibilità della taratura, non un blocco di sistema confermato.

- 2.3: collaudo Chrome completo riuscito (timeline/ciclo, visibilità/reduced motion, pioggia/fallback e Home). Screenshot 1080p/4K ispezionati; report docs/verification/phase-2.3/report.md. FogLayer a due gradienti trasparenti, CSS transform/opacity, regione inferiore, cap opacità e cicli alternate. Config enabled/density/speed, off/zero-density non montati e speed zero statico. Nessun Canvas/RAF/listener aggiuntivo. npm run check OK: 99 test e lint/typecheck/build. Nessuna prestazione G5 dichiarata; evidenze in docs/verification/phase-2.3/.

- 2.2: Chrome verifica pixel animati, budget resize 4K/DPR2, visibilità emulata, reduced motion live e Canvas nullo; screenshot ispezionati. Rapporto docs/verification/phase-2.2/report.md. Primo effetto Canvas RainEngine + BackgroundCanvas integrato. Pool fisso, sprite precalcolati, cap buffer Full HD/DPR, target 30fps, resize/cleanup e fallback senza context. Pioggia off con reduced motion/pagina nascosta; logo policy invariata. npm run check OK: 95 test, lint/typecheck/build. Nessuna misura G5. Evidenze browser e screenshot in docs/verification/phase-2.2/.

- 2.1: Chrome e screenshot 1080p/4K/mobile verificati, inclusi fallback immagine e navigazione; rapporto docs/verification/phase-2.1/report.md. CyberpunkBackgroundEngine integrato, base immagine statica/config tipizzata/fallback/coordinate cover/controller RAF testato. Nessun RAF istanziato finché non esistono effetti: renderer statico anche con animazione consentita. Vecchie pioggia/nebbia/navette CSS non montate. Logo mantiene policy sistema/visibilità. `npm run check`: 91 test, lint/typecheck/build OK. Specifiche/config in src/features/background/README.md; effetti e profili effettivi ancora da implementare.

- 1.8: Impostazioni con movimento ridotto globale e consenso animazione logo, salvati in localStorage (glitchos.motion.v1). Preferenza sistema prioritaria, aggiornamento live, pagina nascosta ferma sfondo e seleziona logo statico. Riduzione utente disabilita anche transizioni CSS. Pausa sfondo resta separata e volatile. Errori storage gestiti con avviso sessione. `npm run check`: 78 test, lint/typecheck/build OK. Evidenze in docs/verification/phase-1.8/report.md; debug interattivo con utente ancora da svolgere.

- 1.7: SmartHomeWidget Home con luce/presa demo e role switch/aria-checked. Comandi tramite smartHome.setState, nessun aggiornamento ottimistico, blocco concorrenza e risposte dopo smontaggio ignorate. Stato mock conservato tra sezioni, azzerato su reload. Errori, capability assenti e lista vuota distinti. `npm run check`: 74 test, lint/typecheck/build OK. Evidenze browser in docs/verification/phase-1.7/report.md. Nessuna Home Assistant o domotica reale; sezione Domotica ancora introduttiva.

- 1.6: widget Home con HDMI 1/2/3 e TV demo, stato attivo aggiornato solo dopo successo adapter, lock contro comandi concorrenti e feedback accessibile. Il cambio sezione rilegge lo stato mock; reload pagina lo azzera. Sezione Ingressi ancora introduttiva; nessuno stato o cambio HDMI reale. `npm run check`: 69 test, lint/typecheck/build OK. Evidenze browser in docs/verification/phase-1.6/report.md.

- 1.5: `npm run check` OK (64 test e build). Continua a guardare usa solo Neon District demo (80 min, posizione 38 min, 47,5%, 42 min rimanenti), miniatura da background.png approvato e feedback senza playback. Nessuna integrazione con storico streaming.
- Nuova zona widgets sotto il rail. Down raggiunge watch-neon-district, Up torna alla card ricordata; il widget è presente solo in Home. Messaggio di azione locale al componente, azzerato uscendo da Home; progresso demo immutato.
- Evidenze aggiornate in docs/verification/phase-1.5/report.md. Debug browser interattivo a fine fase 1 pianificato ma non ancora svolto con l’utente.

- 1.4: `npm run check` OK: lint, typecheck, 58 test e build. 21 nuovi casi per grafo e tasti. Browser: percorso a sole frecce/Enter, OK, repeat ignorato per attivazioni, focus stabile durante clock/lancio, memoria, regioni nascoste e controllo disabilitato saltati, ritorno Home, recupero focus, controllo pausa raggiungibile.
- Nuovo src/navigation/: focusGraph.ts e useTvFocus.ts. Grafo header → controls (se disponibile) → rail, bordi senza wrap, memoria per zona; nessun autofocus al caricamento, primo tasto direzionale aggancia la sezione header corrente. Back torna Home; dialoghi e cronologia delle sezioni saranno estesi in 3.1.
- Grafica 1.3 preservata: confronto screenshot 1080p/4K, evidenze in docs/verification/phase-1.4/report.md. Nessuna API telecomando webOS o intercettazione di Home; tasti effettivamente consegnati dal G5 ancora da verificare.

- 1.3: `npm run check` OK (37 test e build). Nuovi test per catalogo, capability assenti, catalogo vuoto, errori/rejection e avvio simulato senza falso successo. Browser: avvio con Enter, focus conservato, selezione conservata tra sezioni, 7 card e layout 1080p/4K/mobile.
- Rail in features/apps con fallback neutri originali, cornici smussate doppie cyan/magenta e stato demo visibile; istanza MockPlatformAdapter in App.tsx. Hero promozionale nascosto visivamente solo in Home per liberare la città come nel riferimento.
- Evidenze e confronto visivo: docs/verification/phase-1.3/report.md. Nessuna fedeltà completa dichiarata: loghi reali mancanti, header ancora da rifinire e widget non implementati. Nessuna integrazione TV o nuova dipendenza.

- 1.2: `npm run check` OK, 31 test e build. Browser: selezione delle cinque sezioni, aria-current unico, focus conservato dopo Enter, orologio coerente con il browser e aggiornato, layout 1080p/4K/mobile. Evidenze in docs/verification/phase-1.2/report.md.
- Header: ShellHeader e definizioni sections.ts; pulsanti nativi con aria-controls sul main, contenuto introduttivo per ciascuna sezione e widget solo nella Home. LocalClock usa Date/Intl locale, timer 1s e aggiornamento su visibilitychange; nessun meteo o dato TV reale.

- Correzione 1.1: `npm run check` OK (29 test, lint/typecheck/build). Sfondo PNG dell’utente importato direttamente e distribuito da Vite; nessuna nuova dipendenza. I due skyline vettoriali precedenti sono conservati come storico, non usati dalla UI.
- Verifica Chrome: layout 1080p/4K/mobile, SVG caricati, reduced motion e pause manuale/visibilitychange, timeline navette e fallback grafico. Evidenze aggiornate in docs/verification/phase-1.1-background/report.md. L’evento visibilitychange è emulato, non una prova sul ciclo di vita webOS.
- Animazioni CSS deterministiche 43/67s per le navette, 56s foschia; nessun frame React. Il PNG resta fermo, inclusi i veicoli già dipinti; solo le navette aggiunte e gli effetti separati si animano. Pausa sfondo non ferma il logo, che conserva la sua policy separata.

- 0.4: `npm run check` OK (21 test, lint/typecheck/build). Verifica browser riproducibile con `node scripts/verify-shell.mjs`; rapporto docs/verification/phase-0.4.md.
- La shell include focus manager D-pad e controlli nativi Tab/Enter/Spazio. Impostazioni persistenti del movimento restano in 1.8 e pausa idle/dimming in 3.3. Leggibilità da divano e prestazioni G5 non verificate.

- 0.3: `npm run check` riuscito (lint, typecheck, 21 test e build). Nessuna integrazione UI dell’adapter ancora effettuata. Lo stato mock è volatile; non contiene meteo, progresso streaming, firmware o dati TV reali. Domotica limitata a switch booleani.

- Letti tutti i documenti del kit, codice SVG e anteprima HTML; ispezionati i cinque PNG.
- 0.4: SVG collaudato in Chrome headless standalone (timeline per due cicli, reduced motion) e caricamento via immagine nella shell; nessun collaudo webOS/Edge. Variante statica derivata selezionata da picture per reduced motion.
- Installazione npm e `npm ci` riuscite; installazione pulita da lockfile e build verificate in cartella temporanea con cache locale.
- `npm run build`: OK (TypeScript strict senza emissione + Vite, 16 moduli trasformati).
- `npm run dev -- --host 127.0.0.1 --strictPort`: avvio OK; GET pagina e modulo React trasformato riusciti via HTTP sulla porta 5173.
- 0.4: build verificata in Chrome headless a 1080p/4K (niente overflow) e 390×844 (scorrimento verticale previsto); screenshot ispezionati e misure salvate in docs/verification/. Fallback testuale del logo verificato a runtime. Preview di questa sessione su http://127.0.0.1:5187/; riavviare secondo README se non disponibile.
- 0.2: `npm run check` riuscito: lint senza warning, typecheck strict, 2 test Vitest superati e build. Test in Node tramite rendering statico, senza simulazione DOM; focus e navigazione ancora da implementare e testare.
- Ambiente: Node 24.22.2, npm 11.19.1; React/React DOM 19.3.1, Vite 8.3.6, plugin React 6.2.1, TypeScript 6.0.3, ESLint 10.14.0, typescript-eslint 8.72.1 e Vitest 5.1.0. TypeScript vincolato a ~6.0.0 per compatibilità peer del linter; non forzare installazioni incompatibili.
- Sandbox: download npm e apertura/accesso porta locale hanno richiesto escalation; nessuna modifica alle API TV.
- npm 11 segnala lo script opzionale fsevents non approvato; installazione e build riescono senza abilitarlo.
- Nessun test sul dispositivo LG eseguito.

## Storico sintetico

### 2026-11-09 — Neon più rapidi e 2.5 ologramma

- Richiesta utente: effetto neon ora approvato, aumentare un poco la velocità e procedere 2.5. Semicicli ridotti del 20% senza cambiare intensità, regioni o pioggia/nebbia.
- Aggiunti HologramLayer/hologram.css, policy/layout e sei test; mask configurabile con coordinate calibrate, RGB locale, bande distorsione e scanline. Estratto useBackgroundViewport condiviso per resize/cleanup.
- PNG originale immutato; cap glitch a periodo6s, effetti nascosti/fermi con policy ridotta o pagina nascosta, nessuna UI impostazioni aggiunta. Prossima 2.6.


### 2026-11-09 — Neon più marcati su richiesta

- Default intensity 70→100; gain insegne .4→.6 e riflessi .16→.28. Minimo pulsazione .3→.12 e semicicli 4.5–9.9s, per escursione ben visibile senza flash rapidi. Regionamento, interferenze rare, pioggia/nebbia invariati.
- npm run check OK: 104 test, lint/typecheck/build. Chrome finale OK, range pulsazione e screenshot picco/4K ispezionati; evidenze docs/verification/neon-strength/report.md. Prossima 2.5 invariata.


### 2026-11-09 — 2.4: neon e illuminazione localizzata

- Aggiunti NeonLayer/neon.css e cinque test; NeonRegion tipizzato con id/color/kind e validazione regioni/ID univoci. Default neon attivo con 5 aree insegne e 2 riflessi acqua, escluso volto.
- BackgroundImage comunica dimensioni ed errore, motore inoltra al neon; cover/resize allineati senza RAF o rerender UI. Cicli respiro CSS e interferenza solo come lieve calo; no filtri o blend. Prossima 2.5, milestone 2 nebbia+neon completata con collaudo Chrome e confronto screenshot.


### 2026-11-09 — Densità nebbia aumentata su riscontro preview

- Utente conferma pioggia visibile e nebbia ancora tenue. Solo fog.density default 35→65, test aggiornato a opacità .5525; posizione, velocità e pioggia invariati. npm run check OK (99 test, lint/typecheck/build); Chrome completo e confronto visivo 1080p/4K OK, rapporto docs/verification/fog-density/report.md. Prossima 2.4 invariata.


### 2026-11-09 — Correzione visibilità effetti

- Ricevuto riscontro utente: pioggia/nebbia non percepibili nel debug. Migliorati tratto/alpha pioggia e visibilità nebbia, spostati layer sopra lo scrim del PNG mantenendoli dietro UI. Nessuna fase successiva iniziata.
- Chrome e confronto screenshot 1080p/4K riusciti; campione pioggia con 10244 pixel alpha>=20 e picco171/255. Rapporto docs/verification/effect-visibility/report.md. Riscontro browser utente dopo correzione ancora da raccogliere.
- Test fog aggiornati ai valori calibrati; npm run check OK (99 test, lint/typecheck/build). Nuovo controllo browser misura anche pixel sufficientemente visibili, non solo movimento. Evidenze docs/verification/effect-visibility/.


### 2026-11-09 — 2.3: nebbia atmosferica

- Aggiunti FogLayer.tsx, fog.css, engine/fogPolicy.ts e quattro test per densità/timing, disattivazione e statico. Config fog.enabled ora true, nessun altro effetto nuovo.
- Veli inferiori cyan/magenta, semiperiodi iniziali 120/170s (poi calibrati a 60/85s), continuità alternate e pausa con policy sistema/visibilità. Pioggia/PNG/focus preservati. Prossima 2.4; milestone 2 ancora parziale.


### 2026-11-09 — 2.2: pioggia Canvas

- Aggiunti RainEngine, BackgroundCanvas e quattro test: budget, pool/profondità/resize, off/speed zero/intensity zero e riciclo in simulazione prolungata. Default rain.enabled ora true; nessun altro effetto attivato.
- Controller RAF con cleanup alla policy/config/smontaggio, sprite riutilizzate, fallback su context assente/perdita/errori. Buffer massimo Full HD indipendente dalla UI 4K. Milestone 1 architettura+originale+pioggia completata; prossima 2.3.


### 2026-11-09 — 2.1: architettura e background originale

- Aggiunti CyberpunkBackgroundEngine, BackgroundImage, config/tipi, CSS base, coordinate e AnimationController indipendente da React; shell collegata al modulo nuovo senza riscrivere widget.
- Default Balanced e opzioni validate, effetti inizialmente off, no loop vuoto, fallback immagine con avviso. Controller testato con scheduler simulato per frame duplicati, delta, stop/resume e dispose. Dodici nuovi test, 91 totali.
- Asset PNG immutato; copia assets/cyberpunk-background.png identica verificata tramite SHA-256, non sostituita. Video solo riferimento, non riprodotto. Prossima 2.2; milestone 1 completa solo dopo pioggia.


### 2026-11-09 — Pianificata nuova fase 2: motore background

- Inserita specifica utente e microfasi 2.1–2.10 con cinque milestone, acceptance e vincoli performance/Canvas/fallback. Fasi successive rinumerate 3–7; deploy README aggiornato alla fase 4.
- Confermati PNG originale e video assets/cyberpunk-motion-reference.mp4 presente, non riprodotto né assunto come asset principale. Nessuna libreria nuova o modifica sorgenti/runtime.
- Prossima nuova 2.1; fase 1 resta chiusa. Verifiche documentali: numerazione, collegamenti locali e git diff --check; test applicativi non rieseguiti perché nessuna modifica codice.


### 2026-11-09 — Chiusura fase 1 approvata

- Utente richiede esplicitamente di considerare chiusa la fase 1 dopo riscontro browser e correzioni layout. Roadmap e punto di ripresa aggiornati: prossima 2.1, non iniziata.
- Stato approvato: Home unica senza menu superiore, senza testi promozionali sulla scena o controlli movimento; animazioni automatiche, mock e badge Demo.
- Restano valide le evidenze precedenti (79 test, lint/typecheck/build e Chrome) e i limiti hardware/visivi documentati. Nessun controllo manuale Console/Network aggiuntivo dichiarato. Sessione solo documentale, verifica git diff --check.

### 2026-11-09 — Animazioni fisse senza controlli

- Rimossi disclosure/preferenze e pausa dalla shell; hook non legge né salva più preferenze locali. Logo e sfondo automatici, riduzione sistema e visibilità preservate.
- npm run check OK: 79 test, lint/typecheck/build. Chrome e confronto screenshot 1080p/4K riusciti; vecchio storage ignorato e riduzione sistema live confermati.
- Rimosso componente MotionSettings, aggiornati rendering test e collaudo Chrome per assenza controlli, vecchio storage ignorato e reduced motion live. Evidenze in docs/verification/fixed-motion/.


### 2026-11-09 — Home unica richiesta dall’utente

- Eliminato menu superiore; app, ingressi e domotica sempre disponibili nella Home. Preferenze movimento in details/summary dalla scena, senza cambio pagina.
- Focus iniziale/Back sulla prima app; Escape chiude le preferenze. Nuova zona settings solo quando aperta; observer gestisce chiusura details. Nessuna perdita di stato mock per navigazione.
- Verifica Chrome Home unica riuscita su 1080p/4K/mobile e D-pad; screenshot ispezionati, rapporto docs/verification/one-page/report.md.
- Script browser aggiornato per layout e percorsi Home unica; precedente script conservato esplicitamente come legacy. Riferimenti estetici conservati con eccezione del menu autorizzata dall’utente.


### 2026-11-09 — Pulizia testi delle sezioni dopo feedback browser

- Estesa la presentazione pulita Home a tutte le scene in TvShell/global.css: nascosti visivamente eyebrow, titolo e descrizione introduttivi e rimossa nota decorativa Neon City. Titolo semantico e controlli funzionali preservati.
- Verifica modifica: npm run check (lint, typecheck, 78 test e build) e git diff --check OK. Nuovi screenshot automatizzati non acquisiti in questa sessione; resa da ricontrollare nella preview utente.
- Utente soddisfatto della preview con questa correzione richiesta. Checkpoint debug resta da completare per verifiche specifiche non riferite; nessuna nuova fase implementativa iniziata.

### 2026-11-09 — 1.8: Impostazioni movimento

- Aggiunti motion/preferences.ts e test, features/settings/MotionSettings.tsx e settings.css; policy collegata a shell/header/logo. Preferenze validate e persistite, fallback se storage non disponibile.
- Riduzione sistema prevale su utente; logo statico derivato dal canonico quando vietato o pagina nascosta. Pausa sfondo non modifica preferenze logo. Quattro nuovi test (78 totali), prove Chrome di persistenza, precedenza e navigazione.
- Documenti sincronizzati; prossima attività checkpoint debug interattivo browser, non fase 2. Nessuna dipendenza o funzionalità TV introdotta.

### 2026-11-09 — 1.7: Widget domotica demo

- Aggiunti features/smart-home/{SmartHomeWidget.tsx,deviceActions.ts,deviceActions.test.ts,smart-home.css}, sostituito ultimo placeholder Home. Cornice segmentata cyan/magenta e simboli originali casa/lampadina/alimentazione.
- Due switch dal contratto esistente, con badge Demo, stato testuale, feedback accessibile e nessun falso successo su errore. Cinque test nuovi, 74 complessivi. Nessuna dipendenza, rete o modifica ai contratti.
- Script Chrome esteso per on/off, focus/bordi, memoria e persistenza tra sezioni; evidenze in docs/verification/phase-1.7/. Prossima 1.8 e successivo checkpoint debug interattivo browser.

### 2026-11-09 — 1.6: Widget ingressi demo

- Aggiunti features/inputs/{InputsWidget.tsx,inputActions.ts,inputActions.test.ts,inputs.css}; sostituito il placeholder Home e aggiunto HDMI 3 al mock per allineare le quattro sorgenti del riferimento.
- Cornice segmentata e icone originali HDMI/TV; selezione attiva magenta distinta dal focus cyan. Capability, catalogo vuoto, errori e rejection gestiti. Cinque nuovi test, 69 totali.
- Verifica browser estesa a cambio ingresso, unicità attivo, memoria focus e persistenza tra sezioni. Nessuna dipendenza o API TV. Prossima 1.7; checkpoint debug interattivo dopo 1.8 conservato.

### 2026-11-09 — 1.5 completata: Continua a guardare demo

- Aggiunti features/continue-watching/{ContinueWatching.tsx,demoWatch.ts,demoWatch.test.ts,watch.css}; sostituito il primo placeholder nella shell. Contenuto originale fittizio, miniatura dal PNG approvato, progress accessibile e cornice smussata cyan/magenta.
- Nuova zona focus widgets, sei test aggiunti tra progresso/azione e grafo. Ripresa simulata senza video, rete o alterazione del progresso.
- `npm run check`: OK, 64 test. Script browser esteso a Down/Enter/Up, focus conservato, progresso immutato e recupero lasciando Home. Screenshot e confronto in docs/verification/phase-1.5/.
- Registrata richiesta di debug browser interattivo dopo 1.8; istruzioni README e checkpoint roadmap. Nessuna dipendenza aggiunta o collaudo G5. Prossima 1.6.


### 2026-11-09 — 1.4 completata: focus manager D-pad

- Aggiunti navigation/focusGraph.ts, focusGraph.test.ts e useTvFocus.ts. Shell collegata tramite ref; header, pausa sfondo e card hanno identificativi/zone stabili.
- Frecce senza wrap, memoria per zona, skip hidden/inert/disabled, scroll nearest immediato. Invio nativo senza doppio click, OK/Accept/Select sintetizzati, ripetizioni di attivazione ignorate. Escape/Back/Backspace torna Home e focalizza il suo pulsante.
- MutationObserver recupera focus rimosso/nascosto/disabilitato; nessun reset sui normali rerender. Nessuna modifica CSS, libreria o API TV.
- `npm run check`: OK (58 test, lint/typecheck/build). Verifica Chrome estesa al percorso D-pad e focus; report/screenshot in docs/verification/phase-1.4/. Documenti sincronizzati, prossima 1.5.


### 2026-11-09 — 1.3 completata: rail applicazioni demo

- Aggiunti features/apps/{AppRail.tsx,appActions.ts,appActions.test.ts,apps.css}; ampliato catalogo mock a sette app generiche. App.tsx mantiene un’unica istanza adapter; rail montato persistente, visibile in Home/App.
- Card olografiche con cornici smussate a doppio contorno, selezione magenta, focus cyan e simboli neutri originali. Loading/error/empty e avvio non supportato distinti. Feedback live di avvio simulato, blocco chiamate concorrenti e gestione rejection.
- Home liberata dal testo promozionale; rail allineato alla fascia ~54% della superficie. Corretto overflow mobile fissando la colonna del root grid e contenendo il rail con scroll interno.
- `npm run check`: OK, 37 test. Verifiche Chrome su Enter, selezione persistente e layout; screenshot confrontati con references 00/01. Scostamenti e limiti in docs/verification/phase-1.3/report.md. Nessuna nuova dipendenza; prossima 1.4.


### 2026-11-09 — Vincolo rafforzato di fedeltà visiva

- Registrata richiesta di massima fedeltà in AGENTS e VISUAL_REFERENCE_GUIDE: confronto visivo obbligatorio e differenze residue esplicite a ogni fase visiva.
- Nessuna modifica UI o test applicativo in questa sessione; verifica documentale con git diff --check. Prossima fase 1.3 invariata, con allineamento del rail ai riferimenti approvati.


### 2026-11-09 — 1.2 completata: header, sezioni e orologio

- Aggiunti app/ShellHeader.tsx, app/sections.ts, features/clock/{LocalClock.tsx,formatClock.ts,formatClock.test.ts}; TvShell gestisce selezione e contenuti, CSS per header responsivo e stato corrente magenta.
- Pulsanti Home/App/Ingressi/Domotica/Impostazioni selezionabili con Tab/Enter/Spazio o pointer; focus conservato, main denominato dal titolo di sezione. Meteo assente. Nessun router o nuova dipendenza.
- Orologio reale del browser, formato italiano 24h, data locale e timezone del dispositivo; test per cambio giorno e ora legale. Cleanup timer/listener alla rimozione componente.
- `npm run check`: OK (31 test e build); script Chrome esteso a header/sezioni/orologio e attesa decodifica sfondo prima degli screenshot. Evidenze in docs/verification/phase-1.2/. Nessun test G5. Prossima: 1.3.


### 2026-11-09 — Correzione 1.1: sfondo scelto dall’utente

- Integrato references/background.png direttamente in city.css/Vite, sostituendo i due skyline SVG e togliendo il drift dell’immagine intera. Sorgente PNG preservata senza modifiche; provenienza: fornita dall’utente, licenza esterna non verificata.
- Conservati navette aggiuntive, atmosfera, pausa/reduced motion/visibility e fallback gradiente. Overlay attenuati per mostrare l’immagine, badge e testi protetti per contrasto.
- `npm run check`: OK (29 test e build). Evidenze browser aggiornate in docs/verification/phase-1.1-background/; il report precedente rimanda alla correzione. Nessun test hardware. Prossima fase invariata: 1.2.


### 2026-11-09 — 1.1 completata: città e navette

- Aggiornata la roadmap su richiesta utente per includere navette originali occasionali dietro la UI.
- Aggiunti features/background/CityBackdrop.tsx e city.css, due SVG città e navetta, README provenienza e generatore Python deterministico. Nessun asset copiato dai mockup o di terze parti.
- Policy/hook in src/motion per reduced motion, pagina nascosta e pausa manuale; 8 casi unitari aggiunti. TvShell include scena e pulsante pausa nativo; CSS mantiene overlay di contrasto e input separati.
- `npm run check`: OK (29 test, lint/typecheck/build). Verifica browser estesa per pausa keyboard, reduced motion, eventi visibilitychange, asset, timeline e finestre di visibilità delle due navette, fallback. Screenshot 1080p/4K/mobile e voli in docs/verification/phase-1.1/.
- Documentazione sincronizzata; nessuna prova sul G5 o benchmark fps. La pausa per inattività resta in 2.3; impostazioni complete e persistenza in 1.8. Prossimo passo: 1.2.


### 2026-11-09 — 0.4 completata: tema e shell TV

- Aggiunti themes/neon/tokens.css, components/BrandLogo.tsx e app/TvShell.tsx; aggiornati App, CSS e test di rendering per la shell.
- Superficie 16:9 scalabile, margini sicuri, testo base ~28px/56px, gerarchia header/scena/app/tre widget, fallback verticale per finestre strette. Gradiente CSS temporaneo senza asset esterni.
- SVG canonico importato direttamente; picture seleziona variante ferma derivata per reduced motion; fallback testuale su errore. Corretto artefatto iniziale di fotogrammi glitch dell’immagine SVG esterna sotto emulazione reduced motion.
- Aggiunto scripts/verify-shell.mjs senza dipendenze: Chrome headless/CDP, screenshot e misure a 1080p/4K/mobile, caricamento logo, fallback errore, reduced motion e timeline standalone per due cicli. ESLint esteso anche agli script mjs.
- `npm run check`: OK (21 test e build). Collaudo Chrome riuscito e screenshot ispezionati. Evidenze in docs/verification/, istruzioni in README; PROJECT_SPEC e START_HERE aggiornati. Nessuna prova hardware o nuova dipendenza. Prossimo passo 1.1.


### 2026-11-09 — 0.3 completata: contratti e adapter mock

- Aggiunti src/platform/contracts.ts, mock/MockPlatformAdapter.ts e mock/MockPlatformAdapter.test.ts.
- Tutte le operazioni restituiscono Promise<Result<T>>, compresi letture e discovery; provenance demo/device, errori discriminati e capability per operazione (simulated/supported/unsupported con motivo).
- Mock locale per catalogo/avvio app, elenco/cambio ingressi e switch domotici; opzioni per guasti e capability mancanti, stato isolato per istanza e risultati copiati.
- `npm run check`: OK, lint senza warning, typecheck, 21 test complessivi e build. Test adapter: successi, ID errati, stato invalido, tutte le capability assenti, errori per ogni operazione, assenza mutazioni dopo errori, isolamento e controllo fetch non invocato.
- Nessuna dipendenza aggiunta o modifica UI; nessuna API TV/rete. README e PROJECT_SPEC descrivono uso, limiti e contratti implementati; roadmap aggiornata. Prossimo passo: 0.4.


### 2026-11-09 — 0.2 completata: controlli di qualità

- Aggiunti eslint.config.js, vitest.config.ts e src/app/App.test.tsx; aggiornati script npm, lockfile, tsconfig (config test inclusa, import TS espliciti) e ignore degli artefatti.
- ESLint con regole raccomandate JS/TS, React Hooks e Fast Refresh, warning bloccanti. Vitest in Node con configurazione Vite condivisa e due test di rendering statico per brand e identificazione preview.
- TypeScript allineato da 7.0.2 a 6.0.3 (~6.0.0): typescript-eslint 8.72.1 richiede TypeScript <6.1. Nessuna modifica alla UI o alle dipendenze runtime.
- `npm run check`: OK (lint, typecheck, 2 test, build). Nessun collaudo browser/TV effettuato. Documentazione aggiornata; prossima microfase 0.3. Sezione deploy TV preservata.


### 2026-11-08 — Procedura deploy TV pianificata

- Aggiunta sezione README con l'elenco delle operazioni da documentare per il deploy standalone sul G5, dalla preparazione alla disinstallazione.
- Rafforzati i criteri di 3.2 e 3.4 per richiedere la procedura completa e verificata. Prossima microfase invariata: 0.2.
- Solo documentazione; nessun comando webOS introdotto come verificato, nessuna installazione o prova su TV eseguita.
- Verifica: `git diff --check` e coerenza tra README, roadmap e contesto.


### 2026-11-08 — 0.1 completata: scaffold eseguibile

- Aggiunti package.json/lockfile, .gitignore, index.html, tsconfig.json, vite.config.ts e src/{main.tsx,vite-env.d.ts,app/App.tsx,styles/global.css}.
- Solo React e React DOM a runtime; nessuna libreria UI, servizio di rete o funzione privilegiata. Stili statici essenziali, senza anticipare la shell 0.4.
- README, START_HERE e roadmap sincronizzati. Prossimo passo: 0.2.
- Verifiche: installazione, reinstallazione pulita in cartella temporanea, build strict e risposta HTTP del dev server riuscite; `git diff --check` senza errori. Collaudo visivo browser e TV non eseguiti.


### 2026-11-08 — Pianificazione e continuità tra IDE

- Sostituita la roadmap per macrofasi con microfasi verificabili, conservando le macrofasi 0–6.
- Creato questo registro; aggiornati START_HERE, AGENTS e README per la ripresa da qualsiasi IDE.
- Nessuna modifica implementativa o dipendenza aggiunta.
- Verifica: coerenza documentale, presenza dei file referenziati e controllo diff; nessun test applicativo disponibile.

## Regola di aggiornamento

Al termine di ogni microfase o sessione che modifica il progetto, aggiornare data, stato reale, microfase attiva/prossima, decisioni, verifiche e limiti; aggiungere una breve voce allo storico. Se il lavoro è incompleto, indicare file modificati, cosa manca e come riprendere. Registrare solo informazioni utili e mai credenziali o segreti. La roadmap tiene gli stati; questo file contiene le evidenze operative. Mantenere entrambi coerenti.


### 2026-11-09 — 2.6 particelle e predisposizione veicoli

- ParticleEngine attivo con 40 particelle, due sprite in cache e pool Float32Array; nessun loop o buffer a schermo intero aggiuntivo. Pioggia e particelle indipendenti nella config; count0/off non disegna, policy ridotta/visibilità condivisa.
- FlyingVehicleEngine standalone pronto per un futuro asset trasparente, non montato e default off. Non estrae/muove oggetti del PNG e non carica risorse; nessun nuovo controllo Home.
- 117 test e lint/typecheck/build OK. Chrome verifica particelle isolando le scie solo nel test, pausa/resize/fallback e regressioni neon/ologramma/navigation; screenshot e rapporto in docs/verification/phase-2.6/. Simulazione pool20min non equivale a sessione hardware prolungata. Prossima2.7, milestone3 completata.


### 2026-11-09 — 2.7 profili e monitor

- Balanced conserva la calibrazione approvata; Cinematic aumenta solo quantità pioggia/particelle senza intensificare glitch, Eco conserva PNG/scrim e smonta tutti gli effetti. Budget buffer espliciti maxWidth/maxHeight, validati e riducibili; nessun Canvas4K o auto-degrado.
- Monitor sul loop esistente con wall-clock reale, costo CPU e finestre2s; data attribute/callback opzionale stabile, niente UI o telemetria remota. Il campione headless21.84draw/s non soddisfa una certificazione30fps: profilazione/stabilità approfondite restano2.9, prove G5 non disponibili.
- Fixture Vite separata esclusa dal bundle produzione controlla StrictMode, risorse e stesso img su cinque transizioni. Primo giro interrotto dalla serializzazione DOM nello script CDP, corretto con risultato void; giro completo successivo superato.127 test e lint/typecheck/build OK, lint finale dopo script OK. Prossima2.8; milestone4 parte A completata.


### 2026-11-09 — 2.8 pannello tecnico di sviluppo

- Opt-in ?backgroundDebug=1 solo npm run dev, pulsante Sfondo · debug e pannello inizialmente chiuso. Lazy load escluso dalla produzione ordinaria; nessun ripristino dei vecchi controlli utente rimossi. Modifiche in memoria fino al reload; chiusura conserva valori, reset riporta default e Balanced.
- Slider validati, select profilo e glitch, riga valori effettivi; controlli canonici mai sostituiti dal config risolto. BackgroundWorkbench separato dalle card; useTvFocus lascia native le interazioni degli strumenti. ESC/Back chiude e torna alla prima app.
- 132 test e lint/typecheck/build OK; Chrome produzione con query, dev senza query e dev opt-in verificati. Profili e cleanup nuovamente collaudati con fixture StrictMode, UI desktop/mobile ispezionata. Campione monitor della fixture22.38draw/s, CPU medio.744ms/max1.9ms, solo headless. Prossima2.9; limiti e riscontri nel rapporto2.8.


### 2026-11-09 — Continuità documentale per trasferimento PC

- Nuovo docs/HANDOFF.md con requisiti, trasferimento Git/cartella, npm ci/check/dev/preview, comandi bash e PowerShell, CHROME_PATH/URL/output del collaudo e mappa dei moduli.
- START_HERE consolidato; riepiloghi correnti in README, specifiche, guide visive/animazione e README background; corretto il README asset city che indicava ancora la navetta legacy come attiva. Rapporti implementativi storici preservati.
- Chiarita la distinzione tra profili nel motore di produzione e pannello dev-only; preservati default Balanced e criteri2.9. Aggiornamento roadmap con collegamento al passaggio, senza completare fasi aggiuntive.
- npm run check ripetuto con successo (132 test); nessun codice o asset modificato. Documenti nuovi/modificati da trasferire insieme al repository; nessuna pubblicazione remota eseguita.
