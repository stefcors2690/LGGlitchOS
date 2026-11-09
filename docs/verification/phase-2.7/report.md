# Verifica 2.7 — Profili prestazionali e monitor Canvas

Data:2026-11-09. Milestone4 parte A completata. Chrome headless/macOS, GPU disabilitata dallo script; nessuna prova G5/webOS.

## Implementazione

Configurazione canonica mantenuta separata da quella effettiva. resolveBackgroundConfig valida prima dei cap, non muta l’input, preserva regioni/immagine e tarature approvate. Balanced predefinito invariato:208 gocce e40 particelle. Cinematic:intensità pioggia×1.4/cap100 (291 gocce con default), particelle×2/cap200 (80 default). Balanced cap particelle80. Stessi layer CSS locali già leggeri, senza ulteriori filtri o aumento dei glitch. Eco disabilita tutti i layer decorativi, conserva PNG/scrim/gradiente e non monta Canvas.

Budget Canvas espliciti maxWidth/maxHeight (interi1–1920/1–1080), DPR e targetfps. Cinematic/Balanced massimo1920×1080/DPR1/30fps; Eco budget riservato960×540/.75/15 ma nessun Canvas attivo. Limiti utente più bassi rispettati, configurazioni invalide rifiutate prima del clamp; flag off e zero non riattivati. Logo mantiene policy separata. Nessun auto-degrado o nuovo controllo Home.

Unico Canvas/RAF per pioggia+particelle. Il cleanup precedente precede la nuova configurazione, libera sprite/observer/listener e riduce il vecchio buffer a1×1. Il nodo immagine non viene sostituito per il solo profilo. PerformanceMonitor usa timestamp draw wall-clock e CPU draw cost, pubblica almeno ogni2s sul loop esistente; nessun timer/RAF o stato React/frame. Snapshot nei data attribute Canvas e callback opzionale stabile onPerformanceSample. Contratti completi nel README tecnico background.

## Verifiche automatiche

- npm run check OK:lint senza warning, TypeScript strict,127 test in19 file, build produzione. Dieci test nuovi per profili (Balanced invariato, Cinematic/cap/non mutazione, Eco, budget personalizzati/flagoff, valori invalidi, ritorno ai controlli canonici) e monitor (finestre/cadence/costi, frame lento reale, reset/input invalidi).
- Fixture isolata scripts/fixtures/background-profiles.html e src/features/background/testing/ProfileFixture.tsx, servita solo da Vite in sviluppo, non importata dalla Home. Verificata assenza dei marker ProfileFixture/background-profiles/__backgroundResources nel dist. Nessuna nuova dipendenza o modifica alla navigazione.
- Lint iniziale ha rilevato un export mancante nella fixture per Fast Refresh: corretto, intero npm run check poi passato. Script browser modificato successivamente per attendere mapping/pool coerenti; lint finale rieseguito.
- git diff --check OK. PNG originale e asset copia conservati, hash SHA256 identico alle fasi precedenti.

## Collaudo Chrome

Comando, con preview produzione5187 e dev server fixture5188:

```bash
PROFILE_TEST_URL=http://127.0.0.1:5188/scripts/fixtures/background-profiles.html node scripts/verify-shell.mjs
```

Primo giro interrotto dal protocollo CDP: un’assegnazione restituiva un nodo DOM da serializzare con catena React troppo profonda. Corretto il risultato della sola espressione diagnostica a void; nessuna modifica applicativa per questo errore. Secondo giro completo superato, metriche in shell-metrics.json.

Home produzione:1080p/4K senza overflow, portrait con scrolling verticale previsto, frecce/OK/Back e widget/focus stabili. Neon/ologramma mappati entro1px dopo resize; pulse/scanline/RGB verificati; pioggia+particelle visibili, pausa reduced motion/pagina nascosta e ripresa riuscite. Buffer1920×1080 con UI3840×2160 aDPR2, fallback Canvas assente e immagine mancante corretti. runtimeErrors=[]; richiesta404 intenzionale prevista.

Fixture in StrictMode:cinematic→eco→balanced→cinematic→balanced sullo stesso componente. Ogni stato animato ha un solo RAF pendente, un solo Canvas,3 listener resize (Canvas/neon/ologramma),3 ResizeObserver e5 sprite attivi. Cinematic291 gocce/80 particelle; ritorno Balanced208/40 senza accumulo. In Eco:zero RAF, Canvas, listener resize, observer e sprite attivi; stesso nodo img durante tutte le transizioni. Reduced motion:zero RAF/sprite, due observer/listener di mapping CSS conservati fino allo smontaggio; ripresa riuscita. Unmount:zero risorse censite; remount:baseline1/3/3/5 ripristinata, con nuovo img atteso perché è un vero smontaggio.

Campione Balanced nella fixture:44 intervalli su2014.4ms, **21.84draw/s**, CPU medio**.761ms**, massimo**1.7ms**. Il monitor riporta il risultato reale, non il delta simulazione clampato o il target30. Ambiente headless con software rendering e strumentazione: non è un benchmark G5, non dimostra30fps né misura presentazione GPU/CSS dell’intera Home. La profilazione estesa resta2.9. L’output testo della fixture conserva l’ultimo campione anche in Eco: non è una misura dello statico; in Eco non esiste Canvas né campionamento nuovo.

## Ispezione visiva e limiti

Ispezionati references00/01 e screenshot Home rain-3840x2160.png, profile-cinematic.png e profile-eco.png. Balanced conserva geometria/focus/città originali; Cinematic aggiunge densità discreta senza alterare camera, neon o volto; Eco conserva solo la scena originale con scrim. I veicoli dipinti sono fermi e il modulo veicoli resta non montato. I pulsanti/banner nelle immagini profile-* appartengono esclusivamente alla fixture tecnica, non alla Home definitiva. Nessuna fedeltà completa ai mockup dichiarata: rimangono i contenuti demo e le variazioni layout approvate dall’utente.

Screenshot Home4K logico aDPR2 ha7680×4320 pixel fisici; Canvas restaFull HD. Cinque cambi profilo e unmount/remount sono verifiche di ciclo vita, non una sessione lunga o prova di assenza di ogni leak. Nessun monitor heap/GPU né test hardware. Pannello vero di sviluppo previsto2.8, stabilità e profiling approfonditi2.9, integrazione finale2.10.

Prossima: **2.8 — Pannello tecnico di sviluppo**. Stato e ripresa in PROJECT_STATUS.md e START_HERE.md.
