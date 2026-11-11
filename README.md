# StefCors GL1tCh 0S — Codex Development Kit v3

Versione applicativa **0.4.3**, installata e avviata sulla G5 nel collaudo4.4; controlli finali in PROJECT_STATUS. Package, lockfile e manifest allineati; nessuna release, tag, commit o push.

## Collaudo reale G5 — 4.4

Inspector sul dispositivo conferma getSystemInfo reale, WebAppManagerChrome132.0.6834.207 e grafica1920×1080/DPR1. L'utente conferma frecce/OK, Back del dialogo e ritorno focus, uscita LG, Home LG/riapertura, pointer e leggibilità. Dopo due piccoli alleggerimenti richiesti per gli scatti sulle card, ha accettato la0.4.3: solo overlay TV1600×900/179gocce/32particelle a target30fps, anche nella Demo; browser Balanced e immagine originale/CSS/logo invariati.

Idle reale osservato sul dispositivo (inizio controllato con Shift sintetico):45%, Canvas statico e frame fermi; risveglio al primo tasto fisico confermato dall'utente e snapshot con Canvas running/dati TV/focus. Campioni Canvas, limiti e screenshot nel [rapporto4.4](docs/verification/phase-4.4/report.md). Non sono misure GPU o latenza fisica; pressione lunga, disinstallazione e downgrade non provati. [Guida operativa](webos/README.md) con aggiornamento, Inspector, log/diagnosi e sessione Developer Mode.

## Pacchetto e adapter webOS — 4.3

**IPK generato e verificato localmente**, ID **com.stefcors.glitchos**: `artifacts/com.stefcors.glitchos_0.4.3_all.ipk`. Manifest/icone/runtime ufficiale tracciati in webos/, stage dist-webos/ e artefatti ignorati da Git. `npm run package:webos` ricostruisce e controlla il pacchetto; `npm run verify:webos` controlla quello esistente. Nessuna installazione o avvio automatici sulla TV.

Build separata Chromium132/FHD, IIFE e asset relativi. Il runtime ufficiale LG riconosce la TV: adapter device predefinito, pulsante nel footer per aprire la Demo e tornare alla TV; la scelta dura solo nella sessione. Nel browser rimane la Demo e non viene caricato il runtime LG. La sola lettura pubblica getSystemInfo mostra i campi realmente restituiti; app/HDMI/domotica restano indisponibili con motivo fino alla fase5. Continua a guardare resta esplicitamente Demo anche sulla TV. Timeout8s, Riprova e nessun errore di sistema grezzo mostrato o registrato. Manifest con il solo systemconfig.query; Back461 chiude prima il dialogo e dalla Home richiama webOS.platformBack(), senza intercettare Home. Visibilità/reduced motion/idle conservati; nessun hook di riavvio o deep link. Implementazione4.3 seguita dal collaudo reale4.4 sopra; [guida](webos/README.md), storico [rapporto4.3](docs/verification/phase-4.3/report.md).

## Collaudo MVP browser — 3.5

Il flag `$env:MVP_TEST = '1'` aggiunge al collaudo `node scripts/verify-shell.mjs` la matrice1080p/4K: DOM/albero accessibile Chromium, tutte le14 azioni con D-pad, Tab/Shift+Tab, dialoghi/ritorno focus e30 misure di risposta focus per risoluzione. Produce `mvp-metrics.json` e screenshot; è uno strumento di test, escluso dalla build dell'app.

È combinabile con `PLATFORM_TEST_URL`, `IDLE_TEST=1` e `STABILITY_MS=300000` per stati limite, due attese idle reali e5min di animazioni tenute attive. I due scenari di inattività/stabilità restano distinti. Usare una nuova cartella `VERIFY_OUTPUT` e rimuovere i flag dalla sessione dopo la prova. AX/DOM e tempi headless non certificano screen reader, WCAG, GPU o G5. Comando completo e risultati nel [rapporto3.5](docs/verification/phase-3.5/report.md).

## Fase4 — Inventario e preparazione TV, 11/11/2026

Inventario/accesso **4.1 completati**: CLI restituisce **OLED55G56LS.DPIQLJP**, firmware **43.21.96**, SDK **11.2.0** dal target locale **glitch-g5**. Menu utente **webOS26 / 11.2.0-3711**; Developer Mode/Key Server attivi. [Dossier4.1](docs/webos/PHASE_4_1.md), [evidenzaCLI](docs/verification/phase-4.1/device-info.md). Packaging4.2 e adapter pubblico di base4.3 completati alla0.4.1; nessuna nostra app ancora installata o collaudata sul dispositivo.

Su questo PC installata globalmente **@webos-tools/cli3.2.6**, versione/help e system-info verificati con Node24.22.2; nessuna dipendenza aggiunta all'app. Installazione, requisiti, limiti npm/NVM e associazione per gli altri PC sono nel dossier. Chiave e indirizzo restano nella configurazione locale fuori Git; non rifare pairing se ancora valido.

La documentazione LG distingue grafica app Full HD e video4K sulle TV UHD; il motore web dipende dalla versione webOS reale. Non dedurre compatibilità dal collaudo Edge. L'attivazione Developer Mode riavvia la TV e ha durata di sessione limitata; dettagli e gestione credenziali locali nel dossier.

## Stati limite — 3.4

App, ingressi e domotica mostrano caricamento, errore e liste vuote con messaggi accessibili. **Riprova** rilegge i dati ed è utilizzabile con frecce/OK o pointer. Dopo10 secondi senza risposta una lettura diventa un errore recuperabile; i risultati tardivi vengono ignorati. I comandi restano singoli e lo stato cambia solo dopo conferma, senza retry automatici. Le capability assenti mostrano il motivo e impediscono l'azione.

Quando il browser segnala rete assente compare un avviso; la Demo locale resta operativa. Non è una verifica della connessione Internet e non aggiunge cache offline o PWA. Per provare i casi limite: avviare `npm run dev` e aprire `/scripts/fixtures/platform-states.html`; la barra tecnica appartiene solo alla fixture, esclusa dalla build ordinaria.

