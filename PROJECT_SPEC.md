# StefCors GL1tCh 0S — Product & Technical Specification

## Contratto corrente e continuità — 2026-11-09

Fasi0/1/2 e3.1 completate in browser; fase3 aperta, versione locale0.3.0. Prossima3.2 — Pointer e simulatore telecomando, ancora da fare. [Handoff su un altro PC](docs/HANDOFF.md), [stato verificato](PROJECT_STATUS.md), [roadmap](ROADMAP.md).

Ultima verifica3.1:141 test/check ed Edge produzione/dev superati, dialoghi app/Riprendi, focus/tasti/fallback e regressioni Home/background verificati. Screenshot1080p/4K/mobile, esiti e limiti nel [rapporto3.1](docs/verification/phase-3.1/report.md). Alias telecomando DOM sintetici distinti da input CDP e dispositivo reale non verificato. Dialoghi nativi webOS, screen reader e altri browser non certificati. La verifica2.10 sotto riguarda lo storico del motore.

Le decisioni correnti sostituiscono le descrizioni storiche numerate più sotto: Home unica senza menu superiore; logo/orologio locale, app e tre widget Demo; niente controlli movimento finali. Motore React/TS/Canvas con immagine originale ferma e overlay, nessun video principale o navetta aggiuntiva montata. Reduced motion e visibilità sempre rispettati, idle dimming ancora in3.3.

I profili fanno parte della produzione: Balanced predefinito, Cinematic ed Eco configurabili nel codice; sceglieremo profilo e tarature fissi dopo prove hardware. Solo il pannello è dev-only con opt-in esplicito; nessuna selezione utente o auto-degrado implementati. Buffer effetti massimoFull HD, target30fps da verificare sul G5. Contratti dettagliati nel README tecnico del background.

Ultima verifica2.10:135 test/lint/typecheck/build e Edge Windows superati. Rimosso il vecchio CityBackdrop/CSS; errore Canvas o contextlost libera subito le risorse con cleanup idempotente, PNG e CSS indipendenti preservati; nessun retry automatico, recupero con config/remount. Motore/effetti off, sorgente assente/ritorno e navigazione nel fallback verificati. Home produzione per5min con risorse e focus stabili, screenshot1080p/4K e differenze residue nel [rapporto2.10](docs/verification/phase-2.10/report.md). Contratto config, tarature e UI invariati; nessuna prova reale TV, API privilegiate, packaging o deploy dichiarata. Profiling allocazioni2.9 resta evidenza separata.

## Vision
A cinematic, responsive, cyberpunk custom Home experience for an LG OLED G5. Approved visual direction: **Neon City + Netrunner**, 16:9, holographic glass panels, rain-soaked futuristic skyline, cyan/magenta highlights, smooth transitions, accessible TV focus states. The approved concept image is a visual reference, **not** a source of functional behavior or assets.

## Core objective
Ultimately replace the stock webOS Home experience, including Home button behavior and startup, **only if confirmed feasible for the exact TV firmware**. No root, system hooks, firmware modification, or privileged operations in the initial phases. Do not claim that an ordinary webOS application can replace the Home button or autostart via official public APIs.

## Target and constraints
- LG OLED G5; firmware and webOS versions **unknown** until inspected on the TV.
- Primary canvas 3840x2160 16:9; design in logical units and scale cleanly to 1920x1080.
- Use React + TypeScript + Vite for the UI, with a webOS packaging layer when supported.
- Primary interaction: LG Magic Remote D-pad, OK, Back, and pointer where supported. Never require touch or mouse.
- Background target:30fps, with explicit quality profiles and static fallback. Measure navigation and background on the actual TV before making performance claims; no automatic profile changes currently implemented.
- OLED-friendly idle dimming and motion reduction; avoid persistent bright static elements.
- No remote tracking, telemetry, or external dependencies without explicit approval.

## Visual design
- Background: stationary user-supplied references/background.png with Canvas rain/particles and localized CSS fog/neon/hologram overlays. Video is reference-only; no camera movement or video wallpaper.
- Header: exact-case StefCors GL1tCh 0S wordmark and local clock. The user removed top navigation; all app/widget interactions live on one Home. No fabricated weather.
- Main app rail: large tiles, active tile luminous magenta/cyan focus border, depth, scale and glow with tasteful motion.
- Lower widgets: Continua a guardare (mock data until real integration is possible), HDMI inputs (mock until capability tested), Home Assistant controls (mock until configured).
- Motion: cinematic but fluid, 180–350ms focus transitions, 400–700ms section transitions; respect reduced motion; no unskippable startup animation.
- Theme tokens: palette, typography, imagery, sound, transitions, focus treatment. Keep themes data-driven so fantasy themes could be added later.
- Use original/licensed visual assets. Third-party app logos only where legally appropriate; no copyrighted film art bundled without license.

