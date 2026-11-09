# Microfase 2.9 — Ottimizzazione e stabilità

Data: 2026-11-09. Base locale `7d39aea` (`update docs`), working tree inizialmente pulito. Nessun commit, push, deploy o test TV.

## Ambiente e baseline

Windows11 Pro N10.0.26300 x64, Intel Core i9-9900KF3.60GHz, Node24.22.2, npm11.19.1, Edge156.0.4314.58 Chromium headless con `--disable-gpu`. Dipendenze installate da lockfile con `npm ci`; NVM4306 risolto autorizzando il modulo npm con approvazione utente. Installazione:10 vulnerabilità moderate segnalate, nessun aggiornamento automatico o modifica del lockfile.

Baseline `npm run check`:132 test in20 file, lint, TypeScript e build OK. Browser produzione5187 e fixture/dev5188: Home1080p/4K/mobile, focus/tasti/widget, fallback, reduced motion/visibilità, profili e pannello OK. Errori runtime raccolti vuoti. Evidenze separate in `baseline/`, mai sovrascritti i rapporti2.8.

Fixture iniziale Balanced:45 intervalli draw in2027.9ms,22.1904draw/s, CPU medio0.3244ms/max0.4ms. Questo è costo di invio draw Canvas lato CPU e cadenza, non frame presentati/GPU o TV.

## Problema riprodotto e correzione

Il controller azzerava il riferimento temporale dopo ogni draw, perdendo il residuo rispetto alla scadenza30fps. Con una sequenza deterministica60Hz leggermente irregolare produceva200 draw in10s invece di circa300. Il nuovo test fallisce sul codice iniziale e passa dopo la correzione.

`AnimationController` conserva la scadenza e salta quelle perse senza draw di recupero a raffica. Il tempo della simulazione viene calcolato separatamente dall'ultimo draw reale, evitando doppio conteggio del residuo. Restano cap delta100ms, un solo RAF, stop/resume senza tempo nascosto e dispose terminale. Aggiunti test per cadenza/durata simulata e stallo lungo. Tarature, PNG, maschere, layout e profili invariati.

## Verifiche finali

- `npm run check`: **134 test in 20 file**, lint, TypeScript e build OK; lint ripetuto dopo le estensioni finali del collaudo, OK.
- Edge: collaudo Home, pannello, profili, Canvas assente, asset mancante, reduced motion, visibilità, pause/ripresa, tastiera e screenshot OK. `runtimeErrors=[]`.
- Fixture Balanced finale: **29,9058 draw/s** in 2006,3 ms, CPU medio 0,3433 ms/max 0,5 ms. La baseline sullo stesso PC era 22,1904 draw/s: incremento della cadenza, nessuna promessa GPU/TV.
- **30 cambi profilo con resize** alternati 1080p e 4K/DPR2: un Canvas/RAF, cinque sprite e tre listener resize/observer nei profili animati; zero risorse in Eco e dopo unmount. Buffer sempre entro 1920×1080.
- **120 variazioni slider in 6110 ms**: sempre un Canvas/RAF e cinque sprite attivi. Listener CDP 1201→1201, nodi 1893→1878; heap dopo GC 12.639.840→13.148.864 byte. I pool vengono ricreati su ogni configurazione e la telemetria riparte; lo stress non dimostra assenza di leak in qualsiasi scenario o allocazioni nulle.
- **Home produzione per 300.032 ms (5 minuti)**, Balanced/1080p/DPR1: 30 campioni, 29,98–30,02 draw/s; costo medio Canvas 0,272–0,342 ms, massimo osservato 0,9 ms. Risorse attive sempre 1 RAF/Canvas, 5 sprite, 3 listener resize e 3 observer; focus conservato e D-pad/Back finali OK.
- Heap iniziale/finale dopo GC: **13.884.680→13.925.580 byte** (+40.900, circa 0,3%); campioni 13.922.036–14.081.756 byte. Nodi CDP 1913→1913 e listener 1205→1205. Nessuna crescita incontrollata osservata nella durata provata; non è una prova assoluta di assenza di leak.
- Finestre CSS di circa 10 s: scena completa TaskDuration 1,2865 s, ScriptDuration 0,1143 s, RecalcStyleDuration 0,0990 s; layer CSS nascosti 0,9630/0,1207/0 s. LayoutDuration zero in entrambe. Costo medio Canvas 0,302/0,290 ms. Indicazione del lavoro main thread in questo campione, non costo GPU isolato o benchmark controllato.

Profiling statistico allocazioni: **15.018 ms**, intervallo 4096 byte, inclusi oggetti raccolti dal GC. Dimensione totale attribuita dal profiler **5.394.248 byte**, di cui 4.495.800 e 758.868 ai due stack `draw` del bundle produzione; `tick` 28.716 e `record` 24.612 byte. I dati non identificano tipi degli oggetti o distinguono tutte le conversioni interne Canvas/VM: non dedurre da questi stack l'origine precisa delle allocazioni. Il dato smentisce una promessa letterale di “zero allocazioni JS/frame”; la proprietà verificata è pooling delle strutture applicative e memoria trattenuta limitata nella prova. Nessun aumento di buffer o cache introdotto per inseguire un campione statistico.

