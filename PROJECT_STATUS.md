# StefCors GL1tCh 0S — Stato e passaggio tra IDE

Ultimo aggiornamento: 2026-11-08.

## Stato verificato

Il repository contiene il kit di progettazione v3 e lo scaffold React + TypeScript strict + Vite. La pagina iniziale è statica e identifica la preview browser. Sono presenti package.json, lockfile, entry point, modulo app, CSS essenziale e configurazioni; non sono ancora presenti Home interattiva, adapter o test.

- Microfase attiva: nessuna.
- Prossima microfase: `0.2 — Controlli di qualità` in `ROADMAP.md`.
- Microfasi implementative completate: `0.1`.
- Bloccanti per 0.2: nessuno identificato.
- Gate futuri: firmware/webOS esatti e accesso al G5 non disponibili; integrazioni e sostituzione Home non verificate.

## Decisioni da preservare

- Sviluppo in microfasi, una alla volta; prima preview browser con mock tipizzati.
- Stack previsto: React, TypeScript strict, Vite; niente grandi librerie o servizi senza approvazione.
- Brand esatto `StefCors GL1tCh 0S`; SVG canonico in `assets/branding/`.
- Direzione Neon City + Netrunner; riferimento branding 00, layout 01. Mockup come riferimenti, non schermate interattive.
- Tutti i dati esterni iniziali sono demo; loghi applicazioni autentici con provenienza o fallback neutri.
- Nessuna autorizzazione a root, patch, intercettazione Home o override di avvio.

## Ripresa operativa

1. Leggere `START_HERE.md` e i documenti nell'ordine indicato.
2. Controllare file reali, `git status` e differenze locali: questo documento non sostituisce il codice.
3. Per 0.2, configurare lint, script typecheck separato e runner leggero; scegliere un test significativo e documentare i controlli. Il build include già TypeScript strict.
4. Eseguire le verifiche disponibili e annotare comandi, esiti e limiti. Non dichiarare test TV o browser eseguiti senza averli eseguiti.
5. Aggiornare stato, prossimo passo e storico in questo file, più roadmap e documentazione interessata.

## Verifiche attuali e limiti

- Letti tutti i documenti del kit, codice SVG e anteprima HTML; ispezionati i cinque PNG.
- Il codice SVG dichiara ciclo di 9 secondi e media query reduced motion; animazione non collaudata in browser o su TV.
- Installazione npm e `npm ci` riuscite; installazione pulita da lockfile e build verificate in cartella temporanea con cache locale.
- `npm run build`: OK (TypeScript strict senza emissione + Vite, 16 moduli trasformati).
- `npm run dev -- --host 127.0.0.1 --strictPort`: avvio OK; GET pagina e modulo React trasformato riusciti via HTTP sulla porta 5173.
- Rendering visivo browser, 1080p/4K e runtime React nel browser non ancora collaudati. Server di sviluppo lasciato attivo per la preview; se non disponibile riavviare con `npm run dev`.
- Lint, runner test e script typecheck separato assenti: previsti in 0.2. Nessuna logica di navigazione o adapter introdotta in 0.1.
- Ambiente: Node 24.22.2, npm 11.19.1; React/React DOM 19.3.1, Vite 8.3.6, plugin React 6.2.1, TypeScript 7.0.2.
- Sandbox: download npm e apertura/accesso porta locale hanno richiesto escalation; nessuna modifica alle API TV.
- npm 11 segnala lo script opzionale fsevents non approvato; installazione e build riescono senza abilitarlo.
- Nessun test sul dispositivo LG eseguito.

## Storico sintetico

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