## Architecture
Suggested folders:
```
src/
  app/              # app shell, routes, providers
  components/       # reusable UI and widgets
  features/         # apps, inputs, home, settings, smart-home
  navigation/       # remote key map, focus graph, pointer handling
  motion/           # animation policies and effects
  themes/neon/      # tokens and theme components
  platform/         # interfaces, mock adapter, webOS adapter
  assets/           # licensed/original assets
  styles/           # responsive TV-safe CSS
  tests/
webos/             # manifests/packaging after verification
scripts/
```

## Platform interfaces — implemented in microphase 0.3

Source of truth: `src/platform/contracts.ts`. Platform calls are asynchronous and return `Promise<Result<T>>`, including reads and capability discovery. Expected failures are values, not successful empty results or thrown exceptions.

- `Result<T>` is discriminated by `ok`: success contains `data`, failure contains `error: { code, message }`. Both contain `mode: 'demo' | 'device'`.
- Error codes: `UNSUPPORTED`, `NOT_FOUND`, `INVALID_STATE`, `UNAVAILABLE`.
- `PlatformAdapter` exposes `mode`, `deviceInfo`, `appCatalog`, `appLauncher`, `inputSource`, `smartHome`.
- `deviceInfo.getCapabilities()` returns `Result<Capabilities>` with separate capability entries for catalog, launch, input listing/activation and smart-home listing/control.
- Each capability has `status: 'simulated' | 'supported' | 'unsupported'`; unsupported entries include a user-readable `reason`. Simulated capability support never certifies actual TV support.
- `appCatalog.list()` returns `Result<readonly AppInfo[]>`; `appLauncher.launch(appId)` returns `Result<{ appId: string }>`.
- `inputSource.list()` returns `Result<readonly InputInfo[]>`; `activate(id)` returns `Result<InputInfo>`. Input kind is `hdmi | tv`, with explicit active state.
- `smartHome.listDevices()` returns `Result<readonly SmartHomeDevice[]>`; `setState(id, { on: boolean })` returns the updated device. Initial scope is binary switches only; thermostats and blinds need dedicated contracts in a later phase.
- App, input and smart-home records carry their own `mode`. The UI must preserve provenance and display demo labels; mock apps are not evidence of installed TV applications.

`src/platform/mock/MockPlatformAdapter.ts` implements a local-only simulation with per-instance state, generic demo app names (no third-party logos), demo inputs and switches. Successful commands return demo results; they do not launch apps or control hardware. State resets when the adapter is recreated. Reads and command results return copies to protect internal state; DTOs are readonly in TypeScript.

Constructor options `unsupported` and `failures` configure individual scenarios. Keys correspond to the six capability names; `failures` additionally accepts `getCapabilities`. Unsupported capabilities take precedence over simulated runtime failures. Rejected commands do not mutate state. No network, SDK, credentials, persistence or additional dependencies are involved.

The adapter is wired to app catalog/launch in microphase 1.3; input listing/activation is wired to the Home widget in microphase 1.6; smart-home listing and binary switch commands are wired to the Home widget in microphase 1.7. Create one shared instance when platform data is integrated into the UI; recreating it on each render would reset simulated state. Implement actual webOS calls only after verifying public APIs, manifest privileges and device behavior; unsupported functions must show a useful disabled state, not fake success.

## Remote navigation acceptance

### Contratto overlay 3.1

Home unica, con dialoghi informativi per esiti avvio app e ripresa Demo; HDMI/domotica restano inline. Un solo ActionDialog nativo modale posseduto da TvShell, etichettato e descritto, con focus iniziale su Chiudi e Home inerte. Tab/Shift+Tab/frecce restano nel dialogo, OK/Enter/Chiudi o Back/Escape lo chiudono; autorepeat ignorato. Il primo Back chiude solo il modale e ripristina l'origine, il successivo torna alla prima app come prima. Origine assente/non disponibile: prima app utilizzabile, poi altro controllo disponibile. Nessuno stack di sezioni o nuova navigazione superiore.