Per includerla nel collaudo Edge, aggiungere `$env:PLATFORM_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/platform-states.html'` al comando browser documentato sotto, poi `Remove-Item Env:PLATFORM_TEST_URL`. [Rapporto3.4](docs/verification/phase-3.4/report.md) con comandi, casi e limiti.

## Inattività e transizioni — 3.3

Dopo **2 minuti** senza input, Home/dialogo vengono attenuati al45% di opacità e sfondo/logo si fermano. Primo tasto, click/tap, movimento effettivo o scroll ripristina la luminosità e mantiene la normale azione. Focus e dialoghi rimangono; nessun nuovo controllo manuale. Al ritorno da pagina nascosta l'attesa ricomincia; riduzione movimento di sistema continua a prevalere. Attenuazione CSS, nessuna modifica alla luminosità hardware TV.

Ingresso dialogo con breve dissolvenza; transizioni disabilitate con reduced motion. `npm run check` include timer/policy. Per le due attese reali Home/dialogo usare anche `$env:IDLE_TEST = '1'` prima di `node scripts/verify-shell.mjs`, poi `Remove-Item Env:IDLE_TEST`. Senza flag il browser check non ripete le due attese. Dettagli in [rapporto3.3](docs/verification/phase-3.3/report.md).

## Pointer e simulatore — 3.2

Muovere il puntatore su una card o widget sposta il focus senza eseguire l'azione. Click o tap attivano; le frecce continuano dal controllo selezionato. Un puntatore fermo non riprende il focus dopo la tastiera.

Per il simulatore: `npm run dev`, poi aprire l'URL Vite con `?remoteDebug=1` e premere **Telecomando · test**. Frecce, OK e Back funzionano sulla Home e sul dialogo aperto; Tab/Enter consentono l'uso senza mouse. Input sintetici di sviluppo, non telecomando TV reale. Il pannello parte chiuso, conserva l'espansione nella sessione della Home e non è incluso in produzione. Per entrambi gli strumenti usare `?remoteDebug=1&backgroundDebug=1`; i campi tecnici mantengono la tastiera nativa.

Da un altro PC della stessa rete avviare `npm run dev -- --host 0.0.0.0 --port 5173 --strictPort` e usare l'indirizzo **Network** stampato da Vite, aggiungendo la query. Collaudo in `scripts/verify-pointer.mjs`, eseguito da `verify-shell.mjs`; esiti e limiti in [rapporto3.2](docs/verification/phase-3.2/report.md).

## Dialoghi Demo — 3.1

Avvio simulato di un'app e pulsante Riprendi aprono un dialogo informativo. Chiudi/OK/Enter o Back/Escape lo chiudono riportando il focus al controllo d'origine; un secondo Back agisce sulla Home. Durante il modale Tab/frecce restano al suo interno e la Home non riceve input. Se l'origine non è disponibile si torna alla prima app utilizzabile. HDMI e domotica mantengono il feedback attuale. Nessuna app reale o riproduzione video.

Un solo dialogo alla volta; gli esiti arrivati mentre è aperto restano nel feedback inline. Browser senza dialogo nativo: feedback inline e Home utilizzabile. `npm run check` e collaudo Home verificano policy focus, chiusure, fallback e regressioni; il modulo browser dedicato è `scripts/verify-dialogs.mjs`, richiamato da `verify-shell.mjs`. Dettagli in [rapporto3.1](docs/verification/phase-3.1/report.md).

## Collaudo stabilità e allocazioni — 2.9

