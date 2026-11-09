# Motore background — stato corrente 2.10

## Verifiche di stabilità 2.9

`AnimationController` conserva il residuo delle scadenze per evitare la caduta a20–24draw/s con RAF irregolare; il delta simulazione è separato dall'ultimo draw reale, limitato e senza recuperi a raffica. Nessun nuovo RAF, stato React/frame o cambio tarature. Risoluzione config canonica sempre una sola volta.

Il collaudo browser aggiunge `STABILITY_MS` (minimo60000) per stress profili/resize/slider e sessione Home produzione, e `ALLOCATION_MS` (minimo10000) per campioni statistici delle allocazioni JS. Variabili indipendenti, disattivate quando assenti. Per stabilità fornire PROFILE_TEST_URL e server dev; BACKGROUND_TEST_URL punta alla Home dev. Non confondere heap dopo GC/allocazioni JS con memoria nativa Canvas/GPU. Finestre CSS on/off misurano solo contatori main thread, non compositing. Comandi e risultati nel [rapporto2.9](../../../docs/verification/phase-2.9/report.md).

Per riprendere su un altro PC leggere [docs/HANDOFF.md](../../../docs/HANDOFF.md). Fase2 completata fino alla2.10, versione locale0.2.0; prossima3.1. Balanced è attivo anche in produzione; solo il pannello è escluso. I percorsi Chromium vanno adattati al sistema operativo; usare output nuovi per preservare i rapporti storici. Verificati135 test/check ed Edge Windows, fallback/recupero e prova produzione5min nel rapporto2.10; profiling allocazioni2.9 separato, nessuna misura G5.

I riferimenti storici a “nessuna allocazione/frame” indicano assenza di creazione esplicita di pool/sprite/oggetti applicativi nei draw: il campionamento2.9 rileva allocazioni JS transitorie attribuite soprattutto a draw (circa5,4MB/15s). Non promettere zero allocazioni effettive della VM o delle API Canvas; heap dopo GC e risorse restano limitati nella sessione provata.

`CyberpunkBackgroundEngine` è l'entry point della Home. Proprietà: `animated` (permesso dalla policy esterna sistema/visibilità), `config?: BackgroundConfig` (default locale). Il componente non legge DOM focus, adapter, storage o video e non aggiorna le card. `enabled=false` lascia l'immagine statica. Il renderer attuale usa un unico Canvas per pioggia e particelle, più layer CSS localizzati per nebbia, neon e ologramma. Le sezioni numerate sotto documentano anche la progressione storica.

## File e responsabilità

- `background.types.ts`, `background.config.ts`: contratto readonly, default Balanced, percorso immagine configurabile, budget e validazione al confine.
- `BackgroundImage.tsx`: img decorativa con object-fit cover/center, avviso accessibile di asset mancante/errore e gradiente persistente. Cambiando imageSrc viene ricreato solo il loader e si può recuperare da un errore precedente.
- `background.css`: composizione a strati, pointer-events none, stesso scrim di contrasto della Home precedente. L'avviso manca dalla scena normale e non introduce controlli.
- `engine/coordinates.ts`: trasformazione cover uniforme e mappatura regione immagine normalizzata → pixel viewport, compresi offset negativi del crop. Non clampare la regione mappata prima del clipping del renderer.
- `engine/AnimationController.ts`: scheduler RAF iniettato, limite cadenza/delta, stop/resume e dispose terminale; nessuna dipendenza React. In 2.2 collegare il scheduler browser e stop/dispose al ciclo di vita dell'effetto. Non avviarlo senza effetti. Le eccezioni draw arrestano il loop e risalgono al caller, che dovrà gestire il fallback dell'effetto.

`CityBackdrop.tsx`/`city.css` sono stati rimossi in2.10: non esiste una seconda implementazione della scena nel sorgente. Gli asset vettoriali/generatore restano per provenienza e storico, senza import runtime. Il logo canonico continua a usare la policy separata e le animazioni precedenti.

## Fallback e validazione integrata 2.10

Errore setup/draw o evento contextlost richiama subito lo stesso cleanup idempotente dell'unmount: stop/dispose RAF, disconnect observer, remove listener, buffer1×1 e sprite azzerati. Anche se clearRect fallisce si liberano le altre risorse. Lo stato resta `unavailable`; resize successivi non riallocano il buffer e non ritentano il rendering. Cambiare configurazione o rimontare crea un nuovo effetto. I layer CSS indipendenti e il PNG restano disponibili; immagine assente conserva gradiente/avviso e rimuove neon/ologramma mappati, senza spegnere arbitrariamente gli altri effetti.

