# Ripresa su un altro PC — StefCors GL1tCh 0S

Aggiornato: 2026-11-11. **Fase4 completata**; punto di ripresa **5.1 — Catalogo applicazioni**, `DA FARE`.

## Stato corrente — 4.4 completata

0.4.3 installata/avviata e lasciata sulla G5, lavoro locale4.1–4.4 da preservare; nessun commit/push/root/Home/autostart/fase5. Install/update/launch, getSystemInfo reale, telecomando/focus/Demo, uscita LG/riapertura e idle/ripristino riusciti con Inspector e riscontri utente distinti. Chrome132.0.6834.207/FHD/DPR1. Dopo due ritocchi richiesti per piccoli scatti, utente accetta TV-only Canvas1600×900/179gocce/32particelle/30fps anche Demo; browser Balanced/PNG/CSS/logo invariati.179 test/check/IPK/CLI ed Edge browser/file://1080p/4K passati. Campione130s con idle45% e Canvas fermo, ripresa al primo tasto fisico e snapshot running; metriche draw indicative e screenshot nel [rapporto4.4](verification/phase-4.4/report.md). Pressione lunga/suspend lungo/riavvio/GPU/WCAG/disinstallazione/downgrade non provati. Endpoint Inspector cambia dopo riapertura e resta fuori Git; helper inspect-g5.mjs non incluso nel pacchetto. Riprendere5.1 verificando API pubbliche e permessi del catalogo/icone, senza anticipare launch5.2 o dedurre privilegi da SSH/getSystemInfo; nuovi deploy richiedono istruzione esplicita.

## Stato dopo la 4.3 (storico)

Versione **0.4.1**, fase4 aperta, lavoro locale4.1–4.3 da preservare. Adapter webOS predefinito sulla TV riconosciuta da webOSTV.js; pulsante footer Demo/TV, scelta solo di sessione, browser sempre mock. SDK ufficiale1.2.13 locale13.818byte con Apache2.0, hash/ordine/licenza verificati nel packaging. getSystemInfo pubblico legge solo tre campi opzionali, validati senza inventare dati: modello/firmware/SDK.8s/cancel/errori tradotti/retry, sei capability fase5 indisponibili con motivo e comandi senza trasporto. Manifest systemconfig.query e disableBackHistoryAPI:true; Back461 chiude prima il dialogo, poi platformBack dalla Home. Nessun Home/autostart, nuova integrazione5.x, servizio JS o dipendenza npm frontend.

178 test/25 file e check passati, IPK0.4.1 finale2.974.414byte/SHA25666d05e5aa22c5b8e01239fdc32c48f87f14d9129e8b4a31c26a89e48c32f2f21,nove file identici allo stage. Edge HTTP/file:// e bridge sintetico con SDK originale1080p/4K superati in browser-final; rifinitura etichette/leggibilità verificata dal successivo browser-release, exit0/runtimeErrors vuoto, vedere PROJECT_STATUS e [rapporto4.3](verification/phase-4.3/report.md). Nessuna installazione G5 o prova del grant effettivo/telecomando/lifecycle/GPU. Le policy visibilità/idle/reduced motion restano quelle esistenti; nessun handler launch/relaunch.

Trasferire anche webos/vendor/ con licenza, src/platform/webos/, selectPlatform/SystemInfoNotice e script packaging/test. Rigenerare IPK, non presumere hash identico. Target glitch-g5 già associato solo su questo PC; su altro PC seguire4.1 senza copiare chiavi nel progetto. Prima4.4 controllare sessione, richiedere l'istruzione esplicita per installare/avviare la nostra app; verificare campo reale/consensi, Back da modale/Home/pressione lunga, pointer/D-pad, Demo/ritorno TV, background/ripresa, viewport e prestazioni. Non usare risultati CLI o TEST TV del bridge come dati di runtime G5.

## Stato dopo la 4.2 (storico)

Versione **0.4.0**, fase4 aperta. Base553bbf8 con lavoro locale4.1 preservato, nessuna dipendenza frontend nuova/commit/push/deploy. Manifest webos/appinfo.json, icone80/130 dal canonico statico, build separata Chromium132/FHD/IIFE, CSS/URL relativi e requiredACG:[]; mock invariato e footer TV/Demo. Nessuna API Luna, servizio, Back custom o app installata sul G5. [Guida completa](../webos/README.md), [rapporto4.2](verification/phase-4.2/report.md).