Con i server preview5187 e dev5188 avviati come descritto in [HANDOFF](docs/HANDOFF.md), il collaudo opzionale supporta:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:SHELL_URL = 'http://127.0.0.1:5187'
$env:PROFILE_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/background-profiles.html'
$env:BACKGROUND_TEST_URL = 'http://127.0.0.1:5188/'
$env:VERIFY_OUTPUT = 'docs/verification/my-stability-run'
$env:STABILITY_MS = '300000'
$env:ALLOCATION_MS = '15000'
node scripts/verify-shell.mjs
Remove-Item Env:STABILITY_MS, Env:ALLOCATION_MS
```

Adattare il percorso al browser Chromium installato e scegliere una cartella output nuova. In bash usare `export NOME=valore` per le stesse variabili e `unset STABILITY_MS ALLOCATION_MS` alla fine. Le due prove sono indipendenti e opt-in; minimo60s per stabilità,10s per allocazioni. Il collaudo ordinario resta disponibile senza queste variabili. Include heap JS dopo GC, risorse, stress controlli/profili/resize e finestre main thread CSS on/off; non misura la GPU o il G5. Evidenze e limiti nel [rapporto2.9](docs/verification/phase-2.9/report.md).

Dalla3.3 STABILITY_MS misura animazioni tenute attive con Shift DOM sintetico periodico, esplicitato nei risultati. Per inattività reale usare IDLE_TEST=1; non confondere i due scenari. I rapporti storici precedenti all'idle restano invariati.

Dalla2.10 il collaudo con PROFILE_TEST_URL include anche perdita contesto simulata, errore draw/cleanup, recupero, effetti/motore off e assenza/ritorno immagine. Senza VERIFY_OUTPUT crea una cartella con timestamp; l'output esplicito non deve puntare a rapporti storici. Il fallback Canvas conserva PNG e navigazione; dopo un errore le risorse Canvas sono liberate subito, senza retry automatico. Contratto e limiti nel [rapporto2.10](docs/verification/phase-2.10/report.md).

## Stato corrente e ripresa su un altro PC — 2026-11-11

**Fasi0–4 completate**, versione0.4.3 installata/collaudata sulla G5; prossima5.1 — Catalogo applicazioni. Prove, taratura accettata e limiti nel rapporto4.4. [Handoff](docs/HANDOFF.md), [prompt IDE](START_HERE.md), [guida packaging](webos/README.md).

Home unica con dati Demo, PNG originale e motore animato locale. Il profilo **Balanced viene usato anche nella build di produzione**; solo il pannello tecnico è escluso. Profili e tarature finali saranno scelti dopo prove sulla TV. Nessun menu superiore, preferenza movimento o pausa manuale nella Home definitiva.

Sul nuovo PC, dalla radice del repository: `npm ci`, `npm run check`, `npm run dev`. Node>=22.12; non copiare node_modules dal vecchio PC. Aprire l'URL Vite con `?backgroundDebug=1` per attivare il pulsante degli strumenti soltanto in sviluppo. Asset e lockfile sono tracciati; trasferire anche queste modifiche documentali. Nessun `.env` o SDK TV necessario per il mock.

Ultima verifica4.2: **165 test/24 file, lint, TypeScript, build, package/verify e analisi CLI superati**. Edge157 HTTP e file://1080p/4K con DOM/AX,14 azioni da tastiera, focus/dialoghi e regressioni completi; runtimeErrors vuoto, screenshot/icone ispezionati. [Rapporto4.2](docs/verification/phase-4.2/report.md). Idle reale/soak3.5 e profiling2.x restano storici, non ripetuti qui. Nessuna certificazione WebAppManager/G5, Back461, GPU, WCAG/screen reader o piena fedeltà. Nessun altro browser/fresh install; installazione e avvio TV solo istruzioni, non esiti già provati.

Le sezioni numerate sotto descrivono anche la progressione storica: vecchi menu, controlli movimento e frasi “non ancora implementato” si riferiscono alla fase indicata, non allo stato attuale. Per riprendere prevalgono questo riepilogo, PROJECT_STATUS e HANDOFF.

Cyberpunk LG OLED G5 custom launcher design and implementation reference.

- `START_HERE.md` — entry point and resume prompt for any IDE
- `PROJECT_STATUS.md` — current implementation state, checks and handoff notes
- `AGENTS.md` — agent instructions
- `PROJECT_SPEC.md` — product and architecture
- `ROADMAP.md` — small implementation steps, statuses and acceptance criteria
- `BRAND_IDENTITY.md` — brand and visual rules
- `VISUAL_REFERENCE_GUIDE.md` — how to use screenshots
- `ANIMATION_SPEC.md` — slow glitch timing and performance rules
- `references/` — five visual mockups including the branded Home
- `assets/branding/` — animated SVG and browser preview

Mockups are reference art, not interactive assets. All integrations with webOS must be tested on device; root/autostart are not guaranteed.

## Avvio browser — microfase 0.1

Prerequisito: Node.js >= 22.12 (consigliato Node 24 LTS) e npm. Ambiente verificato: Node 24.22.2, npm 11.19.1. Dipendenze risolte in `package-lock.json`.

```bash
npm install
npm run dev
```

Aprire l'indirizzo locale stampato da Vite (normalmente http://localhost:5173). Il server resta attivo fino a Ctrl+C. Per un'installazione riproducibile dal lockfile usare `npm ci` al posto di `npm install`.

```bash
npm run build
npm run preview
```

La build esegue prima TypeScript strict e genera `dist/`. Preview serve la build locale, normalmente su http://localhost:4173; non è un servizio di produzione. Non aprire direttamente `dist/index.html` tramite file://.

La configurazione segue la [guida ufficiale Vite](https://vite.dev/guide/). Le sole dipendenze runtime sono React e React DOM; i tool di sviluppo includono Vite, plugin React, TypeScript, tipi React, ESLint e Vitest.

## Struttura attuale

- `index.html`: documento italiano e punto di ingresso Vite.
- `src/main.tsx`: mount React con StrictMode.
- `src/app/App.tsx`, `src/app/TvShell.tsx`: shell TV con sfondo a livelli, header, area scena, app e tre zone widget.
- `src/components/BrandLogo.tsx`: logo canonico, variante statica derivata per reduced motion e fallback testuale.
- `src/styles/global.css`, `src/themes/neon/tokens.css`: layout responsivo, palette, spaziature, tipografia e focus.
- `tsconfig.json`, `src/vite-env.d.ts`, `vite.config.ts`: configurazioni strict, tipi asset e build.

Il modulo platform è disponibile dalla microfase 0.3; features include sfondo, orologio e rail applicazioni. Il focus manager è in `src/navigation/` dalla 1.4.

## Verifiche e limiti

Microfase 0.1: installazione npm, reinstallazione da lockfile, build con TypeScript strict e risposta HTTP del dev server verificate. Installazione e build verificate anche in una cartella temporanea priva di node_modules, utilizzando la cache dei pacchetti scaricati. Nessun collaudo visivo in browser o su TV ancora eseguito.

## Controlli di qualità — microfase 0.2

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Oppure eseguire tutti i controlli, in sequenza con arresto al primo errore:

```bash
npm run check
```

`npm run lint` analizza sorgenti e configurazioni JS/TS con ESLint (regole raccomandate TypeScript, React Hooks e Fast Refresh); anche i warning fanno fallire il comando. Non è un controllo CSS, HTML o di accessibilità completo. `npm run typecheck` verifica TypeScript strict senza generare file; la build mantiene lo stesso controllo.

`npm test` esegue Vitest una volta ed esce, adatto anche a CI. `npm run test:watch` resta in ascolto durante lo sviluppo (Ctrl+C per uscire). I test `src/**/*.test.ts` e `src/**/*.test.tsx` usano l'ambiente Node e condividono la configurazione React di Vite. Il comando fallisce anche se non trova test.

I due test iniziali in `src/app/App.test.tsx` verificano il rendering statico React della shell, il brand esatto collegato al contenuto principale e l'indicazione della preview senza connessioni reali. Non verificano DOM interattivo, layout o focus: i test adapter sono disponibili dalla 0.3; quelli di navigazione arriveranno con il focus manager.

TypeScript è vincolato alla serie **6.0**: la 7 presente nello scaffold iniziale non soddisfa il peer requirement di typescript-eslint 8.72.1 (`<6.1`). Aggiornare compilatore e strumenti lint insieme, verificando compatibilità e lockfile.

Configurazioni basate sulle guide ufficiali di [typescript-eslint](https://typescript-eslint.io/getting-started/) e [Vitest](https://vitest.dev/guide/). Tutti gli strumenti aggiunti sono dipendenze di sviluppo; nessuna modifica alle dipendenze runtime.

Verifica 0.2 (2026-11-09): `npm run check` riuscito, 2 test superati, nessun warning lint o errore TypeScript. Nessun collaudo visivo browser o TV eseguito in questa fase.

La shell include ora una città animata decorativa. Header e sezioni sono interattivi; catalogo e rail sono collegati all’adapter mock dalla 1.3. D-pad disponibile dalla 1.4; impostazioni movimento complete ancora previste nelle prossime microfasi. Nessuna integrazione TV o servizio remoto presente.

Consultare `PROJECT_STATUS.md` per il punto di ripresa. Dopo ogni sessione aggiornare roadmap e contesto per consentire il passaggio a un altro IDE.

## Adapter mock — microfase 0.3

- `src/platform/contracts.ts`: interfacce indipendenti da React e webOS per capability, app, ingressi e switch domotici.
- `src/platform/mock/MockPlatformAdapter.ts`: simulazione locale con stato in memoria per istanza.
- `src/platform/mock/MockPlatformAdapter.test.ts`: test di successi, errori, capability assenti, integrità dello stato e isolamento.

Esempio d’uso del contratto (il catalogo è collegato alla pagina dalla 1.3):

```ts
import { MockPlatformAdapter } from './platform/mock/MockPlatformAdapter';

