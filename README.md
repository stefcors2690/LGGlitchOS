# StefCors GL1tCh 0S — Codex Development Kit v3

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
- `src/app/App.tsx`, `src/app/TvShell.tsx`: shell statica TV con header, area scena, app e tre zone widget.
- `src/components/BrandLogo.tsx`: logo canonico, variante statica derivata per reduced motion e fallback testuale.
- `src/styles/global.css`, `src/themes/neon/tokens.css`: layout responsivo, palette, spaziature, tipografia e focus.
- `tsconfig.json`, `src/vite-env.d.ts`, `vite.config.ts`: configurazioni strict, tipi asset e build.

Il modulo platform è disponibile dalla microfase 0.3; features e navigation saranno aggiunti nelle rispettive microfasi.

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

I due test iniziali in `src/app/App.test.tsx` verificano il rendering statico React della shell, il brand esatto collegato al contenuto principale e l'indicazione della preview senza connessioni reali. Non verificano DOM interattivo, layout o focus: i test per adapter e navigazione saranno aggiunti con le rispettive implementazioni.

TypeScript è vincolato alla serie **6.0**: la 7 presente nello scaffold iniziale non soddisfa il peer requirement di typescript-eslint 8.72.1 (`<6.1`). Aggiornare compilatore e strumenti lint insieme, verificando compatibilità e lockfile.

Configurazioni basate sulle guide ufficiali di [typescript-eslint](https://typescript-eslint.io/getting-started/) e [Vitest](https://vitest.dev/guide/). Tutti gli strumenti aggiunti sono dipendenze di sviluppo; nessuna modifica alle dipendenze runtime.

Verifica 0.2 (2026-11-09): `npm run check` riuscito, 2 test superati, nessun warning lint o errore TypeScript. Nessun collaudo visivo browser o TV eseguito in questa fase.

La schermata è una shell statica: città, Home interattiva, collegamento UI all’adapter mock, D-pad e impostazioni movimento restano nelle prossime microfasi. Nessuna integrazione TV o servizio remoto presente.

Consultare `PROJECT_STATUS.md` per il punto di ripresa. Dopo ogni sessione aggiornare roadmap e contesto per consentire il passaggio a un altro IDE.

## Adapter mock — microfase 0.3

- `src/platform/contracts.ts`: interfacce indipendenti da React e webOS per capability, app, ingressi e switch domotici.
- `src/platform/mock/MockPlatformAdapter.ts`: simulazione locale con stato in memoria per istanza.
- `src/platform/mock/MockPlatformAdapter.test.ts`: test di successi, errori, capability assenti, integrità dello stato e isolamento.

Esempio per le future feature (non ancora collegato alla pagina):

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

Il logo è importato direttamente dall'SVG canonico, senza copie manuali. Con movimento ridotto, `<picture>` seleziona una versione ferma derivata dal medesimo SVG; in caso di errore compare il nome testuale esatto. La preferenza di sistema riduce anche le durate del tema. Non sono ancora presenti un'impostazione manuale o idle dimming.

Header e zone sono strutturali: non sono pulsanti o contenuti TV reali. Sfondo città, rail e widget arriveranno nelle fasi 1.x. Il fondo attuale è un gradiente CSS locale; nessuna immagine mockup è incorporata nella UI.

Verifica browser riproducibile della build (Chrome locale richiesto, nessuna dipendenza npm aggiuntiva):

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 5187 --strictPort
# In un secondo terminale:
node scripts/verify-shell.mjs
```

Lo script apre Chrome headless con profilo temporaneo, verifica 1080p/4K e finestra 390×844, logo, fallback testuale e reduced motion. Controlla anche che la timeline SVG normale avanzi per almeno due cicli di 9 secondi. Il profilo temporaneo viene rimosso a fine verifica. `CHROME_PATH` permette di indicare l'eseguibile Chrome su altri sistemi; `SHELL_URL` cambia l'URL della preview. Non eseguire questa verifica contro servizi remoti.

Screenshot e misure sono in [`docs/verification/`](docs/verification/): vedi [rapporto 0.4](docs/verification/phase-0.4.md). Questa verifica manuale assistita è separata da `npm run check` perché richiede un browser installato e una preview attiva. Non certifica comportamento o leggibilità a distanza sul G5.

## Deploy sulla TV LG OLED G5 — procedura da completare nella fase 3

**Stato: non ancora disponibile né verificato sul dispositivo.** La build browser in `dist/` non è ancora un pacchetto installabile sulla TV. Questa sezione sarà aggiornata con tutte le operazioni e i comandi effettivamente collaudati durante le microfasi 3.1–3.4.

La procedura completa dovrà coprire, nell'ordine:

1. Rilevamento di modello completo, firmware e versione webOS; verifica dei requisiti e delle API pubbliche supportate.
2. Preparazione del computer: strumenti webOS richiesti, versioni verificate e istruzioni di installazione per il sistema operativo utilizzato.
3. Preparazione della TV in Developer Mode, connessione di rete e gestione della sessione secondo la documentazione ufficiale verificata in fase 3.1.
4. Configurazione del dispositivo di sviluppo, associazione e verifica della connessione; credenziali e chiavi conservate fuori dal repository.
5. Installazione delle dipendenze del progetto, controlli di qualità, build e preparazione di manifest, icone e asset per webOS.
6. Generazione del pacchetto IPK, con comando esatto, identificativo applicazione, versione e percorso dell'artefatto.
7. Installazione e avvio sul G5, con comandi collaudati e risultati attesi.
8. Collaudo di telecomando, Back/OK, focus, rendering, movimento ridotto, prestazioni e capability realmente disponibili.
9. Raccolta dei log e diagnosi dei problemi di connessione, packaging, installazione e avvio.
10. Aggiornamento dell'app, nuova installazione, disinstallazione e ripristino della precedente versione dell'app; gestione delle eventuali scadenze della sessione di sviluppo.

Per ogni passaggio registrare prerequisiti, comandi, risultato atteso, problemi noti e data/dispositivo di verifica. I comandi webOS saranno inseriti dopo la verifica della documentazione ufficiale e degli strumenti effettivamente disponibili, senza presentarli anticipatamente come testati.

Il deploy previsto è quello di un'app standalone. Root, sostituzione della Home, rimappatura del telecomando e avvio automatico rimangono nelle fasi separate con le rispettive autorizzazioni.