Comandi npm build:webos/package:webos/verify:webos; output dist-webos/ e artifacts/ ignorati. IPK com.stefcors.glitchos_0.4.0_all.ipk,2.964.650byte,SHA256c4ed8d7c0cfaeb6064b05e78ee43460466970c208b90e94af4735cdd565b672c. Sette file app identici allo stage, --no-minify preserva Vite, CLI --check/--info superati. Trasferire webos/ e script insieme ai sorgenti; rigenerare output, senza presumere hash IPK identici fra esecuzioni.

**165 test/24 file e check finali OK**, Edge157 HTTP/file://1080p/4K con DOM/AX,14 azioni/focus/dialoghi e regressioni, runtimeErrors vuoto. Screenshot/icone ispezionati e PNG/logo invariati, differenze pregresse esplicite. Non ripetuti idle reale/soak3.5, fresh install o profiling. Nessuna prova WebAppManager/G5/WCAG/screen reader/Back461/GPU. Install/launch/inspect/rimozione app sono solo istruzioni con sintassi CLI verificata.

Riprendere4.3: API pubbliche/adapter e selezione mock/device, capability/timeout/errori, Back/lifecycle e ACG necessari da verificare. Non anticipare integrazioni5.x, privilegi o deploy. CLI3.2.6 su Node24 e target glitch-g5 associato restano su questo PC; IP/chiavi fuori Git. Su altro PC seguire4.1; verificare sessione prima delle successive prove. Nessuna pubblicazione implicita.

## Stato dopo la 4.1 (storico)

Base Git553bbf8 con lavoro locale4.1 preservato. App0.3.4 invariata; nessuna dipendenza frontend nuova, packaging o deploy. **Accesso reale confermato via system-info exit0**: modello OLED55G56LS.DPIQLJP, firmware43.21.96, SDK11.2.0. Menu utente webOS26/11.2.0-3711; Developer Mode/Key Server attivi,999h59m residui riferiti al suo checkpoint. [EvidenzaCLI](verification/phase-4.1/device-info.md). Non è ancora una prova della nostra app sul TV.

[Dossier4.1](webos/PHASE_4_1.md) con inventario, matrice API/permessi e fonti ufficiali11/11, vincoli grafica Full HD/video4K e motori web, preparazione Developer Mode/CLI/lettura informazioni. CLI3.2.6 installata globalmente con approvazione (Node>=20 nel pacchetto), versione/help verificati con Node24.22.2 fuori sandbox dopo NVM4306; nessun runtime Node o firewall trust modificati. Dipendenze transitive deprecate/lifecycle non sbloccati documentati; Accesso SSH e system-info ora riusciti; packaging/installazione app non ancora provati. Su altro PC reinstallare la CLI separatamente: non è nel lockfile frontend. Nessuna capability hardware certificata/promossa nel mock; test/check/browser3.5 restano lo storico, non ripetuti.

Su questo PC **glitch-g5** associato (getkey eseguito nel terminale utente), prisoner/9922; emulatore ancora predefinito. IP e chiave nella configurazione CLI locale fuori Git. Su altro PC installareCLI e associare il target separatamente; non trasferire credenziali nel repository. Riprendere **4.2**: manifest/icone/IPK e versione0.4.0, con target Chromium132 e grafica Full HD documentati ma da collaudare nell'app. Non implementare adapter4.3 o pubblicazione anticipatamente; verificare validità sessione prima di successive prove.

## Stato dopo la 3.5 (storico)

Versione locale **0.3.4, fase3 chiusa nel browser**, nessuna modifica runtime in3.5 o nuova dipendenza. Base4742c5e con lavoro locale3.2–3.4 preservato; nessun commit/tag/push/deploy. Nuovo `scripts/verify-mvp.mjs` e flag `MVP_TEST=1` in verify-shell per DOM/AX e percorso completo delle14 azioni Home da tastiera a1080p/4K, Tab/inverso, dialoghi/focus e30 campioni input→RAF per risoluzione. Cleanup del profilo Edge temporaneo con verifica percorso/retry limitati, senza mascherare gli errori.