const platform = new MockPlatformAdapter();
const result = await platform.appCatalog.list();
if (result.ok) {
  // result.mode e ogni app.mode sono 'demo': mostrare sempre l'etichetta demo.
  console.log(result.data);
} else {
  console.error(result.error.code, result.error.message);
}
```

Tutti i metodi restituiscono `Result<T>` con `ok` e `mode`; le capability sono `simulated` oppure `unsupported` con motivo. Il mock non dichiara mai supporto reale del G5 e non enumera applicazioni installate. I dati non includono loghi o asset di terze parti.

Per simulare capability mancanti o guasti usare, per esempio, `new MockPlatformAdapter({ unsupported: { appLaunch: 'Avvio non supportato nello scenario demo' }, failures: { inputActivate: 'Ingresso demo non disponibile' } })`. Le chiavi configurabili sono descritte in `PROJECT_SPEC.md`. I comandi falliti non modificano lo stato; ingressi e switch si aggiornano solo in memoria. Lo stato si azzera ricreando l'istanza: mantenerne una condivisa quando si collegherà la UI.

Verifica 0.3 (2026-11-09): `npm run check` riuscito, **21 test complessivi** (19 adapter + 2 scaffold). Nessuna dipendenza aggiunta, nessuna chiamata TV o rete nel mock; nessun collaudo hardware effettuato.

## Tema e shell TV — microfase 0.4

La shell usa il tema neon in `src/themes/neon/tokens.css`: colori, font locali di sistema, spaziature, dimensioni, focus e durate. L'unità CSS `--tv-unit` scala con la superficie 16:9; a 1080p i testi base misurano circa 28px, a 4K circa 56px. Margini orizzontali del 4% e verticali di circa 4,4% proteggono i contenuti. Su finestre strette il layout passa a un flusso verticale con scorrimento.

Il logo è importato direttamente dall'SVG canonico, senza copie manuali. Con movimento ridotto, `<picture>` seleziona una versione ferma derivata dal medesimo SVG; in caso di errore compare il nome testuale esatto. La preferenza di sistema riduce anche le durate del tema. Impostazioni globali persistenti e idle dimming restano da implementare; la pausa dello sfondo è descritta nella sezione 1.1.

L’header è selezionabile dalla 1.2; le zone widget restano strutturali e non mostrano contenuti TV reali. La città è implementata in 1.1; rail disponibile dalla 1.3; widget ancora previsti nelle successive fasi 1.x. Nessuna immagine mockup è incorporata nella UI.

Verifica browser riproducibile della build (Chrome locale richiesto, nessuna dipendenza npm aggiuntiva):

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 5187 --strictPort
# In un secondo terminale:
node scripts/verify-shell.mjs
```

Lo script apre Chrome headless con profilo temporaneo, verifica 1080p/4K e finestra 390×844, logo, fallback testuale e reduced motion. Controlla anche che la timeline SVG normale avanzi per almeno due cicli di 9 secondi. Il profilo temporaneo viene rimosso a fine verifica. `CHROME_PATH` permette di indicare l'eseguibile Chrome su altri sistemi; `SHELL_URL` cambia l'URL della preview. Non eseguire questa verifica contro servizi remoti.

Le evidenze storiche della shell sono nel [rapporto 0.4](docs/verification/phase-0.4.md). Lo script ora include anche i controlli della città 1.1 e salva nuove evidenze in `docs/verification/phase-1.5/` (cartella configurabile con `VERIFY_OUTPUT`). Questa verifica manuale assistita è separata da `npm run check` perché richiede un browser installato e una preview attiva. Non certifica comportamento o leggibilità a distanza sul G5.

## Sfondo città e navette — microfase 1.1

Lo sfondo usa ora **`references/background.png`**, fornito e scelto dall’utente, importato direttamente da Vite e incluso nella build. Sostituisce i precedenti skyline vettoriali. Foschia, pioggia CSS e navette SVG sono livelli separati. I controlli sono componenti React separati: lo sfondo è decorativo, escluso dall'albero accessibile e non intercetta input. Sovrapposizioni scure proteggono header, testi e widget. Non ci sono filmati, meteo reale o richieste di asset esterni.

Le navette già dipinte nel PNG restano ferme. Due navette aggiuntive percorrono rotte con dimensioni e direzioni differenti, cicli sfalsati di 43 e 67 secondi e lunghi intervalli invisibili. Le scie sono discrete, senza lampeggi. Le animazioni usano transform/opacity, senza aggiornamenti React per frame. Le durate sono intenzionalmente deterministiche, non casuali, per rendere la scena riproducibile.

