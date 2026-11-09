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

## Deploy sulla TV LG OLED G5 — procedura da completare nella fase 4

**Stato: non ancora disponibile né verificato sul dispositivo.** La build browser in `dist/` non è ancora un pacchetto installabile sulla TV. Questa sezione sarà aggiornata con tutte le operazioni e i comandi effettivamente collaudati durante le microfasi 4.1–4.4.

La procedura completa dovrà coprire, nell'ordine:

1. Rilevamento di modello completo, firmware e versione webOS; verifica dei requisiti e delle API pubbliche supportate.
2. Preparazione del computer: strumenti webOS richiesti, versioni verificate e istruzioni di installazione per il sistema operativo utilizzato.
3. Preparazione della TV in Developer Mode, connessione di rete e gestione della sessione secondo la documentazione ufficiale verificata in fase 4.1.
4. Configurazione del dispositivo di sviluppo, associazione e verifica della connessione; credenziali e chiavi conservate fuori dal repository.
5. Installazione delle dipendenze del progetto, controlli di qualità, build e preparazione di manifest, icone e asset per webOS.
6. Generazione del pacchetto IPK, con comando esatto, identificativo applicazione, versione e percorso dell'artefatto.
7. Installazione e avvio sul G5, con comandi collaudati e risultati attesi.
8. Collaudo di telecomando, Back/OK, focus, rendering, movimento ridotto, prestazioni e capability realmente disponibili.
9. Raccolta dei log e diagnosi dei problemi di connessione, packaging, installazione e avvio.
10. Aggiornamento dell'app, nuova installazione, disinstallazione e ripristino della precedente versione dell'app; gestione delle eventuali scadenze della sessione di sviluppo.

Per ogni passaggio registrare prerequisiti, comandi, risultato atteso, problemi noti e data/dispositivo di verifica. I comandi webOS saranno inseriti dopo la verifica della documentazione ufficiale e degli strumenti effettivamente disponibili, senza presentarli anticipatamente come testati.

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