Dati grezzi: `final/stability.json`, `final/shell-metrics.json`, `allocation/allocations.json` (albero e campioni originali); baseline separata in `baseline/shell-metrics.json`. Il run allocazioni ha ripetuto il collaudo Home, senza URL opzionali profili/pannello già coperti dal run finale.

## Comandi eseguiti e riproduzione

Dalla radice del repository: `npm ci`, `npm run check`. Server separati:

```powershell
npm run dev -- --host 127.0.0.1 --port 5188 --strictPort
npm run preview -- --host 127.0.0.1 --port 5187 --strictPort
```

In questa sessione i server sono stati avviati tramite gli equivalenti entry point locali `node node_modules/vite/bin/vite.js` e `node node_modules/vite/bin/vite.js preview`, con gli stessi argomenti. La preview usa la build appena verificata.

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:VERIFY_OUTPUT = 'docs/verification/phase-2.9/final'
$env:PROFILE_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/background-profiles.html'
$env:BACKGROUND_TEST_URL = 'http://127.0.0.1:5188/'
$env:STABILITY_MS = '300000'
node scripts/verify-shell.mjs
```

Secondo run, shell distinta senza STABILITY_MS/PROFILE_TEST_URL/BACKGROUND_TEST_URL:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:VERIFY_OUTPUT = 'docs/verification/phase-2.9/allocation'
$env:ALLOCATION_MS = '15000'
node scripts/verify-shell.mjs
```

Per ripetere usare cartelle output **nuove**, non quelle storiche qui registrate. SHELL_URL non impostata: default `http://127.0.0.1:5187`. I comandi baseline erano identici al primo run senza STABILITY_MS, con output `baseline`. Primo tentativo browser nella sandbox interrotto su Page.enable; tutti i run riportati riusciti sono stati eseguiti fuori sandbox con approvazione. Lint finale tramite `node node_modules/eslint/bin/eslint.js . --max-warnings 0`, `git diff --check` OK. Nessun test su installazione Linux, TV o GPU attiva.

## Metodo e limiti

`scripts/verify-shell.mjs` conserva il collaudo ordinario e aggiunge opt-in:

- `STABILITY_MS`, minimo60000:30 cambi profilo con resize1080p/4K-DPR2, cleanup unmount,120 variazioni slider in task distinti e sessione Home produzione; campioni ogni10s, focus stabile, conteggi RAF/listener/observer/sprite, heap CDP dopo GC e confronto main thread con layer CSS visibili/nascosti.
- `ALLOCATION_MS`, minimo10000:profilo statistico allocazioni JavaScript della Home produzione1080p/DPR1/Balanced, campionamento4096byte comprendente oggetti raccolti dal GC; non misura buffer nativi/GPU.

La strumentazione risorse esiste solo nella fixture e viene iniettata dal collaudo nella Home, mai nel bundle. Il suo Set viene ripulito dei Canvas sprite esplicitamente azzerati dal cleanup, così il probe non trattiene esso stesso risorse già liberate. Risorse ancora attive restano conteggiate. La GC forzata serve a confrontare l'heap trattenuto, non a misurare la fluidità naturale del GC. Il monitor non crea RAF aggiuntivi né stato React/frame.

I pool Float32Array e gli sprite sono allocati a setup/config, non dentro draw. I cambi ai controlli ricreano l'effetto Canvas con cleanup; la2.9 verifica che il comportamento resti limitato senza introdurre caching o cambi architetturali. Il tempo CPU dei draw e i contatori main thread CSS non misurano compositing GPU. Headless con GPU disattivata non certifica webOS o30fps su G5. Una prova locale di pochi minuti non dimostra assenza di ogni leak e non sostituisce una sessione hardware lunga.

## Confronto visivo

Ispezionati riferimenti 00/01, baseline 1080p e screenshot finali 1080p/4K (il secondo visualizzato ridimensionato a 2048×1152). Nessun cambio di composizione osservato tra baseline e finale. Le differenze preesistenti comprendono logo/header più semplici, card con simboli neutri Demo invece dei marchi terzi, housing/widget e footer più semplici; menu/meteo assenti secondo decisioni correnti o mancanza dati reali. Questa microfase corregge la cadenza senza cambiare geometria o asset; nessuna fedeltà completa dichiarata.

SHA256 dei due PNG verificato invariato: `7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482`.

## Chiusura e punto di ripresa

**2.9 completata** nei limiti delle verifiche locali previste; milestone 5 parte A chiusa. Nessun nuovo blocco identificato. Prossima **2.10**, non avviata: integrazione definitiva/fallback, doppioni legacy, controlli integrati e confronto visivo finale del motore. I rapporti precedenti restano intatti, le misure TV attendono hardware disponibile.