Il pulsante **Pausa sfondo** ferma gli effetti; **Riprendi sfondo** li riattiva. È accessibile con Tab e Invio/Spazio (anche con D-pad dalla 1.4). Movimento ridotto di sistema mantiene la città statica e nasconde navette/pioggia; la pagina nascosta sospende la scena. La pausa manuale dura per la sessione del componente, non è ancora un'impostazione persistente. Idle dimming e pausa per inattività restano in 3.3.

I gradienti CSS forniscono uno sfondo leggibile anche se l’immagine non si carica. Asset statici e fallback non dipendono da JavaScript per essere disegnati; l'app React richiede comunque JavaScript. Provenienza in [`src/assets/city/README.md`](src/assets/city/README.md); generatore dei precedenti asset vettoriali in `scripts/generate-city.py`, ora mantenuto per la navetta e lo storico.

Verifica con gli stessi comandi browser indicati sopra. Lo script controlla caricamento asset, reduced motion, timeline delle navette, pausa da tastiera, evento visibilitychange e fallback grafico. Screenshot dei voli campionano un momento deterministico nelle finestre animate; non sono una registrazione video.

Verifica 1.1 (2026-11-09): `npm run check` riuscito, **29 test complessivi**. Evidenze: [rapporto con sfondo approvato](docs/verification/phase-1.1-background/report.md). Prestazioni e resa sul G5 ancora da verificare.

## Header e sezioni — microfase 1.2

La barra superiore include Home, App, Ingressi, Domotica e Impostazioni. Ogni pulsante cambia il contenuto centrale e indica la sezione corrente con bordo magenta e `aria-current`. Tab/Shift+Tab spostano il focus, Invio/Spazio selezionano; funziona anche il pointer. Il cambio sezione conserva il focus sul controllo. La navigazione D-pad è disponibile dalla 1.4, come descritto sotto.

Home mantiene le zone widget; le altre sezioni mostrano contenuti introduttivi e indicano le funzioni demo ancora da implementare. La pausa dello sfondo resta accessibile senza resettare la scena. Dalla 1.3 il catalogo e l’avvio usano il solo adapter mock locale; nessuna navigazione esterna viene attivata.

L’orologio mostra **ora e data reali del browser**, formato italiano 24 ore e fuso orario del dispositivo. Si aggiorna ogni secondo e al cambio visibilità; timer e listener vengono rimossi con il componente. Non certifica l’ora della TV. Il meteo non viene mostrato.

File: `src/app/ShellHeader.tsx`, `src/app/sections.ts`, `src/features/clock/`. Nessuna dipendenza aggiunta. `npm run check` passa con **31 test**; browser e screenshot aggiornati nel [rapporto 1.2](docs/verification/phase-1.2/report.md). Lo script `node scripts/verify-shell.mjs` verifica anche selezione, focus e aggiornamento orologio; richiede la preview locale attiva come indicato sopra.

## Rail applicazioni — microfase 1.3

Home e App mostrano sette applicazioni generiche dal MockPlatformAdapter condiviso in `src/app/App.tsx`. Le card usano simboli SVG neutri originali, senza marchi imitati: non dichiarano app installate sul TV. Ogni card riporta Demo, selezione magenta e focus cyan, cornici smussate a doppio contorno e dimensioni allineate alla fascia del riferimento approvato.

Tab/Shift+Tab cambiano focus e selezione; Invio/Spazio o click simulano l’avvio. Il messaggio di stato dichiara esplicitamente che non si apre nessuna app reale. L’avvio concorrente è bloccato; capability di avvio assente, caricamento, catalogo vuoto e errori sono gestiti separatamente. I risultati attesi o le Promise rifiutate non producono falsi successi.

Il rail resta montato durante il cambio sezione per conservare selezione e feedback; viene nascosto fuori da Home/App. Nessuna persistenza su reload. Il focus manager a frecce è disponibile dalla 1.4. Su finestre strette scorre il solo rail senza allargare la pagina.

File in `src/features/apps/`. Nessuna nuova dipendenza. `npm run check`: **37 test**, lint/typecheck/build riusciti. Browser e confronto visivo con references 00/01 nel [rapporto 1.3](docs/verification/phase-1.3/report.md). La città Home è libera dal testo introduttivo; loghi autentici, dettagli header e widget completi sono ancora scostamenti dal mockup, non fedeltà già raggiunta.

## Navigazione D-pad — microfase 1.4

| Comando browser | Comportamento |
| --- | --- |
| Primo tasto freccia senza focus | Aggancia la sezione header corrente |
| Sinistra / Destra | Sposta il focus nella stessa zona, fermandosi ai bordi |
| Su / Giù | Passa tra header, pausa sfondo quando abilitata e rail quando visibile |
| Invio / Spazio | Attiva il pulsante nativo; Invio non genera doppi click |
| OK / Accept / Select | Alias di attivazione per eventi consegnati alla pagina |
| Escape / Back / BrowserBack / Backspace | Torna Home e focalizza Home |
| Tab / Shift+Tab | Mantiene la navigazione nativa del browser |

Ogni zona ricorda l’ultimo controllo focalizzato. La prima entrata in una zona usa l’indice più vicino quando manca memoria; hidden/inert e pulsanti nativamente disabilitati sono esclusi. Card con `aria-disabled` restano raggiungibili per leggere lo stato, ma l’azione è bloccata. Il controllo pausa disabilitato da reduced motion viene saltato.

Il focus resta sul controllo durante aggiornamenti del clock, caricamento e feedback di avvio. Se il controllo scompare o viene nascosto/disabilitato, ritorna alla sezione header corrente. Il rail scorre quanto basta per mostrare la card, senza animazione di scroll. Bordi senza wrapping; nessuna trappola di focus.

La gestione è limitata alla shell: campi editabili, dialoghi, modificatori e controlli esterni non vengono gestiti dal focus manager. Non intercetta il pulsante Home di sistema e non usa API webOS privilegiate. Il Back di questa fase è un ritorno Home; stack di overlay/cronologia arriveranno in 3.1. La mappatura hardware G5 resta da verificare.

File `src/navigation/`; `npm run check` passa con **58 test**. [Rapporto 1.4 e prove browser](docs/verification/phase-1.4/report.md). Nessuna modifica alla grafica approvata o nuova dipendenza.