Feedback inline conservati per errori e browser senza showModal; nessun successo ottimistico. Richieste arrivate mentre un modale è aperto non lo sostituiscono, nessuna coda. Motore e policy movimento continuano indipendenti; pannello background dev non modale separato. API piattaforma e dati Demo invariati. Test e limiti nel [rapporto3.1](docs/verification/phase-3.1/report.md).
- D-pad cycles predictably among top nav, app rail and lower widgets; no traps.
- Focus always visible and stays consistent when UI rerenders.
- OK activates focused tile; Back closes overlays/returns to prior section.
- Pointer hover and click work when available without breaking D-pad focus.
- Long labels truncate or wrap without overflow; 10-foot UI readable from couch.

## Performance & reliability
- No per-frame React state updates for background animation.
- Prefer CSS transforms and opacity; use canvas/WebGL only when benchmarks justify them.
- Preload critical assets; defer secondary widgets; fallback for video decode failure.
- Local mock data; network timeouts and offline states for integrations.
- No startup dependencies on external APIs.
- Unit tests for navigation and adapters; component tests for widgets; manual TV test matrix.

## Safety boundary for system replacement
- Treat root feasibility as **unknown**. Require exact firmware/webOS version and trusted current research before any implementation.
- Never run exploits, patch system partitions, disable integrity protections, install boot hooks, or remap remote system keys without separate user approval and documented rollback plan.
- Keep stock Home untouched until a verified recovery path exists.

## MVP definition
A runnable desktop preview of the approved cyberpunk Home with animated background, keyboard-based remote simulation, focus navigation, functional internal sections, mock apps/inputs/widgets, settings for reduced motion, and clean modular architecture. Include build, lint, tests, and setup instructions.

## Non-goals for MVP
Root, privileged autostart, actual Home button interception, DRM playback integration, accurate cross-app continue-watching, unverified third-party app launching, real smart-home device control.

## Integrated concept art
See `VISUAL_REFERENCE_GUIDE.md` and the four local PNG files in `references/`. `01_home_approved.png` is authoritative for the initial visual implementation; the other images illustrate boot, focus, and alternative HUD details.


## v3 addendum — animated logo
Read `ANIMATION_SPEC.md`; use `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg` as the canonical brand asset. The previous NEON OS wording is legacy and must not appear in the shipped UI. Keep original application logos sourced from official/licensed assets or the TV where permitted; never generate counterfeit app logos.

## Browser shell — implemented in microphase 0.4

- Theme tokens: `src/themes/neon/tokens.css`; local system fonts, semantic palette, sizing, spacing, focus treatment and motion durations. No external font requests.
- `TvShell` provides the structural hierarchy from the approved reference: header, scene space, application zone and three lower widget zones. These are explicitly placeholders without simulated active buttons or real device data.
- The centered 16:9 surface uses CSS sizing (no per-frame React state), 4% horizontal safe margins and 2.5 logical width units vertically. Narrow/portrait windows use natural scrolling flow. Body text scales from ~28px at 1080p to ~56px at 4K.
- `BrandLogo` imports the canonical SVG as an image. A static version is derived from that same source and selected via picture/media for reduced motion, avoiding animated-frame artifacts in external SVG decoding. Image errors show the exact brand text.
- Backdrop now uses the user-selected references/background.png from the 1.1 correction, with CSS gradient fallback. Focus tokens are prepared, but D-pad navigation remains in 1.4; idle dimming remains in 3.3. No idle protection is claimed for this static development screen.
- Browser acceptance evidence and reproduction steps: `docs/verification/phase-0.4.md`, screenshots/metrics alongside it, `scripts/verify-shell.mjs`. Hardware verification remains pending.

## City backdrop — implemented in microphase 1.1

`src/features/background/CityBackdrop.tsx` and city.css render local original vector layers from src/assets/city, mist, rain and two intermittent shuttle paths behind the semantic shell. Assets are generated deterministically by scripts/generate-city.py with provenance recorded alongside the SVGs. No reference screenshot, third-party mark, external service or new package is used.

`src/motion/useBackgroundMotion.ts` subscribes to reduced-motion and document-visibility changes and retains a manual pause flag. Pure policy in backgroundPolicy.ts is unit-tested. The initial server snapshot is static; CSS reduced-motion protection also applies before subscriptions hydrate. The scene is isolated, clipped, pointer-transparent and aria-hidden. Dark overlays maintain readable UI contrast.

The existing shell remains structural; its new background pause button is keyboard accessible via native button behavior. Catalog/widgets remain disconnected from mock data; D-pad, persistent motion settings and idle dimming remain in their respective phases. Browser evidence and known hardware limitations are in docs/verification/phase-1.1/report.md.

