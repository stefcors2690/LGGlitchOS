# Animation specification — StefCors GL1tCh 0S

## Policy corrente alla 3.3 — 2026-11-10

Motore fase2 completato in browser; stato e ripresa in [HANDOFF](docs/HANDOFF.md) e [PROJECT_STATUS](PROJECT_STATUS.md). La3.3 aggiunge idle e dissolvenze senza cambiare asset, tarature o profili. Verifiche correnti nel [rapporto3.3](docs/verification/phase-3.3/report.md); prove prestazionali2.9/2.10 restano storico separato, nessuna misura GPU/G5. Le sezioni successive conservano comportamenti storici sostituiti.

Home e logo si animano automaticamente salvo prefers-reduced-motion, pagina nascosta o inattività. Attesa **120.000ms** confermata dall'utente: opacità CSS della shell e del dialogo0,45 in600ms, sfondo/logo fermi, focus preservato. Primo input ripristina in180ms ed esegue la sua normale azione, senza essere consumato. Hidden sospende il timer e al ritorno concede un nuovo periodo intero. Input catturati senza interferire con i gestori; pointer fermo e aggiornamenti automatici non sono attività. Nessun controllo manuale finale o scrittura storage.

Ingresso dialogo: dissolvenza220ms, solo opacity (nessun transform che sposti i tool fissi); keyframe finale rispetta --idle-opacity. Movimento ridotto disabilita tutte queste transizioni/animazioni, ma lascia possibile l'attenuazione statica. Idle usa un timeout coalescente e clock monotono, nessun RAF/interval o React update per frame. Non è modifica alla luminosità hardware o protezione OLED certificata.

Background originale fermo, nessuna camera animata, video soltanto riferimento, navette legacy non montate. Layer attivi quando consentiti: pioggia/particelle in un unico Canvas/RAF, nebbia, neon e ologramma localizzati. Preservare tarature approvate e maschere nel config.

Balanced è il default anche in produzione; Cinematic/Eco sono profili del motore. Pannelli backgroundDebug/remoteDebug solo dev e opt-in, inizialmente chiusi. Target30fps e capFull HD non certificano il G5. IDLE_TEST=1 verifica attese reali, STABILITY_MS tiene invece la scena attiva con Shift DOM periodico dichiarato nei risultati; non confondere i due scenari. Profiling allocazioni2.9 separato; asset locali senza percorsi runtime legati al vecchio PC.

## Logo v3 — slow cinematic glitch
- Canonical asset: `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg`.
- Cycle: **9 seconds**, with two distortion windows at approximately 1.2–2.0s and 5.1–6.1s.
- Preserve visible text exactly: **StefCors GL1tCh 0S** (digit 1, digit 0).
- RGB chromatic split, horizontal slices, short jitter, scanline, then clean readable recovery.
- Prefer subtle glow between glitches; no continuous intense flashing.
- `prefers-reduced-motion: reduce` disables animations.
- Test SVG standalone in Chrome/Edge via `assets/branding/preview.html`, then embedded via `<img>`, then on webOS. Some viewers display a static frame.
- Never use the image mockup as a baked background containing fake interactive buttons. Recreate all controls in React.

## TV animation rules
- Target smooth navigation and focus feedback; use transform/opacity rather than costly layout animation.
- Focus transition 180–300ms; screen transition 350–650ms; boot sequence optional and skippable.
- Video wallpaper must have a static fallback, quality setting, pause-on-idle, and reduced-motion option.
- Avoid full-screen flashing, high-frequency flicker and persistent OLED-bright stationary highlights.

## Browser integration verified in 0.4

`BrandLogo` keeps the canonical SVG as the normal image source. For `prefers-reduced-motion`, a picture source uses a still version derived from that same SVG, with animations and ghost/slice layers disabled. This avoids retained glitch frames observed when an external SVG image is decoded under browser motion emulation. No separately drawn logo is maintained. An image error falls back to the exact brand name as text.

