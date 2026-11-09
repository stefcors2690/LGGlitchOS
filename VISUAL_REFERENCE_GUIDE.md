# StefCors GL1tCh 0S — Visual Reference Guide

## Composizione corrente approvata — 2026-11-09

Checkpoint2.10: integrazione del motore browser completata senza variazioni di layout o tarature; screenshot1080p/4K e fallback ispezionati con PNG e riferimenti00/01. Le differenze residue di header, simboli Demo e pannelli sono esplicite nel [rapporto2.10](docs/verification/phase-2.10/report.md); nessuna piena fedeltà visiva dichiarata. Prossima3.1, conservare questa direzione. Il vecchio CityBackdrop/CSS è stato rimosso dal sorgente.

La direzione estetica00/01 resta prioritaria, con eccezioni esplicite richieste dall'utente: Home unica, menu superiore rimosso, testi introduttivi sullo sfondo rimossi, controlli Movimento e logo/Pausa sfondo rimossi. Brand/orologio, rail e tre widget Demo restano. Il pannello tecnico2.8 compare soltanto con opt-in Vite dev e non fa parte della composizione finale.

Usare references/background.png come scenografia effettiva, senza modificarla; gli altri mockup non devono essere usati come UI piatta. Nessuna navetta aggiuntiva attualmente montata. Policy sistema/visibilità per le animazioni; idle dimming futuro. [Handoff e asset necessari sul nuovo PC](docs/HANDOFF.md). Le sezioni storiche seguenti vanno interpretate secondo queste decisioni.

All images in `references/` are concept art generated for this project, not production-ready application screens or editable component layouts. Recreate UI as accessible React components, not a flattened screenshot. Images are reference assets; do not hardcode sample weather, time, app availability, watch progress, or smart-home state as real data.

## Priority and screens

1. `references/00_brand_home.png` — **CURRENT BRAND REFERENCE**. This shows the approved naming and brand treatment, original recognizable app marks and the overall composition. Use it as the primary naming and logo reference.
2. `references/01_home_approved.png` — **APPROVED PRIMARY DESIGN**. This is the canonical layout and aesthetic. Preserve its hierarchy of immersive city, app carousel and three lower widget zones; the user explicitly removed top navigation. Use the visual as the main reference for implementation. The mockup contains fictional/sample values.
3. `references/02_boot_sequence.png` — Concept for an optional, **skippable** startup animation. This does not imply control of the physical TV boot process or automatic launch on webOS. Use only when app launches.
4. `references/03_app_focus.png` — Focus and carousel interaction inspiration: selected tile lifts, grows slightly, holographic platform/rings appear, and neighboring tiles remain readable. Avoid excessive movement and focus loss.
5. `references/04_home_alternative.png` — Alternative composition and HUD/widget treatments. Secondary inspiration; never override the approved primary layout without asking.

## Visual implementation requirements

- Design at 16:9 and test at 1920x1080 and 3840x2160, including TV-safe margins and readable 10-foot typography.
- Use dark midnight blues and near-black surfaces; cyan and magenta highlights; restrained glow, atmospheric rain and subtle city parallax.
- Separate visual layers: city backdrop, optional weather/rain effect, decorative HUD, semantic UI components, focus layer.
- App rail must have deterministic keyboard/D-pad focus and accessible names. Support Back/Escape and Enter/OK.
- Preserve clear hierarchy over the busy backdrop with contrast overlays; don't put critical labels directly on bright signage.
- Animation target: fluid on real TV hardware, progressive enhancement, reduced-motion and idle dimming.
- Use only the approved scenery PNG as the actual background; keep controls as real components and animate independent overlays. Never animate or display a flattened reference screenshot as the interactive UI.
- The sample logo/wordmark and app logos are visual references, not guaranteed exact vector assets. Rebuild with components or legally usable assets.

## Acceptance checkpoints

- Home structure visually resembles approved reference rather than a generic dashboard.
- Focus states are clearly legible and function with D-pad alone.
- Background animations do not interfere with interaction and can be disabled.
- No fabricated live TV/device data or unsupported app launch promises.
- Browser mock works without root; webOS system replacement remains an independent feasibility track.