La fixture profili include toggle effetti/motore/immagine, esclusi dalla produzione. Con PROFILE_TEST_URL lo script verifica anche contextlost sintetico, errore draw e cleanup iniettati, zero risorse Canvas residue, recupero con profilo, effetti off e recupero sorgente. Con Canvas indisponibile la Home conserva D-pad/Enter/Back. Senza VERIFY_OUTPUT il collaudo genera una cartella `docs/verification/browser-<timestamp>`; con output esplicito usare una cartella nuova. Dettagli e limiti nel [rapporto2.10](../../../docs/verification/phase-2.10/report.md).

## Unità e limiti

| Campo | Semantica / intervallo valido |
| --- | --- |
| imageSrc | URL importato da Vite o percorso esplicito; vuoto segnala asset mancante. Default references/background.png. |
| rendering.maxDpr | Tetto DPR futuro del Canvas, 0.25–2; default 1. Non cambia la risoluzione della UI. |
| targetFps / maxDeltaMs | Cadenza obiettivo 1–60 fps (default 30), delta simulazione 1–250 ms (default 100). Obiettivi, non prestazioni misurate. |
| rain.intensity / fog.density / neon.intensity | Percentuale 0–100. |
| rain.speed | Moltiplicatore 0–5; 1 è velocità base da calibrare in 2.2. |
| rain.wind | Fattore orizzontale -1–1, positivo verso destra. |
| fog.speed | Moltiplicatore 0–2; base da calibrare in 2.3. |
| hologram.glitchFrequency | Cicli glitch richiesti al secondo, 0–1, con periodo minimo effettivo 6s e due bande sfasate; 0 disattiva glitch. |
| particles.count | Intero 0–200, default 40 attive da 2.6; enabled=false o count=0 non disegna particelle. |
| region | x/y/width/height normalizzati 0–1 sull'immagine originale, dimensioni positive e interamente entro immagine. |

La regione ologramma è stata calibrata in 2.5 con maschera poligonale dedicata al pannello del volto; vedere contratto aggiornato sotto. Le sette regioni neon sono calibrate dalla 2.4. I profili sono applicati dalla risoluzione pura descritta nella sezione2.7 sotto. Config invalida genera RangeError; le fonti dinamiche future dovranno validare i valori prima di passarli al componente. Non correggere silenziosamente valori fuori limite.

## Asset e verifiche

references/background.png e assets/cyberpunk-background.png hanno SHA-256 identico: `7ac43c3324781f7061c8e5a4527d0234ed97c43161f70123e5d619bae62b8482`. Usato il primo, entrambi immutati. Video assets/cyberpunk-motion-reference.mp4 solo riferimento futuro dei movimenti, nessun import/player. Nessuna dipendenza nuova.

Test unitari: config/regioni/coordinate/controller e rendering statico. `npm run check`, poi `node scripts/verify-shell.mjs` con preview di produzione secondo README principale. Evidenze: docs/verification/phase-2.1/. Nessun dato webOS o risultato prestazionale sul G5.

## Pioggia 2.2

BackgroundCanvas collega RainEngine al controller solo se allowed, rain.enabled/intensity/speed non nulli e context disponibile. Pool Float32Array fisso (intensity × 3.2 arrotondato: 208 gocce con default 65), tre texture blu/ciano sfumate generate una volta a setup e riutilizzate. Profondità varia lunghezza, velocità e alpha; le gocce vengono riciclate. Nessun aggiornamento React o allocazione di oggetti JS per frame. Callback draw error/contextlost arrestano il controller e mantengono il PNG. Nessun retry automatico aggressivo.

Buffer limitato sia da maxDpr sia da 1920×1080 anche con UI 4K/DPR elevato; resize via ResizeObserver e window resize (fallback). Velocità base 210–600 px/s a quota logica 1080, moltiplicata da depth/random/speed; wind positivo sposta a destra. Texture preinclinate e attenuazione dello scrim mantengono l’effetto discreto. Le gocce dipinte nel PNG restano immobili: il layer animato è separato.

Al cambio policy/config: cleanup cancella RAF, disconnect observer, remove listener, pulisce Canvas e libera buffer sprite; alla ripresa viene creato un pool nuovo senza delta del tempo nascosto. Conteggio diagnostico data-frames aggiornato solo allo stop; data-state running/static/unavailable descrive il Canvas. Nessuna UI di regolazione fino alla 2.8 e nessun controllo finale. Profili ancora solo tipizzati fino a 2.7. La base non è più sempre statica: lo è quando l’effetto è vietato/disattivato/indisponibile.