## Approved image correction — 2026-11-09

The user explicitly selected references/background.png as the actual backdrop. CityBackdrop now imports that PNG directly through CSS/Vite in place of both generated skyline SVGs, without altering the image. The original five mockup screens remain reference-only. PNG ownership/licensing is not independently asserted; provenance is user supply.

The base image remains stationary; painted ships/rain are not individually animated. Existing independent mist, rain and additional SVG shuttle layers retain pause/reduced-motion/visibility behavior. Gradient fallback and contrast overlays remain. Legacy procedural city assets are retained but not bundled. Latest evidence: docs/verification/phase-1.1-background/report.md.

## Header and sections — implemented in microphase 1.2

ShellHeader exposes native buttons within a named navigation landmark: Home, App, Ingressi, Domotica, Impostazioni. Typed section definitions live in app/sections.ts; TvShell owns current selection and preserves background/motion state across section changes. The selected button has aria-current=page, every button controls the main region, which is labelled by the section title. Native Tab/Enter/Space and pointer interaction are available; cross-zone D-pad remains 1.4. Section selection is in-memory and resets to Home on reload; no routing library or network is involved.

Home retains structural app/widget zones. Other sections provide explicitly introductory/demo content until their features are implemented. No false app/input/device state is displayed. The background pause button stays available in each section.

LocalClock uses Date and Intl.DateTimeFormat with the browser timezone and Italian 24h formatting, updates on a 1s timer and visibilitychange, and cleans up subscriptions on unmount. The time element contains an ISO datetime and accessible local-time label; it is not an aria-live region to avoid repeated announcements. No weather is displayed. Clock tests cover timezone day rollover, DST and the default local timezone. Browser evidence: docs/verification/phase-1.2/report.md.

## App rail — implemented in microphase 1.3

A single MockPlatformAdapter instance in App.tsx feeds TvShell/AppRail. AppRail stays mounted and is hidden outside Home/App, preserving selection and feedback across sections. It loads capabilities before catalog data, preserves unsupported/error/empty distinctions, and shows a disabled launch reason when necessary. Button focus selects a card; click/Enter/Space launch through the typed adapter. A synchronous ref lock prevents concurrent commands, live feedback explicitly identifies demo launches, and expected failures or thrown transport errors never become successful launch messages. Async catalog effects ignore stale results on cleanup.

Seven generically named demo apps use original neutral SVG symbols (not third-party marks). Frames, holographic surfaces and selected-card glow are separate from symbols. The Home scene title remains accessible but is visually hidden to preserve the approved open-city composition. Narrow screens use internal rail scrolling. Full D-pad is 1.4, real app launch remains phase 5.

New flow tests and browser evidence are documented in docs/verification/phase-1.3/report.md, including outstanding visual differences from approved references. No new dependency or network integration.

## D-pad navigation — implemented in microphase 1.4

`navigation/focusGraph.ts` defines logical rows header/controls/rail, bounded movement, stable IDs and destination-row memory. `useTvFocus` discovers only visible, non-inert, natively enabled controls in its root, and listens to browser key events only while focus is in the shell or on body. Editable targets, dialogs, modified keys and external controls are excluded. The first arrow without known focus selects the current header item; subsequent arrows move.

Native button Enter is preserved to avoid duplicate click; OK/Accept/Select aliases invoke a single click. Activation auto-repeat is suppressed. Escape/Back/BrowserBack/Backspace returns Home and focuses its header, without intercepting any system Home key or privileged remote behavior. Native Tab and Space remain available. Hardware-specific webOS delivery remains unverified.

Focus events retain memory per row, and nearest instant scrolling reveals offscreen cards. A scoped MutationObserver repairs only removed/hidden/disabled focus, not normal UI rerenders. Hook event listeners and observer are cleaned up on unmount. Widgets can add typed rows and stable IDs in later phases; full overlay Back/history is still 3.1. Unit graph/key tests and browser acceptance evidence: docs/verification/phase-1.4/report.md. Visual layout from 1.3 is preserved.

## Continue watching — implemented in microphase 1.5

ContinueWatching renders an explicitly fictional local demo item, Neon District (duration 80min, position 38min), with accessible progress, remaining-time label and resume button. Thumbnail uses the user-selected background PNG; no film artwork or streaming history is bundled. Progress is validated, finite and clamped; invalid duration yields unavailable progress rather than NaN. Resume only announces simulation with no player, network or mutation of progress. Message state resets when leaving Home.