## Brand and application icon policy
- The exact, case-sensitive project display name is **StefCors GL1tCh 0S** (digit 1 in GL1tCh and digit 0 in 0S). Never silently normalize it to Glitch OS or Neon OS.
- Create an original vector/SVG brand symbol inspired by digital interference and an angular S/C monogram; do not trace generated mockup pixels. The brand mark may be animated using lightweight CSS/SVG effects.
- Keep brand assets separate from third-party app assets. Never apply a glitch filter, recolor, redrawing, or stylized font to official app logos. Animate the containing card, glow and focus frame instead.
- Prefer installed webOS app metadata/icon assets where publicly available; otherwise use official brand assets with appropriate usage rights and provenance. Do not package AI-generated approximations as official logos. Provide a neutral fallback icon if an authentic asset cannot be obtained.
- Demo mockups are illustrative: only show an app as installed when the adapter confirms it.
- The boot image still says the old placeholder name: it is *composition reference only*. The implementation must show StefCors GL1tCh 0S everywhere.


## v3 addendum — animated logo
Read `ANIMATION_SPEC.md`; use `assets/branding/StefCors_GL1tCh_0S_Glitch_Slow.svg` as the canonical brand asset. The previous NEON OS wording is legacy and must not appear in the shipped UI. Keep original application logos sourced from official/licensed assets or the TV where permitted; never generate counterfeit app logos.

## Approved background asset — user update 2026-11-09

Use `references/background.png` as the actual city backdrop, explicitly supplied and selected by the user. It contains scenery without UI controls and is therefore an exception to the reference-only treatment of the five concept screens. Import it directly through Vite from the background CSS; preserve the source image unchanged. Use cover/center framing for the 16:9 surface. Do not replace it with procedural buildings or claim it was generated by this repository.

Keep UI, rain/mist and additional animated shuttles separate. Ships, rain streaks and reflections already painted into the PNG remain static; this is not a layered source image. Avoid animating the full image to imply separately moving objects. Dark contrast overlays may be used without obscuring the approved art excessively. Asset rights/provenance beyond user supply have not been independently established.

## Priorità visiva esplicita — 2026-11-09

L’utente richiede **massima fedeltà visiva ai riferimenti**, non una reinterpretazione o un dashboard generico. Branding: `references/00_brand_home.png`; composizione/layout: `references/01_home_approved.png`; sfondo effettivo: `references/background.png`. Gli altri mockup restano secondari e non devono introdurre una direzione diversa.

Riprodurre gerarchia, proporzioni, posizioni, densità, margini, tipografia leggibile, cornici olografiche, glow cyan/magenta e trattamento del focus. Usare componenti reali e loghi terzi autentici o fallback neutri; non incorporare il mockup completo come UI e non presentare i dati dei mockup come reali.

Prima di completare una fase visiva, confrontare gli screenshot 1080p/4K con i riferimenti prioritari e documentare differenze residue e verifiche. Le funzionalità di fasi future possono restare incomplete, ma lo stile e la geometria degli elementi già implementati devono convergere al riferimento. Non dichiarare fedeltà completa finché restano differenze evidenti; evitare semplificazioni o cambi di direzione non richiesti. L’attuale shell/header è una base funzionante e richiede ancora allineamento visivo al riferimento.

## Pulizia sezioni — feedback browser

Su richiesta utente, tutte le sezioni mantengono lo sfondo libero come Home: eyebrow, titoli promozionali, descrizioni introduttive e nota decorativa della scena non sono visibili. Titoli e descrizioni rimangono accessibili; pannelli funzionali e badge Demo restano visibili; menu e controllo movimento sono stati poi rimossi.

## Home unica — modifica layout approvata dall’utente

La navigazione superiore è stata eliminata su richiesta utente. Header con brand e orologio; app, Continua a guardare, ingressi e domotica sono sempre nella Home. Frecce tra rail e widget, primo input direzionale e Back/Escape tornano alla prima app. Nessun controllo Movimento e logo/Pausa sfondo. Il pannello tecnico dev usa controlli nativi e chiudendosi torna alla prima app. I riferimenti00/01 restano guida estetica, con l'eccezione del menu rimosso. Collaudo corrente scripts/verify-shell.mjs; lo script sezioni legacy non descrive la UI corrente.