**156 test in23 file, lint/typecheck/build ed Edge157.0.4341.42 completi superati**. Evidenze finali `docs/verification/phase-3.5/run-4/`, precedenti run incompleti separati. Due attese idle reali120.211/120.165ms; stati limite, offline, timeout10.211ms, pointer/simulatore e background OK. Home animata300.035ms,30 campioni29,99–30,01draw/s, risorse stabili e heap dopo GC+58.588byte (circa0,40%); nodi/listener CDP invariati. Screenshot1080p/4K ispezionati, PNG SHA invariato, runtimeErrors vuoto. Mediane focus9,4/10,5ms, P9513,9/54ms e picco4K100ms, solo keydown→RAF locale.

[Rapporto3.5](verification/phase-3.5/report.md) con comando completo, dati e differenze visive pregresse. Nessuna certificazione WCAG/screen reader/GPU/G5, fresh install o profiling allocazioni nuovo; dati/rete/input sempre mock/CDP/DOM. Conservare tutti i sorgenti/evidenze e reinstallare da lockfile sul nuovo PC.

Riprendere solo4.1: acquisire **modello esatto, firmware/webOS reali e stato Developer Mode**, verificare documentazione ufficiale aggiornata e preparare matrice capability/permessi. Questi prerequisiti non risultano ancora acquisiti. Nessun packaging4.2, adapter reale4.3, deploy, sostituzione Home o privilegio impliciti. Mock, Home unica, idle/sistema/hidden, focus/dialoghi, fallback/retry e tarature restano il riferimento verificato.

## Stato dopo la 3.4 (storico)

Versione locale **0.3.3**, fase3 aperta. App/ingressi/domotica con fallback accessibili, retry esplicito da D-pad/pointer e scadenza delle letture10s; risultati tardivi scartati dopo timeout/retry/cambio adapter/unmount. Busy/feedback isolati per adapter, nessun comando duplicato o aggiornamento ottimistico; motivi delle capability associati ai controlli. Online/offline è solo l'indizio del browser: la Demo locale continua a funzionare e non sono stati aggiunti servizi, cache o PWA.

File: `src/platform/usePlatformResource.ts`, `src/components/ResourceNotice.tsx` e test, `ConnectionNotice.tsx`, tre aree Home e focus manager. Fixture Vite `/scripts/fixtures/platform-states.html` con `src/platform/testing/PlatformFixture.tsx`, esclusa dalla build ordinaria; `scripts/verify-platform-states.mjs` richiamato da verify-shell con `PLATFORM_TEST_URL`. Nessun timeout/retry automatico dei comandi e nessuna cancellazione implicita del trasporto. Preservati PNG, brand, tarature, dialoghi, input/simulatore e idle2min/45%.

**156 test in23 file, lint/typecheck/build ed Edge completo superati**, ripetuti dopo rifiniture. Attesa reale10.206ms, recovery e scarto del successo tardivo verificati; offline CDP con avvio locale riuscito, runtimeErrors vuoto, screenshot1080p/4K ispezionati. [Rapporto3.4](verification/phase-3.4/report.md), evidenze final/ separate dal primo run. Attese idle3.3 e profiling/soak2.9/2.10 non ripetuti. Input/guasti/rete simulati: nessuna certificazione TV/Magic Remote/GPU/screen reader o piena fedeltà visiva. Nessuna nuova dipendenza, commit/push/deploy; lavoro locale3.2/3.3 preservato.

Riprendere solo3.5: verificare MVP browser, accessibilità, navigazione,1080p/4K e prestazioni, registrando nuove evidenze senza sovrascrivere lo storico. Non avviare hardware o integrazioni.

## Stato dopo la 3.3 (storico)

Versione locale0.3.2, fase3 aperta. Dopo2min senza input opacità CSS45% su shell/dialogo e pausa sfondo/logo. Primo input ripristina ed esegue normalmente; focus conservato. Hidden cancella timer, ritorno con nuova attesa intera; reduced motion e visibilità restano prioritari. Nessun controllo finale, storage o comando hardware nuovo. Dissolvenza600ms ingresso idle/180ms risveglio, comparsa dialogo opacity-only220ms; reduced motion elimina transizioni.

File: `src/motion/IdleController.ts` e test, `useIdleDimming.ts`, policy/hook background, TvShell e CSS shell/dialogo. Un solo timeout con clock monotono, nessun RAF o aggiornamento React per input mentre già attivo. `scripts/verify-idle.mjs` richiamato da verify-shell solo con `IDLE_TEST=1`: due attese reali di2min. STABILITY_MS ora tiene sveglia la scena con Shift DOM periodico dichiarato nel JSON; soak5min/profiling non ripetuti in3.3.

