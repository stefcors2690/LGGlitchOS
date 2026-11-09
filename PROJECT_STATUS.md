# StefCors GL1tCh 0S — Stato e passaggio tra IDE

Ultimo aggiornamento: 2026-11-09.

## Stato verificato

Il repository contiene lo scaffold React + TypeScript strict + Vite, tema neon e shell TV 16:9 con logo canonico e fallback statico/testuale. Header, area scena, area app e tre zone widget sono strutturali e statici. Sono presenti ESLint, Vitest (21 test) e adapter mock tipizzato, ancora non collegato alla UI. Home interattiva e sfondo città assenti.

- Microfase attiva: nessuna.
- Prossima microfase: `1.1 — Sfondo e livelli visivi` in `ROADMAP.md`.
- Microfasi implementative completate: `0.1`, `0.2`, `0.3`, `0.4` (macrofase 0 conclusa).
- Bloccanti per 1.1: nessuno identificato.
- Gate futuri: firmware/webOS esatti e accesso al G5 non disponibili; integrazioni e sostituzione Home non verificate.

## Decisioni da preservare

- Sviluppo in microfasi, una alla volta; prima preview browser con mock tipizzati.
- Stack previsto: React, TypeScript strict, Vite; niente grandi librerie o servizi senza approvazione.
- Brand esatto `StefCors GL1tCh 0S`; SVG canonico in `assets/branding/`.
- Direzione Neon City + Netrunner; riferimento branding 00, layout 01. Mockup come riferimenti, non schermate interattive.
- Tutti i dati esterni iniziali sono demo; loghi applicazioni autentici con provenienza o fallback neutri.
- Nessuna autorizzazione a root, patch, intercettazione Home o override di avvio.
- Richiesta utente: mantenere nel README tutte le operazioni per il deploy sulla TV. Sezione già predisposta come non verificata; completarla con comandi ed esiti reali durante 3.1–3.4.

## Ripresa operativa

1. Leggere `START_HERE.md` e i documenti nell'ordine indicato.
2. Controllare file reali, `git status` e differenze locali: questo documento non sostituisce il codice.
3. Per 1.1, creare sfondo originale o con licenza documentata e fallback statico, separando scena e controlli. Rileggere i documenti visuali e ispezionare riferimenti 00/01. Conservare margini, tema e logo verificati in 0.4; non usare il mockup come sfondo dell’intera UI.
4. Eseguire le verifiche disponibili e annotare comandi, esiti e limiti. Non dichiarare test TV o browser eseguiti senza averli eseguiti.
5. Aggiornare stato, prossimo passo e storico in questo file, più roadmap e documentazione interessata.

## Verifiche attuali e limiti

- 0.4: `npm run check` OK (21 test, lint/typecheck/build). Verifica browser riproducibile con `node scripts/verify-shell.mjs`; rapporto docs/verification/phase-0.4.md.
- La shell non contiene pulsanti interattivi o focus manager. Focus token pronti; D-pad resta in 1.4, impostazione movimento in 1.8 e idle dimming in 2.3. Leggibilità da divano e prestazioni G5 non verificate.

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