The widgets focus row follows the rail. Resume has stable ID watch-neon-district; Up returns to the remembered card and hiding Home recovers focus through the existing manager. Styling follows the reference's left thumbnail, right title/progress and beveled cyan/magenta housing. Browser evidence: docs/verification/phase-1.5/report.md. User-requested interactive browser debug is scheduled after 1.8 and before phase 3; dev server/DevTools are already usable and instructions are in README.

## Smart-home widget — microphase 1.7

Home renders the shared adapter’s two demo switches (light and socket). Native buttons expose role=switch and aria-checked, stable widget focus IDs, explicit demo labels, on/off text and live feedback. State is replaced only after successful setState results; failed/rejected commands preserve displayed state. Capability discovery separates readable devices from unsupported commands, and empty/loading/error states are explicit. A synchronous lock prevents concurrent commands; stale responses after unmount are ignored. Leaving Home unmounts the widget; remount reads current mock state. Reload recreates the adapter. No Home Assistant, thermostat, blind, temperature reading or real device command is integrated. The Domotica section remains introductory.

## Motion settings — implemented in 1.8

Settings exposes two native switch buttons in the widgets focus zone: global reduced motion (otherwise follow system) and logo animation permission. Validated preferences persist locally under glitchos.motion.v1; inaccessible storage falls back to session state with visible feedback. System reduced motion always wins. Global reduction disables CSS animations/transitions and the backdrop; logo is static when reduced, explicitly disabled or page hidden. The canonical SVG remains unchanged and a derived still picture source handles suppression. Background session pause remains independent. Preference changes do not recreate the adapter or reset focus. Next checkpoint is interactive browser debug with user before phase 2.

## Home unica — modifica layout approvata dall’utente

La navigazione superiore per sezioni è stata eliminata su richiesta utente. Header con solo brand e orologio; app, Continua a guardare, ingressi e domotica sono sempre nella Home. Il controllo espandibile “Movimento e logo” contiene le preferenze esistenti. Frecce percorrono controls → rail → widgets → settings (solo se aperte); primo input direzionale e Back/Escape portano alla prima app, Back richiude anche le preferenze. Mantiene badge Demo, sfondo e componenti reali. Questa decisione sostituisce le precedenti indicazioni sulle cinque sezioni; i riferimenti 00/01 restano guida estetica, con eccezione esplicita del menu rimosso. Verifiche correnti: scripts/verify-shell.mjs; vecchio collaudo sezioni conservato in scripts/verify-shell-sections-legacy.mjs, non compatibile con UI attuale.

## Policy corrente — animazioni fisse, senza controlli

Su richiesta utente rimossi “Movimento e logo” e “Pausa sfondo”: nessun pannello o preferenza modificabile nella Home. Sfondo e logo animati automaticamente quando la pagina è visibile e il sistema non richiede movimento ridotto. Reduced motion e pagina nascosta continuano a fermarli automaticamente. La vecchia chiave localStorage glitchos.motion.v1 è ignorata; le precedenti descrizioni di impostazioni e pausa sono storico, sostituite da questa decisione. Primo input direzionale e Back tornano al rail; frecce tra rail e widget. Evidenze correnti in docs/verification/fixed-motion/.

## Nuova fase 2 — Cyberpunk Animated Background Engine (pianificata)

Specifica normativa del nuovo task: [docs/specs/CYBERPUNK_BACKGROUND_ENGINE.md](docs/specs/CYBERPUNK_BACKGROUND_ENGINE.md). Motore React/TypeScript/Canvas modulare, originale references/background.png preservato; assets/cyberpunk-motion-reference.mp4 solo riferimento visivo. Pioggia, nebbia, neon localizzati, volto olografico mascherato e particelle; veicoli predisposti ma inizialmente off. Config tipizzata, Cinematic/Balanced/Eco con Balanced default, obiettivo 30 fps TV da misurare, DPR limitato e fallback statico. Pannello live solo sviluppo/diagnostica esplicita, nessun controllo nella Home definitiva. Cinque milestone distribuite nelle microfasi 2.1–2.10, non ancora implementate.

Le vecchie fasi 2–6 diventano 3–7: qualità interazione 3 (overlay 3.1, idle 3.3), applicazione webOS/deploy 4, integrazioni 5, decisione Home 6, opzionale privilegiato 7. Fase 1 chiusa e immutata; rapporti di verifica e storico precedenti conservano gli ID del momento. Prossima nuova 2.1, non Overlay e Back.

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