**152 test, lint/typecheck/build ed Edge completo superati**. Attese osservate120.011ms Home/120.477ms dialogo, focus invariato e risveglio con azione; regressioni3.1/3.2/background OK, runtimeErrors vuoto. Screenshot1080p/4K e limiti nel [rapporto3.3](verification/phase-3.3/report.md), evidenze final/. Nessuna certificazione TV/Magic Remote/GPU; attenuazione CSS non garantisce protezione OLED. Lavoro locale3.2 preservato, nessun commit/push/deploy. Riprendere solo3.4, conservando i contratti idle/input e gli asset/tarature.

## Stato dopo la 3.2 (storico)

Versione locale0.3.1, fase3 aperta. Pointer/D-pad coordinati: movimento seleziona, click/tap nativi attivano una volta, hover fermo e touch-move non rubano focus. Nuovo simulatore lazy dev-only: avviare npm run dev, aggiungere ?remoteDebug=1 e premere **Telecomando · test**. Frecce/OK/Back sintetici sulla Home e sul modale, espansione mantenuta, Tab/Enter; pannello dentro il dialogo aperto per rispettare la Home inerte. Produzione ignora query ed esclude modulo/CSS controlli. Combinabile con backgroundDebug=1. Motore, tarature e dati preservati; focus CSS esistente esteso a mouse e simulatori.

141 test unitari/check e nuovi casi browser in scripts/verify-pointer.mjs superati, più regressioni3.1/background. Screenshot1080p/4K/mobile e limiti nel [rapporto3.2](verification/phase-3.2/report.md); evidenze final/. Mouse/tap CDP e eventi DOM sintetici non certificano dispositivi fisici o Magic Remote. Nessun commit/push/deploy, servizio o dipendenza nuovi. Conservare nuove cartelle sorgenti/test/evidenze durante il trasferimento.

File: src/navigation/useTvFocus.ts, navigation/development/RemoteSimulator.tsx/remote.css, slot in TvShell/ActionDialog; collaudo scripts/verify-pointer.mjs richiamato da verify-shell. La ripresa prevista allora era3.3, ora completata; usare il punto3.4 sopra. Setup e sezioni storiche sotto restano riferimento; non ricominciare3.2.

## Stato dopo la 3.1 (storico)

Versione locale0.3.0: dialoghi Demo per app/Riprendi, ambito confermato dall'utente; HDMI/domotica invariati. Modale nativo condiviso, Home inerte, Back/Escape/OK/Chiudi ritorna all'origine o prima app disponibile; secondo Back agisce sulla Home. Feedback inline conservati, una sola richiesta visibile, browser senza showModal usa il feedback inline. Nessuna modifica al motore o nuova dipendenza. 141 test/check ed Edge produzione/dev superati; screenshot1080p/4K/mobile e albero accessibilità verificati. Esiti e limiti nel [rapporto3.1](verification/phase-3.1/report.md), evidenze finali nella sua cartella complete/. Input CDP standard distinti da alias DOM sintetici; nessun telecomando o screen reader reale verificato.

File nuovi: `src/components/ActionDialog.tsx`, `dialog.css`, `dialogFocus.ts` e test; shell possiede lo stato, AppRail/ContinueWatching inviano richieste tramite callback opzionale. `scripts/verify-dialogs.mjs` è richiamato dal collaudo Home. Riprendere solo3.2, senza anticipare3.3/altro hardware; fase3 ancora aperta. Conservare sorgenti, asset, lockfile e nuove evidenze; nessun commit/push/deploy eseguito in3.1. Lo stato2.10 sotto e i rapporti precedenti restano storici.

## Stato dopo la 2.10 (storico)

**Fase 2 del motore completata in browser, versione locale0.2.0.** 135 test/check ed Edge Windows superati; Home produzione per300.035ms con29,99–30,02draw/s, risorse/focus stabili ed errori runtime raccolti vuoti. Rimossi CityBackdrop.tsx/city.css, asset/generatore storici conservati fuori bundle. Cleanup Canvas immediato e idempotente su errore/contextlost; verificati recupero via profilo, effetti/motore off, sorgente assente/ritorno, fallback navigabile, resize e policy. Screenshot1080p/4K confrontati con PNG/riferimenti e differenze residue esplicite nel [rapporto2.10](verification/phase-2.10/report.md). Tarature, layout e profili preservati; nessuna certificazione visiva completa, GPU o G5. Package/lockfile/README allineati a0.2.0, nessuna pubblicazione.