Verifiche 2.2: 95 test con npm run check; Chrome e screenshot in docs/verification/phase-2.2/. Questa fase chiude milestone 1, non l’intero motore. Prossima 2.3 — Nebbia atmosferica.

## Nebbia 2.3

FogLayer usa due veli procedurali con gradienti radiali trasparenti cyan/magenta, sopra lo scrim dell’immagine e sotto la UI, senza filtri/blur/blend o texture esterne. CSS transform/opacity, nessun RAF JavaScript aggiuntivo. Regione verticale dal 38% in basso e veli estesi orizzontalmente oltre il bordo per evitare scoperte durante drift ±8%. Ciclo ease-in-out alternate (far alternate-reverse), quindi nessuno stacco al riavvio; ritardi negativi danno una fase iniziale non uniforme.

Config fog.enabled default true; density percentuale controlla opacità massima del contenitore density/100 × 0.85 (default 0.5525 con density 65), poi moltiplicata da opacità/alpha dei veli. speed=1 indica semiperiodi 12s/17s; default .2 => 60s/85s. speed=0 conserva nebbia statica senza divisioni per zero; enabled=false o density=0 non montano layer. enabled globale false non monta FogLayer. Quando animated=false per pagina nascosta la timeline CSS resta pausata; la riattivazione della visibilità riprende dalla stessa fase senza avanzare il tempo nascosto. Il CSS globale reduced motion disabilita le animazioni e può ricreare il ciclo alla riattivazione del movimento; la scena resta statica durante la riduzione.

Nessun nuovo listener o risorsa da smontare per FogLayer; animazioni associate agli elementi DOM eliminate con essi. Data-motion running/still è diagnostico. RainEngine resta indipendente e il CSS CityBackdrop legacy non viene importato. Evidenze fase 2.3; prossimo passo 2.4 neon/illuminazione, prima di chiudere milestone 2.

## Calibrazione visibilità dopo feedback utente

La prima taratura risultava troppo poco percepibile nella preview: pioggia con tratti subpixel e doppia attenuazione degli effetti sotto lo scrim; nebbia concentrata soprattutto dietro i widget. Ordine ora immagine → scrim → pioggia/nebbia → UI. Pioggia con tratto sprite 3.6px prima del ridimensionamento, alpha .28–.68 e lunghezza logica 18–58px, stesso pool/budget. Nebbia anticipata e gradienti più alti, drift ±8% e semiperiodi 60/85s, opacità parent .2975 al default. Reduced motion/pagina nascosta continuano ad avere precedenza; nessun controllo finale aggiunto. Chrome controlla anche copertura e picco alpha della pioggia oltre al movimento. Evidenze docs/verification/effect-visibility/.

Ultimo riscontro utente: pioggia ora visibile, nebbia ancora troppo tenue. Solo fog.density aumentata da 35 a 65; opacità contenitore .5525 invece di .2975, con alpha dei veli e movimento invariati. Nessuna modifica alla pioggia.

## Neon localizzati 2.4

NeonLayer riceve dimensioni naturali comunicate da BackgroundImage solo dopo caricamento riuscito; sorgente cambiata o errore nascondono le regioni finché non è disponibile il nuovo asset. Riusa mapRegion e la trasformazione cover uniforme. ResizeObserver/window resize aggiornano soltanto il layer neon quando cambia la sua dimensione, senza RAF JS e senza rerender dei widget. Listener/observer vengono rimossi quando il layer diventa inattivo o viene smontato.

NeonRegion estende Region con id univoco non vuoto, color cyan/magenta e kind sign/reflection. Sette regioni normalizzate calibrate sul PNG approvato: tower-07, left-sign, center-sign, right-sign, cyan-windows e due riflessi cyan-water/magenta-water. Sono rettangoli di confinamento con gradienti radiali sfumati, non maschere per singoli pixel delle lettere. Il volto destro è escluso e resta in 2.5. Se si cambia immagine, ricalibrare le regioni del relativo config.