## Continua a guardare — microfase 1.5

Il primo widget della Home mostra **Neon District**, titolo fittizio demo, con posizione 38 min su 80 (47,5%) e 42 minuti rimanenti. Il contenuto, la durata e il progresso non provengono da app streaming o storico TV. La miniatura riusa lo sfondo background.png fornito dall’utente, senza artwork di film o loghi di terzi.

Giù dal rail raggiunge Riprendi; Su torna alla card ricordata. Invio/OK o click mostra “Ripresa simulata… Nessun video avviato”. Non parte un player e il progresso non cambia. Barra progress accessibile, nome del controllo con etichetta Demo e messaggio live. Il widget è solo in Home; messaggio azzerato uscendo, dati demo invariati.

File in `src/features/continue-watching/`. `npm run check`: **64 test**, lint/typecheck/build riusciti. [Rapporto e screenshot 1.5](docs/verification/phase-1.5/report.md). Ingressi e domotica restano nelle 1.6/1.7.

## Debug interattivo browser — disponibile già ora

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Aprire http://127.0.0.1:5173 nel browser. Se la porta è occupata, fermare il server del progetto già avviato oppure scegliere un’altra porta. Il dev server aggiorna la pagina quando si salvano i sorgenti; per fermarlo usare Ctrl+C. La preview della build su 5187 usata dai test è un processo separato e non sostituisce il dev server per il debug dei sorgenti.

Con gli strumenti sviluppatore del browser (Ispeziona) si possono controllare Console, sorgenti e breakpoint, layout e richieste di rete. Per seguire il focus dalla Console usare `document.activeElement`; per le prove usare frecce, Invio e Escape nella pagina, riportandovi prima il focus dopo aver usato DevTools.

Dopo la **1.8**, come richiesto, faremo una sessione interattiva di collaudo della Home completa prima della fase 3: confronto references a 1080p/4K, navigazione senza mouse, widget e feedback demo, console/rete, movimento ridotto e difetti visivi. Esiti e interventi andranno nel contesto e nel rapporto di verifica. I controlli automatici headless sono già disponibili, ma questa sessione con l’utente non è ancora stata svolta. Non serve installare l’app sulla TV per iniziare il debug browser.

## Pacchetto e successivo deploy sulla TV LG OLED G5

**Installazione/avvio e aggiornamenti della nostra app eseguiti sulla G5 nella4.4 richiesta dall'utente**, ultima versione0.4.3. La build browser dist/ è distinta dallo stage webOS dist-webos/; non confezionare sorgenti o cartella progetto. La delega di questo collaudo non introduce deploy automatici futuri.

Prerequisiti: Node>=22.12 (verificato24.22.2), npm, CLI ufficiale @webos-tools/cli3.2.6 separata dal frontend. Per un nuovo PC seguire il [dossier4.1](docs/webos/PHASE_4_1.md): stessa rete, Developer Mode valida, Key Server per getkey, alias glitch-g5, chiave fuori Git. Modello/firmware/SDK e accesso CLI di questo PC già verificati; non rifare pairing se valido. Installazione CLI se assente:

```powershell
npm install -g @webos-tools/cli@3.2.6
ares -V
```

Dalla radice, dopo npm ci su un nuovo checkout:

```powershell
npm run check
npm run package:webos
npm run verify:webos
ares-package --info artifacts/com.stefcors.glitchos_0.4.3_all.ipk
```

Questi controlli sono stati eseguiti fino alla0.4.3. Installazione/avvio/Inspector sotto sono riusciti nella4.4; per un successivo aggiornamento autorizzato rigenerare e usare il nome IPK della nuova versione:

```powershell
ares-device --device glitch-g5 --system-info
ares-install --device glitch-g5 artifacts/com.stefcors.glitchos_0.4.3_all.ipk
ares-launch --device glitch-g5 com.stefcors.glitchos
ares-inspect --device glitch-g5 --app com.stefcors.glitchos
```

Per chiudere l'app prima di un aggiornamento: `ares-launch --device glitch-g5 --close com.stefcors.glitchos` (riuscito in4.4). Per rimuovere **solo la nostra app**, quando richiesto: `ares-install --device glitch-g5 --remove com.stefcors.glitchos` (non eseguito). [webos/README.md](webos/README.md) dettaglia Console/Network, endpoint Inspector da rinnovare dopo riapertura, rigenerazione icone, test file:// e gestione della sessione Developer Mode. La lettura remota e le osservazioni utente del rapporto4.4 restano distinte dai test con bridge sintetico.

Il deploy previsto è quello di un'app standalone. Root, sostituzione della Home, rimappatura del telecomando e avvio automatico rimangono nelle fasi separate con le rispettive autorizzazioni.

### Widget ingressi — 1.6

La Home mostra HDMI 1, HDMI 2, HDMI 3 e TV dal mock condiviso, tutti Demo. Freccia giù dal rail raggiunge i widget; sinistra/destra passa tra ripresa e sorgenti, Enter/OK simula il cambio, su torna al rail ricordato. Il magenta indica la sorgente attiva, il contorno cyan il focus. Errori e capability assenti non producono falsi successi. Lo stato resta tra sezioni e si azzera ricaricando la pagina; la sezione Ingressi resta introduttiva. Nessun comando inviato alla TV. Evidenze: `docs/verification/phase-1.6/report.md`.

### Widget domotica — 1.7

La Home mostra luce soggiorno e presa Demo dal mock condiviso. Frecce sinistra/destra passano dagli ingressi ai due interruttori; Enter/OK o Spazio accendono/spengono in simulazione, su torna al rail ricordato. Stato testuale e aria-checked cambiano solo dopo successo; gli errori non cambiano lo stato. La selezione resta tra sezioni e si azzera su reload. Nessuna connessione Home Assistant o comando reale. La sezione Domotica resta introduttiva. Evidenze e differenze visive: `docs/verification/phase-1.7/report.md`.

### Movimento e logo — 1.8

