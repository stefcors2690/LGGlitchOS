# Ripresa su un altro PC — StefCors GL1tCh 0S

Aggiornato: 2026-11-09. Punto di ripresa: **3.1 — Overlay e Back**, ancora `DA FARE`.

## Stato corrente dopo la 2.10

**Fase 2 del motore completata in browser, versione locale0.2.0.** 135 test/check ed Edge Windows superati; Home produzione per300.035ms con29,99–30,02draw/s, risorse/focus stabili ed errori runtime raccolti vuoti. Rimossi CityBackdrop.tsx/city.css, asset/generatore storici conservati fuori bundle. Cleanup Canvas immediato e idempotente su errore/contextlost; verificati recupero via profilo, effetti/motore off, sorgente assente/ritorno, fallback navigabile, resize e policy. Screenshot1080p/4K confrontati con PNG/riferimenti e differenze residue esplicite nel [rapporto2.10](verification/phase-2.10/report.md). Tarature, layout e profili preservati; nessuna certificazione visiva completa, GPU o G5. Package/lockfile/README allineati a0.2.0, nessuna pubblicazione.

Riprendere solo **3.1** secondo ROADMAP: dialoghi accessibili, Back/Escape e ripristino focus, mantenendo Home unica e mock. Conservare modifiche locali e rapporti2.9/2.10; nessun commit/push eseguito. Setup e mappa dei file sottostanti restano validi, le sezioni2.9/trasferimento2.8 sono storico. Profiling allocazioni2.9 non ripetuto nella2.10. Prove TV, SDK, packaging/deploy e privilegi restano futuri.

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
| Stato esterno | `src/platform/contracts.ts`, `src/platform/mock/MockPlatformAdapter.ts`; dati Demo, nessuna connessione reale. |
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