Config neon.enabled=true, intensity=100, flicker=true (rafforzato su richiesta utente). Intensità percentuale moltiplicata per .6 per insegne e .28 per riflessi, con ulteriore alpha del gradiente e respiro locale .12–1. Semicicli per regione 3.6–7.92s (20% più rapidi su richiesta successiva) alternate, sfasati. Interferenza opzionale: lieve calo al 82% della luminosità del contenitore una volta per ciclo 37–55s, senza accensioni a bianco, scomparsa o flash. flicker=false elimina solo il calo occasionale. Zero intensity/off/regioni vuote/asset assente non montano il layer. Reduced motion/pagina nascosta fermano le animazioni; le preferenze automatiche di sistema restano prioritarie.

Ordine: immagine → scrim → neon → pioggia → nebbia → UI. Niente filtri CSS, blend, video o nuovo Canvas, nessun cambio alle tarature pioggia/nebbia. Si modula un bagliore locale sopra la luce già dipinta: non si può spegnere l'insegna originale incorporata nel PNG. Evidenze in docs/verification/phase-2.4/. Prossima 2.5 — ologramma.

Ultima calibrazione neon: utente richiede effetto ben visibile. Rafforzati default, gradiente e pulsazione; invariati regioni, cali occasionali, pioggia e nebbia. Evidenze docs/verification/neon-strength/, incluso campione diagnostico al picco delle luci (fasi temporaneamente sincronizzate solo dal test, poi ripristinate). Nessuna nuova fase avviata.

## Ologramma mascherato 2.5

HologramLayer usa la regione immagine normalizzata x=.773, y=.015, width=.11, height=.42 e mask locale con punti (.04,.12),(.93,0),(1,.88),(.12,1), calibrati sul pannello destro. Tipi NormalizedPoint e validazione 3–8 punti entro [0,1]. useBackgroundViewport è ora condiviso con NeonLayer: aggiorna solo su resize, cleanup observer/listener, nessun RAF aggiuntivo o stato React per frame. Immagine assente/errore/off non monta layer.

Scanline 4s, sweep 9s e luce 6s alternate, tutte confinate dal clip-path del pannello. Glitch true e frequency>0 aggiungono due copie colore (matrici SVG rosso/cyan locali, composizione screen solo nella maschera) e due bande del PNG traslate, mai oggetti dipinti spostati nell’immagine sorgente. Sfondo delle copie ricavato da getHologramLayout con stesso cover size e offset della base. Spostamento massimo 3px, RGB alpha massimo .18; bande 30–35% e 62–66% del pannello. Niente deformazione o filtro dell’intera scena.

Periodo = max(6,1/glitchFrequency) secondi: default .15 => ~6.67s. La seconda banda è sfasata di mezzo periodo; finestre visibili solo tra 92–98% del ciclo. Frequenza zero o glitch false rimuovono copie/split, mantenendo scanline e luminosità. Frequenza massima tipizzata 1/s resta limitata al periodo 6s per evitare glitch continui. Con pagina nascosta si nasconde il pannello e si pausa CSS; reduced motion forza pannello display none, conservando il volto originale. Ripristino senza camera o layout shift.

Nessun nuovo asset/dipendenza. Filtri SVG e blend sono limitati alle piccole copie del volto e richiedono misure G5 successive, senza promessa prestazionale. La maschera è poligonale, non un ritaglio semantico del solo viso; non simula occhi o labbra. Il PNG e i veicoli incorporati restano intatti. Evidenze fase-2.5; prossima 2.6 particelle e predisposizione veicoli off.


## Particelle e predisposizione veicoli 2.6

`ParticleEngine` usa un pool fisso Float32Array (5 valori per particella), default 40, massimo 200 validato al confine. Coordinate normalizzate, profondità, deriva a destra 3–12px/s e verso l’alto 2–7px/s riferiti a 1920×1080; nucleo luminoso con alone cyan/magenta da due sprite 32×32 generati solo a setup. Diametro dell’alone 7–16px a1080p, nucleo molto più piccolo. Respiro sinusoidale ~25s senza lampeggi. Riciclo oltre bordo, delta limitato100ms, nessuna allocazione/frame o stato React/frame.

`BackgroundCanvas` conserva la classe background-rain per compatibilità e aggiunge background-effects. RainEngine pulisce il buffer anche con pool pioggia vuoto, poi ParticleEngine disegna senza cancellarlo: particelle indipendenti quando rain.enabled=false. Un solo controller RAF, buffer massimo1920×1080, target30fps; entrambi si fermano con policy ridotta/pagina nascosta, e tutti gli sprite sono liberati nel cleanup. Con entrambi i pool vuoti non parte il loop. data-particle-count/data-rain-count indicano i pool configurati, anche durante pausa. Errore context disabilita entrambi, lasciando PNG e layer CSS disponibili.