Chrome headless checks and screenshots are documented in `docs/verification/phase-0.4.md`. The normal standalone SVG timeline advances for two cycles; static source and reduced-motion behavior are verified automatically. Edge, real webOS rendering and visual observation of every animation frame remain unverified. Manual motion setting and idle dimming remain later roadmap work.

## City backdrop — microphase 1.1

- Original static SVG layers; transforms/opacity animate foreground drift (42s), mist (56s), rain (1.4s) and two craft paths (43s/67s, phase offsets and long hidden portions). No per-frame React state, flashing lights, shaders or video decoder.
- Craft artwork and trail are original and remain behind all UI. Paths have distinct scale/direction/depth; timing is deterministic and not randomized.
- `useBackgroundMotion` combines system reduced motion, document visibility and manual pause. Reduced motion overrides manual resume. Manual pause survives hide/show within the mounted component, but is not persisted across reloads.
- Reduced motion disables decorative animations and hides rain/craft. Manual pause suspends the backdrop and hides rain/craft, leaving a static city. Logo animation has its separate policy from 0.4; the backdrop pause control does not claim to pause the brand logo.
- Tab/Enter/Space operate the background button; full D-pad focus is still 1.4. Idle-based pausing/dimming is still 3.3; hook this background policy into that future idle state.
- Browser evidence: `docs/verification/phase-1.1/report.md`. No 60fps or OLED/device performance guarantee until hardware measurement.

## Approved background correction — 2026-11-09

The user-selected references/background.png replaces the generated city layers. No drift is applied to the full image: only separate fog/rain/additional shuttle layers animate. Artwork already painted in the PNG remains static. Pausing, reduced motion and hidden-page behavior are unchanged. Latest browser evidence is in docs/verification/phase-1.1-background/report.md; the earlier vector-scene evidence is historical.

## Global settings — microphase 1.8

Motion settings persist validated reduced/logo booleans in localStorage (glitchos.motion.v1), with safe defaults and session-only fallback on storage errors. System reduction OR user reduction disables background, shuttles, logo and CSS animations/transitions. The logo uses an unconditional still picture source when its preference is off, reduction is active or the page is hidden; the canonical SVG remains the image fallback and normal source. Visibility restores the policy and may restart the logo cycle. Background pause remains independent and session-only. System matchMedia changes apply live. No idle dimming yet (3.3). Browser evidence: docs/verification/phase-1.8/report.md.

## Policy corrente — animazioni fisse, senza controlli

Su richiesta utente rimossi “Movimento e logo” e “Pausa sfondo”: nessun pannello o preferenza modificabile nella Home. Sfondo e logo animati automaticamente quando la pagina è visibile e il sistema non richiede movimento ridotto. Reduced motion e pagina nascosta continuano a fermarli automaticamente. La vecchia chiave localStorage glitchos.motion.v1 è ignorata; le precedenti descrizioni di impostazioni e pausa sono storico, sostituite da questa decisione. Primo input direzionale e Back tornano al rail; frecce tra rail e widget. Evidenze correnti in docs/verification/fixed-motion/.

## Evoluzione pianificata — fase 2

Seguire [specifica del motore](docs/specs/CYBERPUNK_BACKGROUND_ENGINE.md): React/TypeScript/Canvas 2D e CSS per effetti efficienti, camera ferma, immagine originale preservata, video solo riferimento. Controller RAF con pooling/DPR limitato, resize, cleanup, pagina nascosta e reduced motion; effetti separati e localizzati, nessun flash continuo. Balanced default e obiettivo 30 fps G5 non ancora misurato. Migrare i layer precedenti senza duplicazioni; veicoli off inizialmente, compresi gli overlay di navette precedenti nel nuovo motore. Pannello autorizzato solo sviluppo/diagnostica esplicita, mai nella Home definitiva. Fase pianificata, non implementata; idle dimming resta nella nuova 3.3.

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
