# Microfase 3.5 — Verifica MVP browser

Data: 2026-11-10. Base Git `4742c5e`, lavoro locale3.2–3.4 preservato. Versione applicativa locale **0.3.4**, nessuna nuova dipendenza, commit, tag, push o pubblicazione. Solo collaudo e documentazione: nessuna modifica ai componenti, asset o tarature del prodotto.

## Perimetro e criteri

Chiusura della fase3 nel mock browser: controlli lint/TypeScript/test/build, navigazione di tutte le14 azioni Home senza mouse, Tab/Shift+Tab, nomi/ruoli e riferimenti accessibili, isolamento del dialogo, focus visibile e ritorno all'origine; screenshot1080p/4K e regressioni mobile. Ripetere anche stati limite/offline, due attese idle reali e prova animazioni attive5min. Risultati e limiti devono restare separati dalle prove TV, screen reader e GPU non svolte.

Nuovo `scripts/verify-mvp.mjs`, opt-in `MVP_TEST=1` dentro verify-shell. Ispeziona DOM e albero AX Chromium, percorre tutte le app e i widget con D-pad/Enter/Back, ordine Tab e inversione, focus su schermo, nessun asset esterno all'avvio, risoluzione Canvas e30 campioni input→prossimo RAF per viewport. Non introduce librerie o codice di test nella build.

Il controllo del focus accetta sia outline nativo dei widget sia la cornice SVG interna cyan delle app: quella approvata evita il taglio della cornice da overflow del rail. Le misure di latenza partono dal listener capture keydown nel browser e terminano nel RAF successivo; non includono trasporto CDP, input fisico, paint effettivo, compositing GPU o scansione pannello. I tempi di caricamento locali non sono misure cold-cache pubbliche o Core Web Vitals.

## Esecuzioni e verifiche

- `npm run check` sulla0.3.4: **156 test in23 file**, lint, TypeScript e build superati. Build runtime identica alla3.4: index-Cqy5H5Vl.js, index-Bly57XtD.css; cambiati versione package/root lockfile e strumenti/documenti.
- run-1: collaudo interrotto prima di salvare la matrice MVP. La pulizia del profilo temporaneo Edge ha prodotto EBUSY, mascherando l'errore originale. Nessun successo attribuito a quel run.
- Corretto verify-shell: valida che il profilo da rimuovere sia quello mkdtemp creato dallo script sotto tmpdir; retry limitati per i lock Windows. Un cleanup ancora fallito è segnalato e non copre l'errore del test.
- run-2: errore effettivo nel nuovo test del focus, che assumeva un outline CSS per tutte le card. Le app usano già la cornice SVG approvata: corretto il criterio del test, nessuna modifica o regressione UI dedotta.
- run-3: parte1080p DOM/AX,14 azioni, Tab e30 misure focus completate; arresto su un'ulteriore assunzione del test che attendeva un dialogo dopo ArrowDown. La navigazione ricorda correttamente l'ultimo widget: ora il test percorre esplicitamente la riga fino a Riprendi prima di attivarlo. Nessuna modifica runtime.
- **run-4 superato, exit0**: matrice MVP1080p/4K, idle, stati limite, regressioni e stabilità. Evidenze finali nella cartella `run-4/`; i run precedenti restano separati e incompleti. Controlli npm ripetuti dopo le correzioni degli script:156 test in23 file, lint/typecheck/build OK, nessun cambiamento runtime.

### Risultati finali

`mvp-metrics.json`:14 controlli con nome e provenienza Demo per ciascuna risoluzione, un main e un h1, italiano, ID unici, riferimenti ARIA risolti e immagini con alt. Tutte le14 azioni raggiunte/attivate da D-pad/Enter, Tab nell'ordine DOM e Shift+Tab inverso. Durante il dialogo solo Chiudi è esposto come pulsante nell'albero AX, titolo/descrizione disponibili; ritorno focus verificato per ogni app e Riprendi. Nessun overflow TV, Canvas massimo1920×1080 anche in4K, risorse d'avvio locali. Non è una scansione completa WCAG o un test con screen reader.

| Viewport | Campioni focus | Mediana | P95 | Massimo |
| --- | ---: | ---: | ---: | ---: |
| 1920×1080 | 30 | 9,4ms | 13,9ms | 14,7ms |
| 3840×2160 | 30 | 10,5ms | 54,0ms | 100,0ms |

Sono campioni keydown→prossimo RAF, con un picco4K di100ms: non si deduce latenza uniforme, prestazione TV o tempo fino al pixel. Nessuna soglia hardware inventata.

`idle-metrics.json`: Home120.211ms, dialogo120.165ms, attese reali; opacità Home0,45 e dialogo0,450779 entro tolleranza0,01 mentre termina la transizione. Sfondo statico/logo still, focus invariato; primo input risveglia ed esegue normalmente, sistema reduce e hidden/ritorno prioritari.