`engine/FlyingVehicleEngine.ts` è un modulo opzionale standalone, **non montato dalla Home**: richiede enabled=true e un FlyingVehicleAsset già decodificato, separato e trasparente (CanvasImageSource + aspectRatio positivo). Non carica/fetcha risorse e non usa il PNG. API resize/draw pronta per un futuro loader/integrazione; passaggio distante di18s seguito da72s di intervallo. Senza asset o con default enabled=false non disegna nulla. La trasparenza/provenienza dovranno essere verificate quando sarà scelto un asset reale; oggi nessun asset veicolo viene fornito. Cambiare il solo flag nella config non introduce veicoli nella Home.

Ordine attuale: PNG → scrim → neon → ologramma → Canvas pioggia+particelle → nebbia → UI. Pointer-events none su tutti i layer decorativi; nessuna modifica a focus/card o immagine originale. Profili implementati in2.7, pannello previsto in2.8. Evidenze e limiti in docs/verification/phase-2.6/.


## Profili e monitor 2.7

La configurazione esportata `backgroundConfig` contiene i **controlli canonici**, con Balanced di default. `CyberpunkBackgroundEngine` chiama `resolveBackgroundConfig` una sola volta per riferimento config (useMemo) e distribuisce i valori effettivi ai layer. I chiamanti devono conservare i controlli canonici: per cambiare profilo passare `{ ...controls, profile: 'cinematic' }`, senza reinserire un risultato già risolto nella funzione (i moltiplicatori verrebbero applicati di nuovo). Nessuna mutazione dei controlli, regioni o asset. Nessun cambio automatico di profilo, storage, query string o nuovo controllo Home.

| Profilo | Pioggia / particelle | Altri effetti | Limiti Canvas |
| --- | --- | --- | --- |
| Balanced | Intensità×1 (208 gocce default), count×1 (40 default, cap80). | Due veli nebbia e neon/ologramma locali già ottimizzati; taratura approvata invariata. | DPR≤1, max1920×1080, target≤30fps. |
| Cinematic | Intensità×1.4 con cap100 (291 gocce default); count×2 arrotondato con cap200 (80 default). | Nebbia completa, neon e ologramma preservati senza aumentare glitch o flash. | DPR≤1, max1920×1080, target≤30fps. |
| Eco | Pool effettivi azzerati, scena decorativa disabilitata. | Solo PNG/scrim/gradiente, nessun neon/nebbia/ologramma aggiunto; nessun RAF background. | Budget riservato960×540, DPR≤.75, target≤15fps; nessun Canvas effettivamente montato. |

`rendering.maxWidth/maxHeight` sono interi in pixel buffer, 1–1920 / 1–1080; default1920/1080. DPR e budget inferiori forniti dal chiamante sono rispettati con Math.min, mai aumentati dai profili. Il buffer usa il rapporto minimo tra DPR e limiti dei due lati, senza deformare la scena; UI e PNG mantengono risoluzione/layout propri. targetFps è una cadenza obiettivo, non una misura; maxDeltaMs resta il cap simulazione configurato. Controlli invalidi vengono rifiutati **prima** dei cap, inclusi NaN o budget fuori intervallo. Flag enabled=false e valori zero restano rispettati in ogni profilo. Eco e enabled=false non cambiano la policy separata del logo.

Un cambio config esegue cleanup del vecchio effetto prima del successivo: cancella RAF, scollega observer/listener, azzera gli sprite e riduce il vecchio buffer a1×1. Il nodo img resta lo stesso se imageSrc non cambia. Un solo Canvas/RAF con entrambi i pool. La modalità Eco smonta tutti i layer decorativi e i relativi resize observer/listener. Reduced motion e document.hidden conservano la policy già esistente.

`engine/PerformanceMonitor.ts` riceve timestamp wall-clock e costo CPU di ogni draw dal ciclo esistente. Non crea RAF/timer propri né oggetti per frame; pubblica un campione ogni almeno2000ms, solo quando arrivano frame disegnati. Snapshot readonly: frames (intervalli dopo il primo frame), windowMs, fps = frames×1000/windowMs, averageDrawMs e maxDrawMs. Il primo draw stabilisce la baseline; pausa/config nuova crea un monitor nuovo, senza contare tempo nascosto. I delta clampati della simulazione non sono usati per stimare fps. Finestra configurabile nei test, minimo500ms.