Il piano registrato dopo2.10 era3.1, ora completata: usare il punto3.2 sopra. Setup e mappa dei file sottostanti restano validi, le sezioni2.9/trasferimento2.8 sono storico. Profiling allocazioni2.9 non ripetuto nella2.10. Prove TV, SDK, packaging/deploy e privilegi restano futuri.

## Aggiornamento dopo la 2.9 — Windows (storico)

La 2.9 è completata: scheduler corretto, 134 test/check e Edge156 superati, 30 cambi profilo/resize e 120 variazioni slider senza risorse duplicate. Home produzione Balanced/1080p/DPR1 per 300.032 ms: 29,98–30,02 draw/s, heap dopo GC +40.900 byte e conteggi risorse stabili. Profiling allocazioni JS per 15.018 ms: circa 5,4 MB campionati, soprattutto nei draw; pool fissi non significano zero allocazioni transitorie. Contatori CSS misurati separatamente dal draw Canvas, nessuna misura GPU/TV. Comandi e limiti nel [rapporto 2.9](verification/phase-2.9/report.md). Windows verificato con Node24.22.2/npm11.19.1 ed Edge headless; adattare CHROME_PATH al percorso Edge o Chrome reale. Installazione ha richiesto trust npm tramite NVM con approvazione utente; nessuna modifica del lockfile.

Il punto di ripresa registrato a fine2.9 era2.10; questa attività è ora completata, usare lo stato corrente sopra. Le sezioni successive conservano il trasferimento precedente e il piano storico2.9; i comandi di setup e la mappa dei file restano validi. Prove reali G5, deploy e privilegi restano fuori da quanto verificato.

## Stato da trasferire alla 2.8 (storico)

Le fasi 0 e 1 sono chiuse; le microfasi 2.1–2.8 sono completate. La macrofase 2 resta aperta: mancano 2.9 e 2.10. Le milestone 1–4 del motore sono completate. Questa sessione aggiorna soltanto la documentazione, senza avviare la 2.9.

All'inizio del passaggio la copia di lavoro era pulita sul ramo `main`, commit `6fb0e09` (`fase 2 in corso - fase 2.8 completa`). Sorgenti, asset, lockfile e rapporti fino alla 2.8 risultano tracciati. Questo riferimento identifica la base del codice prima di questi aggiornamenti documentali; non certifica che il commit sia stato pubblicato su un remoto. Le modifiche documentali di questo passaggio devono essere trasferite insieme al progetto.

Usare il repository aggiornato su entrambi i PC. Prima di cambiare macchina controllare `git status --short`: se si usa Git, includere gli aggiornamenti desiderati nel proprio commit e sincronizzarli con il remoto abituale; nessun commit o push viene eseguito automaticamente da questo passaggio. In alternativa copiare l'intera cartella del progetto, inclusi documenti, asset e lockfile. Conservare `.git` se si vuole mantenere la cronologia. `node_modules/`, `dist/`, cache e log si rigenerano sul PC di destinazione.

File/cartelle necessari: `src/`, `references/`, `assets/`, `scripts/`, `docs/`, file Markdown nella radice, `index.html`, `package.json`, `package-lock.json` e configurazioni TypeScript/Vite/Vitest/ESLint. I soli file Markdown non contengono il progetto eseguibile. Non servono chiavi API, file `.env`, SDK webOS o account di servizi per la preview mock corrente.

## Avvio sul PC di destinazione

Installare Node.js conforme a `package.json` (>=22.12; ambiente finora verificato Node24.22.2/npm11.19.1). Aprire un terminale nella radice del progetto; i seguenti comandi sono identici in bash e PowerShell:

```bash
node --version
npm --version
npm ci
npm run check
npm run dev
```

Usare `npm ci` con il lockfile trasferito. Non copiare `node_modules` dal vecchio sistema operativo. L'installazione richiede accesso al registro npm o una cache già disponibile. Aprire l'indirizzo stampato da Vite, normalmente `http://localhost:5173/`. Non usare `file://`. Con Ctrl+C si arresta il server del relativo terminale; processi e porte del vecchio PC non si trasferiscono.