In Impostazioni, Movimento ridotto attiva una riduzione globale oppure lascia seguire il sistema; Animazione logo consente o disattiva il glitch. Le due preferenze sono salvate localmente nel browser, senza rete. La richiesta di movimento ridotto del sistema prevale sempre, anche dopo aver consentito il logo. Riduzione globale: sfondo/navette/logo statici e transizioni disattivate. La pagina nascosta ferma sfondo e logo; tornando visibile si riapplica la policy. Pausa sfondo resta separata, non persistente e non ferma il logo. Se localStorage è bloccato, un avviso indica che le preferenze valgono solo per la sessione. Per ripristinare i valori iniziali: disattivare Movimento ridotto e consentire Animazione logo; il sistema continua ad avere precedenza. Prossimo checkpoint: debug interattivo browser, prima della fase 2.

## Home unica — modifica layout approvata dall’utente

La navigazione superiore per sezioni è stata eliminata su richiesta utente. Header con solo brand e orologio; app, Continua a guardare, ingressi e domotica sono sempre nella Home. Il controllo espandibile “Movimento e logo” contiene le preferenze esistenti. Frecce percorrono controls → rail → widgets → settings (solo se aperte); primo input direzionale e Back/Escape portano alla prima app, Back richiude anche le preferenze. Mantiene badge Demo, sfondo e componenti reali. Questa decisione sostituisce le precedenti indicazioni sulle cinque sezioni; i riferimenti 00/01 restano guida estetica, con eccezione esplicita del menu rimosso. Verifiche correnti: scripts/verify-shell.mjs; vecchio collaudo sezioni conservato in scripts/verify-shell-sections-legacy.mjs, non compatibile con UI attuale.

## Policy corrente — animazioni fisse, senza controlli

Su richiesta utente rimossi “Movimento e logo” e “Pausa sfondo”: nessun pannello o preferenza modificabile nella Home. Sfondo e logo animati automaticamente quando la pagina è visibile e il sistema non richiede movimento ridotto. Reduced motion e pagina nascosta continuano a fermarli automaticamente. La vecchia chiave localStorage glitchos.motion.v1 è ignorata; le precedenti descrizioni di impostazioni e pausa sono storico, sostituite da questa decisione. Primo input direzionale e Back tornano al rail; frecce tra rail e widget. Evidenze correnti in docs/verification/fixed-motion/.

## Pianificazione aggiornata — nuova fase 2

Fase 1 chiusa per approvazione utente. Prossimo lavoro: 2.1 — architettura/config e background originale del [Cyberpunk Animated Background Engine](docs/specs/CYBERPUNK_BACKGROUND_ENGINE.md), seguito da pioggia, nebbia/neon, ologramma/particelle, profili/pannello tecnico e ottimizzazione. Il motore non è ancora implementato. Il pannello sarà solo sviluppo o diagnostica esplicitamente abilitata; la Home finale resta senza impostazioni movimento. Le vecchie fasi 2–6 sono ora 3–7; deploy TV in 4.1–4.4. Nessun nuovo comando o dipendenza introdotti.

## Base motore 2.1 implementata

La Home usa ora CyberpunkBackgroundEngine in src/features/background/. [Contratti, unità e ciclo di vita](src/features/background/README.md). Immagine originale invariata con object-fit cover e fallback gradiente/avviso; nessun video. Config tipizzata con Balanced predisposto, coordinate normalizzate e controller RAF testato ma non istanziato dalla base statica. Vecchi layer CSS CityBackdrop non più montati per evitare duplicazioni. Nessun effetto nuovo ancora attivo: pioggia in 2.2, nebbia/neon/ologrammi/particelle nelle microfasi successive. Il logo conserva riduzione sistema e sospensione pagina nascosta. `npm run check`: 91 test, lint/typecheck/build OK; nessuna dipendenza nuova o garanzia hardware. Evidenze in docs/verification/phase-2.1/.

## Pioggia Canvas 2.2 implementata

Primo effetto del CyberpunkBackgroundEngine attivo: RainEngine con pool fisso, profondità/vento/scie sfumate e BackgroundCanvas con controller RAF. Niente stato React per frame; buffer massimo 1920×1080 anche con UI 4K, DPR limitato, target 30fps da misurare su TV. Stop con reduced motion/pagina nascosta, cleanup RAF/listener/observer/sprite, fallback statico se context assente o errore. Originale PNG preservato. Config rain.enabled default true, altri effetti off. Dettagli in src/features/background/README.md, evidenze docs/verification/phase-2.2/. Milestone 1 completata; prossima 2.3 nebbia. Nessuna dipendenza nuova o test G5.

## Nebbia 2.3 implementata

FogLayer aggiunge due veli originali a gradienti radiali trasparenti cyan/magenta nella parte inferiore, dietro UI/scrim. Transform/opacity CSS e cicli alternate molto lenti senza filtri pesanti, nessun RAF o listener aggiuntivo. fog.enabled/density/speed indipendenti; default true/35/.2, semiperiodi 120/170s; density zero/off elimina layer, speed zero resta statico. Reduced motion e pagina nascosta pausano la timeline; visibilità riprende la fase. PNG e pioggia preservati. Contratto nel README tecnico background, evidenze docs/verification/phase-2.3/. npm run check: 99 test e lint/typecheck/build OK. Prossima 2.4 neon; nessuna prova G5.

### Calibrazione dopo riscontro sulla visibilità

Pioggia e nebbia sono state rese più percepibili: effetti sopra lo scrim dell’immagine ma sotto UI, scie più spesse e luminose, nebbia leggermente più alta e cicli 60/85s con drift ±8%. Il PNG e i widget restano invariati. Dettagli e valori aggiornati nel README tecnico background; evidenze docs/verification/effect-visibility/. Riduzione movimento di sistema continua a fermare gli effetti; in DevTools verificare che Rendering non emuli prefers-reduced-motion: reduce se si desidera osservarli.

## Neon 2.4 implementati