`platform-metrics.json`: errori, liste vuote, capability, retry da D-pad, risposte tardive e duplicati superati; scadenza lettura osservata dopo10.211ms reali. Demo operativa con offline CDP, nessuna verifica Internet esterna. Regressioni pointer/simulatore, dialoghi/alias/Back/focus e background complete; `shell-metrics.json` contiene **runtimeErrors=[]**,1080p/4K senza overflow e mobile390×844 con solo scroll verticale previsto.

`stability.json`: Home produzione Balanced,1080p/DPR1, **300.035ms** e30 campioni con input Shift periodico. **29,99–30,01 draw/s**, media CPU Canvas0,327–0,402ms/draw, massimo osservato0,7ms. Un RAF/Canvas,5 sprite,3 listener resize e3 observer stabili; zero risorse del motore dopo unmount.30 cambi profilo/resize e120 slider riusciti. Heap JS dopo GC14.669.012→14.727.600byte (**+58.588, circa0,40%**); contatori CDP nodi1986/listener1266 invariati. Nessuna crescita incontrollata osservata nei5min, senza garantire assenza di leak o stimare memoria GPU/processo. Finestre CSS on/off nel JSON sono contatori main thread, non un benchmark del compositing.

Comando, con server preview5187 e Vite dev5188 già avviati:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:VERIFY_OUTPUT = 'docs/verification/phase-3.5/run-4'
$env:PROFILE_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/background-profiles.html'
$env:BACKGROUND_TEST_URL = 'http://127.0.0.1:5188/'
$env:PLATFORM_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/platform-states.html'
$env:MVP_TEST = '1'
$env:IDLE_TEST = '1'
$env:STABILITY_MS = '300000'
node scripts/verify-shell.mjs
```

I flag sono indipendenti; scegliere sempre una cartella evidenze nuova. `IDLE_TEST` significa attesa reale senza input, `STABILITY_MS` mantiene la scena sveglia tramite Shift DOM sintetico periodico e lo dichiara nei risultati. STABILITY include stress30 profili/resize,120 slider, cleanup, conteggi risorse, heap JS dopo GC e finestre main thread CSS on/off. Non è un benchmark GPU né una prova di assenza assoluta di leak. Nessun nuovo profiling allocazioni (ALLOCATION_MS non abilitato).

## Confronto visivo e limiti

Guide visuale/animazione, riferimento brand00 e layout01 ispezionati prima del lavoro; PNG SHA256 verificato invariato7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482. Ispezionati manualmente da screenshot: mvp-home1080p/4K, dialogo1080p e Home idle1080p di run-4. Il4K è stato visualizzato ridotto a2048×1152. Focus cyan/magenta, dialogo centrato e testo, tre widget e proporzioni16:9 restano coerenti con lo stato approvato; nessuna modifica visiva introdotta. I feedback dopo le azioni sono visibili e possono andare a capo, più densi rispetto ai riferimenti. Restano le eccezioni approvate (Home unica, menu e controlli movimento rimossi) e differenze pregresse di header/logo, simboli Demo, cornici/widget e footer; nessuna piena fedeltà dichiarata. Nessuna prova umana dal divano, sessione interattiva utente o misura automatica del contrasto su superfici traslucide: leggibilità e contrasto fisico richiedono ancora verifica sul display.

Ambiente Windows11 Pro N10.0.26300 x64, Node24.22.2/npm11.19.1, **Edge157.0.4341.42** headless --disable-gpu (versione riportata dal browser nel JSON, diversa dallo storico156). NVM4306 blocca npm nella sandbox: controlli fuori sandbox autorizzati, senza cambiare trust/dipendenze. Tastiera/pointer/rete/hidden tramite CDP o DOM, guasti sintetici. AX/DOM e revisione screenshot non certificano WCAG, lettura screen reader, dal divano o su Magic Remote. Nessun altro browser/sistema operativo, fresh install, TV/GPU o produzione remota collaudati in3.5. Installazione da lockfile resta prova storica2.9.

La prossima4.1 riguarda inventario dispositivo e fattibilità SDK; richiederà dati reali di modello/firmware/webOS e accesso Developer Mode. Nessuna API privilegiata, packaging, deploy, sostituzione Home, root o patch autorizzati da questa verifica.

## Punto di ripresa

**3.5 e fase3 completate nel browser**, versione locale0.3.4, con i limiti espliciti sopra. Nessun controllo richiesto ancora aperto nel perimetro browser locale. Prossima **4.1 — Inventario dispositivo e fattibilità SDK**, non avviata: acquisire i dati reali del dispositivo prima di SDK/packaging. Nessun commit/tag/release/push/deploy.