Per il pannello tecnico aprire lo stesso indirizzo con `?backgroundDebug=1`, poi premere **Sfondo · debug**. Parte chiuso, usa Tab/frecce native e si chiude con Escape/Back tornando alla prima app. Le modifiche sono in memoria: chiusura conserva i valori, reload/reset ripristina i default.

Per la preview produzione:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 5187 --strictPort
```

La produzione usa **Balanced** dalla configurazione TypeScript e ignora `?backgroundDebug=1`. I profili fanno parte del motore anche in produzione; è escluso solo il pannello. Dopo misure sul G5 sceglieremo profilo e tarature fissi per la versione finale, senza menu utente o auto-degrado attualmente implementato. Preview serve una build browser, non un pacchetto TV.

## Dove intervenire

| Area | File principali / contratto corrente |
| --- | --- |
| Home | `src/app/TvShell.tsx`, header con brand/orologio, rail e tre widget sempre visibili. Nessun menu superiore. |
| Stato esterno | `src/platform/contracts.ts`, `mock/MockPlatformAdapter.ts`, `webos/WebosPlatformAdapter.ts`, `webos/runtime.ts`, `selectPlatform.ts`, `SystemInfoNotice.tsx`; browser Demo e lettura pubblica TV da collaudare sul dispositivo. |
| Focus | `src/navigation/useTvFocus.ts`, `focusGraph.ts`; frecce/OK/Back, input/dialog/strumenti con tastiera nativa. |
| Motion | `src/motion/useBackgroundMotion.ts`; sistema reduced motion e documento nascosto prevalgono; vecchie preferenze storage ignorate. |
| Sfondo | `src/features/background/HomeBackground.tsx` → `CyberpunkBackgroundEngine.tsx`; immagine originale e layer indipendenti dietro UI. |
| Controlli/profili | `background.config.ts`, `background.types.ts`; config canonica distinta dal risultato di `resolveBackgroundConfig`, risolta una volta dal motore. |
| Rendering | `BackgroundCanvas.tsx`, `engine/RainEngine.ts`, `ParticleEngine.ts`, `AnimationController.ts`; un Canvas e un RAF, buffer massimo Full HD. |
| CSS localizzati | `FogLayer.tsx`, `NeonLayer.tsx`, `HologramLayer.tsx`; mapping cover, regioni/maschera calibrate sul PNG. |
| Monitor | `engine/PerformanceMonitor.ts`; campioni wall-clock almeno ogni2s, costo CPU/cadenza draw Canvas, non misura GPU/CSS/Home intera. |
| Pannello | `development/BackgroundWorkbench.tsx`, `BackgroundSettings.tsx`, `settingsPolicy.ts`; solo Vite dev + opt-in, stato separato dalle card. |
| Veicoli | `engine/FlyingVehicleEngine.ts` predisposto ma non montato; default off, nessun asset trasparente reale fornito. `CityBackdrop.tsx` e `city.css` rimossi in2.10; asset SVG/generatore storici conservati fuori bundle. |
| Verifiche | `scripts/verify-shell.mjs`, fixture `scripts/fixtures/background-profiles.html`, rapporti `docs/verification/phase-2.1/`…`phase-2.10/`. |

## Decisioni da preservare

- Nome esatto **StefCors GL1tCh 0S**; logo canonico `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg` e fallback statico derivato.
- Riferimenti prioritari `references/00_brand_home.png` e `01_home_approved.png`. Eccezioni approvate: Home unica senza menu superiore, testi introduttivi rimossi, nessun controllo movimento nella Home definitiva. Badge Demo conservati, nessun logo terzo inventato.
- Sfondo effettivo `references/background.png`, invariato; copia `assets/cyberpunk-background.png` con stesso SHA256 `7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482`. Video `assets/cyberpunk-motion-reference.mp4` solo riferimento, non riprodotto dalla Home. Non muovere/duplicare i veicoli dipinti nel PNG.
- Balanced: pioggia intensity65/speed1/wind.15 →208 gocce; particelle40; nebbia density65/speed.2; neon intensity100 e semicicli3.6–7.92s; ologramma con regione/maschera calibrata e glitchFrequency.15. Preservare le tarature già approvate dall'utente.
- Cinematic: intensità pioggia×1.4/cap100 e particelle×2/cap200 (default291/80). Balanced cap particelle80. Eco: PNG/scrim statici, niente layer decorativi o RAF background; policy del logo separata.
- Entrambi i profili animati hanno cap1920×1080/DPR1/target30fps; budget più bassi rispettati. 4K UI non significa Canvas4K. Nessun valore di fps è garantito sul G5.
- Nessuna modifica LG, root, autostart o rimappatura Home autorizzata. Deploy standalone ancora nelle fasi4.1–4.4; sezione README da completare con le prove reali. Vecchie fasi2–6 rinumerate3–7; rapporti storici conservano gli ID originali.

## Verifica browser opzionale e portabilità

`npm run check` non richiede Chrome. Il collaudo CDP usa un Chrome locale, Node WebSocket e nessuna dipendenza npm aggiuntiva. Il default `CHROME_PATH` dello script è specifico macOS: sugli altri PC fornire il percorso reale dell'eseguibile Chrome. I percorsi seguenti sono esempi da adattare. Il browser check è stato eseguito su macOS, non ancora certificato su Windows/Linux.

Avviare in terminali separati preview produzione5187 (comando sopra) e dev server per fixture/pannello:

```bash
npm run dev -- --host 127.0.0.1 --port 5188 --strictPort
```

In un terzo terminale, bash/macOS/Linux (adattare CHROME_PATH su Linux):

```bash
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
export SHELL_URL="http://127.0.0.1:5187"
export PROFILE_TEST_URL="http://127.0.0.1:5188/scripts/fixtures/background-profiles.html"
export BACKGROUND_TEST_URL="http://127.0.0.1:5188/"
export VERIFY_OUTPUT="docs/verification/new-pc-baseline"
node scripts/verify-shell.mjs
```

PowerShell Windows:

```powershell
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$env:SHELL_URL = 'http://127.0.0.1:5187'
$env:PROFILE_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/background-profiles.html'
$env:BACKGROUND_TEST_URL = 'http://127.0.0.1:5188/'
$env:VERIFY_OUTPUT = 'docs/verification/new-pc-baseline'
node scripts/verify-shell.mjs
```

Impostare una cartella output nuova per identificare la propria verifica. Dalla2.10, senza VERIFY_OUTPUT lo script genera `docs/verification/browser-<timestamp>` invece di sovrascrivere la vecchia phase-2.8. Le variabili del collaudo sono lette da Node, non da file `.env`. Non è necessario inserirle per usare `npm run dev`. Senza le due URL opzionali il collaudo non copre profili/pannello. Se una porta è occupata, arrestare il proprio server precedente o scegliere un'altra porta aggiornando tutte le URL corrispondenti.

## Ripresa della2.9

1. Leggere `START_HERE.md`, `AGENTS.md`, `PROJECT_STATUS.md`, `PROJECT_SPEC.md`, `ROADMAP.md` e README tecnico del background. Confrontare con file reali e Git prima delle modifiche.
2. Eseguire la baseline sul nuovo PC e registrare sistema operativo, Node/Chrome, viewport/DPR, profilo e modalità dev/produzione. Le prestazioni di un altro PC non sono confrontabili senza questi dati.
3. Pianificare file e criteri prima del codice. Profilare cadenza/costo Canvas e compositing CSS separatamente; indagare allocazioni e ricreazione dei pool durante drag prolungati dei controlli.
4. Verificare resize ripetuti, pause/ripresa e cambi profilo/smontaggio; registrare conteggi risorse e memoria dove misurabili. Non dedurre assenza di leak solo da conteggi istantanei.
5. Eseguire una sessione browser prolungata con durata dichiarata (da definire, non ancora svolta), raccogliere dati iniziali/finali e riscontri sulla navigazione. Modificare tarature soltanto con motivazione e confronto visivo1080p/4K.
6. Eseguire i controlli pertinenti e aggiornare documenti/evidenze; completare2.9 soltanto quando i criteri della roadmap sono coperti.2.10 resta separata.

Ultima verifica implementativa2.8:132 test, lint/typecheck/build e Chrome Home/profili/pannello superati; rapporto `docs/verification/phase-2.8/report.md`. Campioni headless circa21–22draw/s, non certificazione30fps. Restano non verificati: sessione hardware prolungata, prestazioni/compatibilità webOS, Magic Remote reale, API TV, packaging/deploy, sostituzione del launcher e piena fedeltà visiva ai mockup. I rapporti precedenti sono registri storici: non riscriverli come se descrivessero lo stato corrente.
