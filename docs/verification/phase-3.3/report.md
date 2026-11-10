# Microfase 3.3 — Transizioni e idle dimming

Data: 2026-11-10. Base Git `4742c5e` con lavoro locale3.2 presente e preservato. Versione locale0.3.2, nessuna dipendenza nuova, commit, tag, push o deploy. L'utente ha confermato **2 minuti** fra le attese proposte.

## Comportamento

Dopo120.000ms senza input visibile, shell e superficie del dialogo nativo passano a opacità CSS0,45 in600ms. Sfondo decorativo e logo si fermano tramite la policy esistente; PNG, widget, dialoghi e focus restano presenti. È opacità dell'interfaccia, non un comando alla luminosità hardware o una protezione OLED certificata.

Il primo input ripristina la normale opacità in180ms **e mantiene la sua azione**: nessun consumo o doppio input di risveglio. Tastiera, pointerdown, movimento effettivo pointer, wheel e click sono osservati in capture senza preventDefault/stopPropagation. Il puntatore fermo non proroga l'attesa. I comandi sintetici del simulatore contano come attività di sviluppo. Nessuna preferenza/manuale o nuova UI finale.

Pagina nascosta: timer idle cancellato, sfondo/logo comunque fermi per visibilità; al ritorno nuova attesa intera e luminosità normale. Reduced motion continua a prevalere dopo il risveglio e disabilita transizioni/animazioni CSS. Focus e memoria non vengono modificati dall'idle. Orologio locale e aggiornamenti UI non contano come input.

`IdleController.ts` usa clock/scheduler iniettati, un solo timeout a scadenza e timestamp dell'ultimo input. Nessun interval, polling o RAF aggiuntivo, nessun setState per input/frame mentre è già attivo. Allo scadere ricalcola il tempo residuo, in idle non tiene timer; dispose idempotente e listener rimossi dal nuovo hook useIdleDimming. useBackgroundMotion accetta idle con defaultfalse per preservare fixture/chiamanti; idle non cambia profilo, tarature o budget.

Comparsa dialogo con sola dissolvenza220ms, senza trasformare il contenitore dei tool fissi. Nessuna animazione dei marchi terzi, nuova scenografia o transizione di sezioni. Superficie modale attenuata esplicitamente perché il top layer nativo non deve sfuggire alla policy della shell.

## Verifiche

Windows11 Pro N10.0.26300 x64, Node24.22.2/npm11.19.1, Edge156 headless GPU disattivata. `npm run check`: **152 test in22 file**, lint, TypeScript e build superati. Dieci nuovi casi controller (scadenza, proroga senza timer per input, risveglio, hidden/input nascosti, ritorno da idle, cleanup e4 ritardi invalidi); un caso aggiuntivo policy verifica priorità idle/sistema/visibilità.

**Run finale superato**, dopo la rifinitura opacity-only: build0.3.2 `index-CAb1lB0v.js`/`index-Dp26bBog.css`,152 test/check OK e collaudo Edge completo con `runtimeErrors=[]`. Evidenze in `final/idle-metrics.json`, `final/shell-metrics.json`, `final/dialog-metrics.json` e `final/pointer-metrics.json`. Il run preliminare nella radice, anch'esso riuscito, resta separato.

- Home: idle osservato dopo **120.011ms** dal punto di partenza del test, opacità0,45, Canvas statico, logo still, focus app-demo-cinema conservato. Screenshot1080p/4K.
- Dialogo: idle osservato dopo **120.477ms**, focus action-dialog-close conservato, Canvas statico e logo still. Snapshot opacità shell/dialogo0,456605 durante completamento della transizione, entro la tolleranza assoluta0,01 dal target0,45; durata CSS0,6s. Screenshot1080p. Sono attese reali, nessuna accelerazione del clock o configurazione di produzione abbreviata.
- Risveglio da tastiera: ArrowRight ripristina ed esegue navigazione Cinema→Musica. Reduced motion resta prioritario: opacità1, Canvas ancora fermo; ingresso dialogo senza animazione e transitionDuration0s. Tolta la riduzione, ripresa consentita.
- Risveglio da pointerdown/click sul dialogo: chiusura singola e ritorno al widget Riprendi, opacità1 e Canvas running. Visibilità nascosta/ritorno: stop e nuova fase attiva, nessuna perdita focus; hidden prolungato/timer cancellati verificati dallo scheduler unitario.
- Regressioni3.1/3.2/background: dialoghi, alias, focus/memoria, pointer/tap/simulatore, campi tecnici, esclusione tool produzione, profili/fallback/contextlost/errori draw, sorgente assente/recupero, resize, visibilità/reduced motion e widget Demo OK. Viewport1080p/4K senza overflow; mobile solo scorrimento verticale previsto.
- Versione package/lockfile0.3.2 coerente, nessuna dipendenza aggiornata; diff senza errori di whitespace. Nessun check richiesto rimasto aperto nel perimetro locale.

## Comandi e distinzione delle prove

Server separati preview5187/dev5188 come README; qui avviati con `node node_modules/vite/bin/vite.js preview` e `node node_modules/vite/bin/vite.js`, opzioni host127.0.0.1/porta/strictPort. Collaudo con Edge fuori sandbox approvato:

```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$env:VERIFY_OUTPUT = 'docs/verification/phase-3.3/final'
$env:PROFILE_TEST_URL = 'http://127.0.0.1:5188/scripts/fixtures/background-profiles.html'
$env:BACKGROUND_TEST_URL = 'http://127.0.0.1:5188/'
$env:IDLE_TEST = '1'
node scripts/verify-shell.mjs
```

`IDLE_TEST=1` abilita `scripts/verify-idle.mjs`, con due attese reali senza query, clock o timeout di produzione abbreviati. Senza flag il collaudo ordinario resta rapido. Per nuove prove usare directory nuove; SHELL_URL default127.0.0.1:5187.

Lo soak animazioni opzionale STABILITY_MS ora invia Shift DOM sintetico ogni campione per tenere la Home sveglia, dichiarato nel JSON (`awakeSoakWithPeriodicSyntheticInput`); senza questa distinzione i vecchi assert RAF1 fallirebbero correttamente dopo l'idle. Serve per misurare animazioni attive, non sostituisce IDLE_TEST. Non rieseguito qui lo soak5min né profiling allocazioni; storico2.9/2.10 intatto. Nessuna misura GPU/G5 nuova.

## Confronto e limiti

Riferimenti00/01 ispezionati prima degli interventi; ispezionati screenshot finali idle-home4K, idle-dialog1080p e Home attiva1080p, oltre a idle-home/dialog1080p del run preliminare. Il4K è stato visualizzato a2048×1152. Posizioni/proporzioni, focus, PNG e tarature3.2 preservati; in idle scena e dialogo sono attenuati, al risveglio torna la normale composizione. Nessuna piena fedeltà visiva dichiarata: restano differenze pregresse di header, loghi Demo, housing e footer. SHA256 PNG invariato7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482.

Input via CDP/DOM e visibilità emulata non certificano Magic Remote, webOS, screen reader o altri browser. Timer eseguiti in tempo reale nel browser; hidden prolungato/cleanup e timer coalescenti coperti da scheduler unitario, non da una prova hardware. CSS opacity non equivale a un dato fisico di luminanza del pannello.

## Chiusura e ripresa

**3.3 completata**, versione locale0.3.2; fase3 ancora aperta, nessun nuovo blocco identificato. Prossima **3.4 — Stati limite**, non avviata. Non anticipare servizi/hardware o pubblicazione; preservare policy idle/sistema/visibilità, focus e tarature.
