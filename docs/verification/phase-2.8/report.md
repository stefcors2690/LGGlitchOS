# Verifica2.8 — Pannello tecnico di sviluppo

Data:2026-11-09. Milestone4 completata (profili+monitor2.7 e pannello2.8). Browser Chrome headless/macOS; nessuna prova G5/webOS.

## Modifiche

HomeBackground carica lazy development/BackgroundWorkbench solo in modalità Vite dev con parametro esatto ?backgroundDebug=1. Senza parametro nessuno strumento; in produzione ordinaria il ramo dev e il relativo modulo/CSS sono eliminati. Il parametro non abilita debug nella build produzione. Il pannello inizia chiuso, apribile da Sfondo · debug; nessun controllo movimento utente ripristinato nella Home definitiva.

BackgroundSettings con cinque slider nativi (intensità/velocità pioggia, densità nebbia, luminosità neon, numero particelle), profilo Cinematic/Balanced/Eco, checkbox glitch e reset. Valori canonici separati dal config effettivo: riga conteggi/budget dopo i profili, cap/moltiplicatori esplicitati, obiettivo fps distinto da una misura. settingsPolicy valida finitezza/intervallo/passo, poi configurazione completa. Aggiornamenti errati conservano config precedente; test unitari coprono il rifiuto. Nessun localStorage/rete/dipendenza. Stato confinato a Workbench, nessuno stato aggiunto alla Home o alle card; stessa immagine e stessi nodi card durante regolazioni.

Dialog non modale, label/output nativi, focus iniziale profilo, Tab/frecce native, Escape/BrowserBack/GoBack e Chiudi riportano alla prima app. useTvFocus ignora eventi dentro data-background-tools, così Enter sull’opener e le frecce sugli input non attivano il rail. Home resta accessibile da puntatore/Tab; pannello con overflow interno su finestre piccole. Reduced motion/pagina nascosta continuano a controllare il motore, senza override dal pannello.

## Controlli

- npm run check superato:lint senza warning, TypeScript strict,132 test in20 file, build produzione. Cinque test nuovi: gating dev/opt-in, aggiornamenti isolati, input invalidi/passaggi, valori canonici attraverso profili, semantica controlli e distinzione cap effettivo/valore richiesto. Lint rieseguito dopo modifica script browser; git diff --check OK.
- Bundle dist privo dei marker BackgroundWorkbench/settingsPolicy/backgroundDebug/Regia dello sfondo/background-settings e del CSS del pannello. Il solo selettore di esclusione tastiera data-background-tools resta nella navigazione condivisa; non è UI diagnostica. CSS produzione invariato23.29kB; nessuna dipendenza aggiunta.
- Originale references/background.png e copia asset immutati, SHA2567ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482.

Collaudo, con preview produzione5187 e Vite5188:

```bash
BACKGROUND_TEST_URL=http://127.0.0.1:5188/ PROFILE_TEST_URL=http://127.0.0.1:5188/scripts/fixtures/background-profiles.html node scripts/verify-shell.mjs
```

Passato al primo giro completo. Runtime.exceptionThrown/console.error osservati:nessuno; runtimeErrors=[] nelle metriche. La404 immagine mancante è intenzionale nelle prove fallback.

- Produzione con query debug:nessun contenitore strumenti. Dev senza query:nessun contenitore. Dev con query:pulsante, pannello chiuso; Enter apre e porta il focus sul profilo.
- Tutti i controlli live:rain0/particelle100 in Balanced mostra pool0/80; nebbia0 rimuove il layer,80 lo ripristina; neon40, speed2; ArrowRight sullo slider rain0 lo porta1 senza spostare focus nella Home. Rain50 e Cinematic producono224 gocce e200 particelle (valore canonico100×2). Speed0 azzera solo la pioggia, ritorno2 ripristina. Glitch false elimina la copia rossa; Eco rimuove Canvas e mantiene rain50. Ritorno Balanced produce160 gocce/80 particelle senza doppia moltiplicazione.
- Reset ripristina65/1/65/100/40, glitch true, Balanced e pool208/40. Nodo immagine e prima card identici a prima delle regolazioni. ESC dal profilo chiude, focus Cinema; ArrowRight raggiunge Musica. Apertura successiva funziona.
- Con reduced motion live il Canvas è statico anche modificando particelle; ripresa no-preference funzionante. Finestra390×844:pannello entro larghezza viewport, controlli leggibili e focus visibile. Reload ripristina pool40 e pannello chiuso. Le modifiche non sono persistenti; chiudere conserva la configurazione fino al reload/reset.
- Regressioni produzione1080p/4K/mobile, D-pad/OK/Back/widgets, mapping neon/ologramma, visibilità/pausa, Canvas assente e immagine mancante tutte superate. UI4K aDPR2 conserva buffer Full HD. Screenshot4K fisico7680×4320.
- Fixture StrictMode2.7 ripetuta:cinque cambi profilo con un solo RAF/Canvas,3 resize listener/observer e5 sprite attivi in animazione; zero in Eco/unmount; remount senza crescita. Stesso img ai cambi, nuovo img dopo vero unmount atteso. Campione45 intervalli su2011.1ms =22.38draw/s, CPU medio.744ms/max1.9ms, esclusivamente dato headless, non certificazione30fps o dato TV.

## Ispezione visiva e limiti

Ispezionati references00/01, background-settings-1920x1080.png, background-settings-mobile.png e rain-3840x2160.png. Pannello tecnico scuro/cyan con focus magenta, leggibile e senza nuove animazioni; sovrapposizione limitata all’attivazione dev esplicita. Geometria normale della Home, PNG, tarature iniziali e brand preservati. Nessuna fedeltà totale dichiarata ai mockup: contenuti demo e variazioni layout approvate restano.

I percorsi del pannello sono verificati su browser desktop e finestra stretta; non è certificato il comportamento Magic Remote/Back fisico sul G5. Le modifiche live ricreano i pool tramite cleanup esistente: la profilazione di drag prolungati/allocazioni e la sessione lunga restano2.9. Non introdotti monitor GPU/heap né test hardware. Il pannello usa tastiera nativa Tab/frecce, non un nuovo grafo D-pad dedicato. Nessuna chiamata TV o modifica OS.

Prossima **2.9 — Ottimizzazione e stabilità**. Contesto aggiornato in PROJECT_STATUS.md/START_HERE.md, contratti in src/features/background/README.md.