NeonLayer CSS con cinque insegne e due riflessi localizzati sul PNG originale, regioni normalizzate tipizzate e validate con id/color/kind. Dimensioni naturali caricate e mapRegion conservano l’allineamento cover dopo resize. Pulsazioni lente e lievi cali occasionali, nessun flash o filtro sull’intera immagine; riflessi attenuati. Off/zero/asset assente rimuove layer, sistema reduced motion/pagina nascosta fermano movimento. Pioggia e nebbia mantengono taratura corrente. Dettagli in src/features/background/README.md, evidenze docs/verification/phase-2.4/. 104 test e lint/typecheck/build OK; nessuna dipendenza o prova G5. Prossima 2.5 ologramma; volto non animato in questa fase.

Neon rafforzati su richiesta utente: intensità default 100 e pulsazione più evidente, sempre solo sulle regioni configurate. Pioggia/nebbia invariate; dettagli nel README tecnico background, evidenze docs/verification/neon-strength/.

## Ologramma 2.5 implementato

Neon leggermente più rapidi su richiesta utente (semicicli -20%, 3.6–7.92s); intensità/pioggia/nebbia invariate. HologramLayer con mask poligonale calibrata sul pannello del volto, scanline, sweep e luce; brevi split rosso/cyan e bande ricavate dal PNG con traslazioni max3px. Nessun filtro/distorsione sull’intera scena, asset originale intatto. Glitch false/frequenza zero elimina distorsioni, periodo minimo6s; sistema reduced motion e pagina nascosta fermano/nascondono layer. Coordinate cover e resize condivisi con neon, cleanup senza RAF JS aggiuntivo. Contratti nel README tecnico background, evidenze docs/verification/phase-2.5/. npm run check: 110 test, lint/typecheck/build OK. Prossima 2.6, nessuna prova G5.


## Particelle e predisposizione veicoli 2.6

40 particelle cyan/magenta con profondità e deriva lenta nel Canvas della pioggia: pool fisso, due sprite riutilizzati, un solo RAF e buffer Full HD massimo. Pioggia e particelle disattivabili separatamente nella config TypeScript; nessun controllo aggiunto alla Home. Pausa automatica con reduced motion/pagina nascosta e fallback su PNG quando Canvas manca. Modulo FlyingVehicleEngine standalone predisposto per un futuro sprite trasparente: default off e non montato, nessun veicolo del PNG spostato o duplicato. Tarature pioggia/nebbia/neon/ologramma preservate. Contratto nel [README tecnico](src/features/background/README.md), rapporto [fase2.6](docs/verification/phase-2.6/report.md). npm run check:117 test, lint/typecheck/build OK. Milestone3 chiusa; prossima2.7 profili prestazionali. Nessuna nuova dipendenza o prova G5.


## Profili prestazionali 2.7

`background.config.ts` risolve controlli canonici → configurazione effettiva: Balanced predefinito conserva la resa approvata (208 gocce/40 particelle); Cinematic aumenta dettaglio atmosferico (291/80 con default), sempre entro buffer Full HD/DPR1 e target30fps; Eco usa il PNG statico e smonta gli effetti decorativi. Limiti inferiori personalizzati rispettati, flag off/zero preservati, nessun cambio automatico o controllo Home aggiunto. Per cambiare profilo passare al motore una nuova config canonica con il campo profile; il pannello arriverà in2.8.

Monitor Canvas leggero su finestre di almeno2s: cadenza reale dei draw e costo CPU medio/massimo, senza RAF aggiuntivi o stato React/frame. Espone attributi diagnostici sul Canvas e callback opzionale onPerformanceSample; non misura GPU/CSS né certifica prestazioni G5. Contratti, budget, fixture di sviluppo e comando per testare i cambi profilo nel [README tecnico](src/features/background/README.md). Nessuna dipendenza nuova; dettagli nel [rapporto2.7](docs/verification/phase-2.7/report.md).

Verifiche2.7:127 test, lint/typecheck/build e Chrome produzione/fixture superati; cambi profilo senza risorse duplicate, Eco/unmount senza RAF/observer/listener resize del motore. Campione locale headless ~21.84draw/s: target30fps non certificato, TV non provata. Roadmap e contesto aggiornati; prossima2.8 — Pannello tecnico di sviluppo.


## Pannello tecnico background 2.8

Avvia `npm run dev` e apri l’indirizzo stampato da Vite aggiungendo `?backgroundDebug=1`, per esempio `http://localhost:5173/?backgroundDebug=1`. Compare il pulsante **Sfondo · debug**; il pannello parte chiuso e si apre solo premendolo. Senza parametro la Home di sviluppo resta pulita. La build ordinaria di produzione ignora il parametro ed esclude codice e CSS del pannello.

Controlli live: intensità pioggia0–100%, velocità0–5× (passo.1), densità nebbia0–100%, luminosità neon0–100%, particelle0–200, glitch ologramma, Cinematic/Balanced/Eco e reset completo ai default approvati. I valori sono canonici: la riga “Effettivi” mostra conteggi e limiti dopo il profilo, per rendere visibile il cap80 particelle Balanced e il moltiplicatore Cinematic. Eco conserva i valori per il ritorno agli altri profili. La policy sistema/visibilità continua a prevalere.

Tab/Shift+Tab percorrono i controlli nativi; frecce regolano slider e select. Escape/Back o Chiudi chiudono il pannello e riportano il focus alla prima app Home. Il pannello non è modale: le app restano raggiungibili con puntatore o Tab. Modifiche solo in memoria, mantenute alla chiusura; reload o reset ripristina i default. Nessun nuovo salvataggio o controllo movimento nella Home finale.

Implementazione: HomeBackground carica lazy BackgroundWorkbench solo in sviluppo con opt-in esplicito; stato isolato dal resto della Home, BackgroundSettings controllato e settingsPolicy con validazione intervalli/passaggi. Nessuna libreria aggiunta. Contratti e collaudo nel README tecnico background e in docs/verification/phase-2.8/report.md. Nessuna prova G5.

Verifiche2.8:132 test, lint/typecheck/build e Chrome Home/profili/pannello superati. Report docs/verification/phase-2.8/report.md; contesto sincronizzato e milestone4 chiusa. Prossima2.9 — Ottimizzazione e stabilità; nessuna prestazione TV certificata.