Telemetry accessibile nei data-fps/data-average-draw-ms/data-max-draw-ms del Canvas e nel callback opzionale stabile `onPerformanceSample` del componente. Prima del primo campione o dopo un riavvio gli attributi non esistono. Nessun valore inventato per Eco/statico; nessuna telemetria remota/UI automatica. Il callback dovrebbe essere memoizzato e leggero: cambiarne identità ricrea l’effetto. Le misure riguardano soltanto invio dei draw Canvas sulla CPU/cadenza dei draw, **non** presentazione GPU, animazioni CSS, prestazioni dell’intera Home o TV.

Fixture di sviluppo esclusa dalla build ordinaria: `/scripts/fixtures/background-profiles.html` con `npm run dev -- --host 127.0.0.1 --port 5188 --strictPort`. Monta solo il motore in StrictMode e controlli di test; strumentazione RAF/listener/observer/sprite è contenuta nella fixture, non nella Home. Per collaudare anche i cambi profilo insieme alla preview produzione5187:

```bash
PROFILE_TEST_URL=http://127.0.0.1:5188/scripts/fixtures/background-profiles.html node scripts/verify-shell.mjs
```

Senza PROFILE_TEST_URL lo script esegue solo il collaudo della Home; non dichiara testati i cambi profilo. Pannello vero e proprio resta2.8; nessuna dipendenza o garanzia hardware introdotta.

La fixture mostra l’ultimo campione ricevuto anche dopo un cambio profilo: in Eco tale testo è uno storico, non una nuova misura dello statico. Riferirsi al Canvas corrente (assente in Eco) per lo stato attivo.


## Pannello di sviluppo 2.8

HomeBackground sceglie il renderer normale oppure un import lazy di development/BackgroundWorkbench. Il ramo Vite import.meta.env.DEV permette al bundler di rimuovere modulo/CSS del pannello in produzione. Opt-in esatto `?backgroundDebug=1`; non basta la sola modalità sviluppo. Un parametro nella produzione ordinaria non può abilitare il pannello. Non c’è un flag di packaging diagnostico produzione in questa fase.

Workbench possiede controlli canonici e stato apertura/errore, separati da TvShell: cambiare valori non aggiorna lo stato delle card o i widget. Il motore resta responsabile dell’unica risoluzione profilo. settingsPolicy valida valori finiti, intervallo e passo prima di sostituire configurazione; l’ultimo config valido resta se un aggiornamento viene rifiutato. Il reset riusa i default canonici (incluso Balanced), non il risultato di resolveBackgroundConfig. Nessuna persistenza: close conserva il config della sessione, reload lo ripristina. Velocità0 e intensità0 fermano il pool pioggia; nebbia0 rimuove il velo, particelle0 azzera il pool, neon0 rimuove il layer. Glitch false rimuove distorsioni senza cambiare regione/scanline. Valori impostati ed effettivi sono distinti e visibili.

BackgroundSettings è un dialog non modale con label/input/select nativi, focus iniziale sul profilo, Tab/Shift+Tab e frecce native. Escape/BrowserBack/GoBack e Chiudi riportano alla prima app. useTvFocus ignora eventi originati in [data-background-tools] (come già faceva per form/dialog), così l’opener può usare Enter e gli slider non attivano il rail. Le altre interazioni Home mantengono il focus manager. Il pannello scorre internamente nelle finestre piccole; non ha animazioni o pannelli di dati inventati. Pointer-events none resta limitato ai layer decorativi.

Il monitor2.7 resta sui data attribute del Canvas, non è una misura di FPS della UI del pannello. La riga Effettivi descrive configurazione/pool, non FPS misurati; indica obiettivo30fps e sospensione quando animated=false. I controlli possono essere modificati anche in Eco o con reduced motion, senza forzare ripresa.

Collaudo completo (preview produzione5187, Vite5188):

```bash
BACKGROUND_TEST_URL=http://127.0.0.1:5188/ PROFILE_TEST_URL=http://127.0.0.1:5188/scripts/fixtures/background-profiles.html node scripts/verify-shell.mjs
```

BACKGROUND_TEST_URL attiva i controlli di assenza in produzione, opt-in sviluppo, apertura nativa, ogni controllo live, profili/reset/Escape/Home, reduced motion e reload. Senza questa variabile non si dichiarano verificati i controlli del pannello. Evidenze in docs/verification/phase-2.8/; nessuna prova webOS o garanzia prestazionale.
